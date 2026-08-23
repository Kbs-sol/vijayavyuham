import { Hono } from 'hono';
import { Bindings } from '../types';
import { getStore } from '../lib/store';

const api = new Hono<{ Bindings: Bindings }>();

// Submit an enquiry (contact form / quick enquiry)
api.post('/enquiry', async (c) => {
  try {
    const b = await c.req.json();
    const name = (b.name || '').trim();
    const message = (b.message || '').trim();
    if (!name || !message) {
      return c.json({ error: 'Name and message are required.' }, 400);
    }
    // basic honeypot
    if (b.website) return c.json({ ok: true }); // silently accept bots

    const store = getStore(c.env);
    await store.insert('enquiries', {
      name,
      email: (b.email || '').trim() || null,
      phone: (b.phone || '').trim() || null,
      subject: (b.subject || '').trim() || null,
      message,
      service_interest: (b.service_interest || '').trim() || null,
      source_page: (b.source_page || '').trim() || null,
      status: 'new',
      is_read: 0,
    });
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ error: 'Something went wrong. Please try again.' }, 500);
  }
});

export default api;
