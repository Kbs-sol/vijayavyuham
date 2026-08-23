// ============================================================
// Data store abstraction
// ------------------------------------------------------------
// Two interchangeable backends behind ONE interface:
//
//   * SupabaseStore — talks to Supabase via its REST (PostgREST)
//     API using SUPABASE_URL + SUPABASE_SERVICE_KEY. Used when
//     those env vars are present.
//
//   * OfflineStore — a module-level in-memory store seeded with
//     the same default content (src/lib/seed-data.ts). Used when
//     Supabase is NOT configured, so the whole site + admin CRUD
//     is fully demonstrable with zero external services.
//
// The route layer only ever talks to `Store`, never to a specific
// backend — so the app behaves identically either way.
// ============================================================
import { Bindings } from '../types';
import { SEED } from './seed-data';

export type Row = Record<string, any>;

export interface Store {
  readonly mode: 'supabase' | 'offline';

  // settings (key/value)
  getSettings(): Promise<Record<string, string>>;
  setSettings(entries: Record<string, string>): Promise<void>;

  // generic collection helpers
  list(table: Collection, opts?: ListOpts): Promise<Row[]>;
  get(table: Collection, id: number | string): Promise<Row | null>;
  getBy(table: Collection, field: string, value: any): Promise<Row | null>;
  insert(table: Collection, data: Row): Promise<Row>;
  update(table: Collection, id: number | string, data: Row): Promise<void>;
  remove(table: Collection, id: number | string): Promise<void>;
  count(table: Collection, where?: Row): Promise<number>;
}

export type Collection =
  | 'services' | 'blogs' | 'gallery' | 'team' | 'testimonials' | 'enquiries';

export interface ListOpts {
  where?: Row;                 // equality filters
  orderBy?: [string, 'asc' | 'desc'][];
  limit?: number;
  neq?: [string, any];         // single "not equal" filter
}

// ------------------------------------------------------------
// Factory — decides which backend to use based on env.
// ------------------------------------------------------------
let _offline: OfflineStore | null = null;

export function getStore(env: Bindings): Store {
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    return new SupabaseStore(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  }
  // Offline singleton persists for the life of the worker instance
  // so admin edits are visible during a demo session.
  if (!_offline) _offline = new OfflineStore();
  return _offline;
}

export function storeMode(env: Bindings): 'supabase' | 'offline' {
  return env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY ? 'supabase' : 'offline';
}

// ============================================================
// Supabase (PostgREST) backend
// ============================================================
class SupabaseStore implements Store {
  readonly mode = 'supabase' as const;
  constructor(private url: string, private key: string) {
    this.url = url.replace(/\/$/, '');
  }

  private headers(extra: Record<string, string> = {}) {
    return {
      apikey: this.key,
      Authorization: `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      ...extra,
    };
  }

  private endpoint(table: string) {
    return `${this.url}/rest/v1/${table}`;
  }

  async getSettings(): Promise<Record<string, string>> {
    const res = await fetch(`${this.endpoint('settings')}?select=key,value`, { headers: this.headers() });
    if (!res.ok) return {};
    const rows = (await res.json()) as { key: string; value: string }[];
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value ?? '';
    return map;
  }

  async setSettings(entries: Record<string, string>): Promise<void> {
    const payload = Object.entries(entries).map(([key, value]) => ({ key, value: String(value ?? ''), updated_at: new Date().toISOString() }));
    if (!payload.length) return;
    // upsert on primary key `key`
    await fetch(`${this.endpoint('settings')}?on_conflict=key`, {
      method: 'POST',
      headers: this.headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(payload),
    });
  }

  private buildQuery(opts?: ListOpts): string {
    const p = new URLSearchParams();
    p.set('select', '*');
    if (opts?.where) for (const [k, v] of Object.entries(opts.where)) p.append(k, `eq.${v}`);
    if (opts?.neq) p.append(opts.neq[0], `neq.${opts.neq[1]}`);
    if (opts?.orderBy) p.set('order', opts.orderBy.map(([c, d]) => `${c}.${d}`).join(','));
    if (opts?.limit) p.set('limit', String(opts.limit));
    return p.toString();
  }

  async list(table: Collection, opts?: ListOpts): Promise<Row[]> {
    const res = await fetch(`${this.endpoint(table)}?${this.buildQuery(opts)}`, { headers: this.headers() });
    if (!res.ok) return [];
    return (await res.json()) as Row[];
  }

  async get(table: Collection, id: number | string): Promise<Row | null> {
    const res = await fetch(`${this.endpoint(table)}?id=eq.${id}&select=*&limit=1`, { headers: this.headers() });
    if (!res.ok) return null;
    const rows = (await res.json()) as Row[];
    return rows[0] ?? null;
  }

  async getBy(table: Collection, field: string, value: any): Promise<Row | null> {
    const res = await fetch(`${this.endpoint(table)}?${field}=eq.${encodeURIComponent(value)}&select=*&limit=1`, { headers: this.headers() });
    if (!res.ok) return null;
    const rows = (await res.json()) as Row[];
    return rows[0] ?? null;
  }

  async insert(table: Collection, data: Row): Promise<Row> {
    const res = await fetch(this.endpoint(table), {
      method: 'POST',
      headers: this.headers({ Prefer: 'return=representation' }),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
    const rows = (await res.json()) as Row[];
    return rows[0] ?? {};
  }

  async update(table: Collection, id: number | string, data: Row): Promise<void> {
    const res = await fetch(`${this.endpoint(table)}?id=eq.${id}`, {
      method: 'PATCH',
      headers: this.headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Supabase update failed: ${res.status} ${await res.text()}`);
  }

  async remove(table: Collection, id: number | string): Promise<void> {
    await fetch(`${this.endpoint(table)}?id=eq.${id}`, { method: 'DELETE', headers: this.headers({ Prefer: 'return=minimal' }) });
  }

  async count(table: Collection, where?: Row): Promise<number> {
    const p = new URLSearchParams();
    p.set('select', 'id');
    if (where) for (const [k, v] of Object.entries(where)) p.append(k, `eq.${v}`);
    const res = await fetch(`${this.endpoint(table)}?${p.toString()}`, {
      headers: this.headers({ Prefer: 'count=exact', Range: '0-0' }),
    });
    const cr = res.headers.get('content-range'); // e.g. "0-0/42"
    if (cr && cr.includes('/')) {
      const total = parseInt(cr.split('/')[1], 10);
      if (!isNaN(total)) return total;
    }
    const rows = (await res.json().catch(() => [])) as Row[];
    return Array.isArray(rows) ? rows.length : 0;
  }
}

// ============================================================
// Offline in-memory backend (seeded demo data)
// ============================================================
class OfflineStore implements Store {
  readonly mode = 'offline' as const;
  private settings: Record<string, string>;
  private data: Record<Collection, Row[]>;
  private seq: Record<Collection, number>;

  constructor() {
    this.settings = { ...(SEED.settings as Record<string, string>) };
    this.data = {
      services: deepClone(SEED.services as unknown as Row[]),
      blogs: deepClone(SEED.blogs as unknown as Row[]),
      testimonials: deepClone(SEED.testimonials as unknown as Row[]),
      gallery: [],
      team: [],
      enquiries: [],
    };
    this.seq = {
      services: maxId(this.data.services),
      blogs: maxId(this.data.blogs),
      testimonials: maxId(this.data.testimonials),
      gallery: 0,
      team: 0,
      enquiries: 0,
    };
  }

  async getSettings(): Promise<Record<string, string>> {
    return { ...this.settings };
  }

  async setSettings(entries: Record<string, string>): Promise<void> {
    for (const [k, v] of Object.entries(entries)) this.settings[k] = String(v ?? '');
  }

  async list(table: Collection, opts?: ListOpts): Promise<Row[]> {
    let rows = this.data[table].slice();
    if (opts?.where) rows = rows.filter((r) => Object.entries(opts.where!).every(([k, v]) => eq(r[k], v)));
    if (opts?.neq) rows = rows.filter((r) => !eq(r[opts.neq![0]], opts.neq![1]));
    if (opts?.orderBy) {
      rows.sort((a, b) => {
        for (const [c, d] of opts.orderBy!) {
          const av = a[c], bv = b[c];
          if (av === bv) continue;
          const cmp = av > bv ? 1 : -1;
          return d === 'desc' ? -cmp : cmp;
        }
        return 0;
      });
    }
    if (opts?.limit) rows = rows.slice(0, opts.limit);
    return deepClone(rows);
  }

  async get(table: Collection, id: number | string): Promise<Row | null> {
    const r = this.data[table].find((x) => String(x.id) === String(id));
    return r ? deepClone(r) : null;
  }

  async getBy(table: Collection, field: string, value: any): Promise<Row | null> {
    const r = this.data[table].find((x) => eq(x[field], value));
    return r ? deepClone(r) : null;
  }

  async insert(table: Collection, data: Row): Promise<Row> {
    const id = ++this.seq[table];
    const row = { id, created_at: new Date().toISOString(), ...data };
    this.data[table].push(row);
    return deepClone(row);
  }

  async update(table: Collection, id: number | string, data: Row): Promise<void> {
    const r = this.data[table].find((x) => String(x.id) === String(id));
    if (r) Object.assign(r, data);
  }

  async remove(table: Collection, id: number | string): Promise<void> {
    this.data[table] = this.data[table].filter((x) => String(x.id) !== String(id));
  }

  async count(table: Collection, where?: Row): Promise<number> {
    if (!where) return this.data[table].length;
    return this.data[table].filter((r) => Object.entries(where).every(([k, v]) => eq(r[k], v))).length;
  }
}

// ------------------------------------------------------------
function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}
function maxId(rows: Row[]): number {
  return rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0);
}
function eq(a: any, b: any): boolean {
  // loose compare so 1 == "1" (numbers stored as ints, filters may be strings)
  return String(a) === String(b);
}
