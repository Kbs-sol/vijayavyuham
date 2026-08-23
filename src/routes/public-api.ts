import { Hono } from 'hono';
import { Bindings } from '../types';

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

    await c.env.DB.prepare(
      `INSERT INTO enquiries (name, email, phone, subject, message, service_interest, source_page)
       VALUES (?,?,?,?,?,?,?)`
    ).bind(
      name,
      (b.email || '').trim() || null,
      (b.phone || '').trim() || null,
      (b.subject || '').trim() || null,
      message,
      (b.service_interest || '').trim() || null,
      (b.source_page || '').trim() || null
    ).run();
    return c.json({ ok: true });
  } catch (e) {
    return c.json({ error: 'Something went wrong. Please try again.' }, 500);
  }
});

export default api;
