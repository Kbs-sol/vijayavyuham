#!/usr/bin/env python3
"""Regenerate src/lib/seed-data.ts from seed.sql.
Run:  python3 scripts/gen-seed.py
The offline store and the Supabase seed script both consume src/lib/seed-data.ts.
"""
import re, json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sql = open(os.path.join(ROOT,'seed.sql'), encoding='utf-8').read()

def grab_block(sql, table):
    m = re.search(r'INSERT OR REPLACE INTO '+table+r'\s*\((.*?)\)\s*VALUES', sql, re.S)
    cols = [c.strip() for c in m.group(1).split(',')]
    rest = sql[m.end():]
    return cols, rest[:rest.index(';\n')]

def split_rows(body):
    rows=[]; depth=0; cur=''; inq=False; i=0
    while i < len(body):
        ch=body[i]
        if ch=="'":
            if inq and i+1<len(body) and body[i+1]=="'": cur+="''"; i+=2; continue
            inq=not inq; cur+=ch; i+=1; continue
        if not inq:
            if ch=='(':
                depth+=1
                if depth==1: cur=''; i+=1; continue
            elif ch==')':
                depth-=1
                if depth==0: rows.append(cur); cur=''; i+=1; continue
        cur+=ch; i+=1
    return rows

def split_fields(row):
    fields=[]; cur=''; inq=False; i=0; depth=0
    while i < len(row):
        ch=row[i]
        if ch=="'":
            if inq and i+1<len(row) and row[i+1]=="'": cur+="'"; i+=2; continue
            inq=not inq; i+=1; continue
        if not inq:
            if ch in '[{': depth+=1
            elif ch in ']}': depth-=1
            if ch==',' and depth==0: fields.append(cur.strip()); cur=''; i+=1; continue
        cur+=ch; i+=1
    fields.append(cur.strip()); return fields

def conv(v):
    v=v.strip()
    if v=='' : return ''
    if re.fullmatch(r'-?\d+', v): return int(v)
    return v

raw={}
for table in ['settings','services','testimonials','blogs']:
    cols, body = grab_block(sql, table)
    raw[table]=[{c:conv(f) for c,f in zip(cols, split_fields(r))} for r in split_rows(body)]

settings={row['key']: row['value'] for row in raw['settings']}
def norm(rows, defaults, idx_from=1):
    out=[]
    for i,r in enumerate(rows, idx_from):
        rec={'id':i}
        for k,dv in defaults.items(): rec[k]=r.get(k,dv)
        out.append(rec)
    return out

services=norm(raw['services'], {'slug':'','sort_order':0,'icon':'fa-chart-line','title_en':'','short_en':'','description_en':'','title_te':'','short_te':'','description_te':'','title_hi':'','short_hi':'','description_hi':'','features':'[]','image_url':None,'media_url':None,'is_active':1})
testimonials=norm(raw['testimonials'], {'author_name':'','author_role':'','photo_url':None,'sort_order':0,'quote_en':'','quote_te':'','quote_hi':'','is_active':1})
blogs=norm(raw['blogs'], {'slug':'','category':'General','cover_image':None,'author':'Vijayavyuham Team','title_en':'','excerpt_en':'','content_en':'','title_te':'','excerpt_te':'','content_te':'','title_hi':'','excerpt_hi':'','content_hi':'','meta_title':'','meta_description':'','keywords':'','is_published':1,'published_at':''})

bundle={'settings':settings,'services':services,'testimonials':testimonials,'blogs':blogs}
js  = "// AUTO-GENERATED from seed.sql — default content used by the offline store\n"
js += "// (when Supabase is NOT configured) and to seed a fresh Supabase database.\n"
js += "// Regenerate: python3 scripts/gen-seed.py\n\n"
js += "export const SEED = " + json.dumps(bundle, ensure_ascii=False, indent=2) + " as const;\n"
open(os.path.join(ROOT,'src/lib/seed-data.ts'),'w',encoding='utf-8').write(js)
print('wrote src/lib/seed-data.ts')
