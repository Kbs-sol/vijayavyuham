import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';
import publicRoutes from './routes/public';
import publicApi from './routes/public-api';
import adminApi from './routes/admin-api';
import studio from './routes/studio';

const app = new Hono<{ Bindings: Bindings }>();

// CORS for API
app.use('/api/*', cors());

// Public API (enquiry form)
app.route('/api', publicApi);

// Admin API (auth + CRUD)
app.route('/api/admin', adminApi);

// Admin studio (login + dashboard)
app.route('/studio', studio);

// Public website (last, catches page routes + SEO files)
app.route('/', publicRoutes);

export default app;
