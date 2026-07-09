import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { db, initDB } from './db.js';
import { seedDatabase } from './data/seed.js';

import webhooksRouter from './routes/webhooks.js';
import authRouter from './routes/auth.js';
import staffRouter from './routes/staff.js';
import barbersRouter from './routes/barbers.js';
import servicesRouter from './routes/services.js';
import locationsRouter from './routes/locations.js';
import availabilityRouter from './routes/availability.js';
import bookingsRouter from './routes/bookings.js';
import checkoutRouter from './routes/checkout.js';
import earningsRouter from './routes/earnings.js';

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Required behind a platform load balancer (Railway, Render, etc.) so
// `secure` cookies and protocol detection work correctly.
app.set('trust proxy', 1);

app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Stripe webhook needs the raw request body for signature verification, so it
// must be mounted before the global JSON body parser below.
app.use('/api/webhooks', webhooksRouter);

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/staff', staffRouter);
app.use('/api/barbers', barbersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/bookings/checkout', checkoutRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/earnings', earningsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  await initDB();

  if (db.data.users.length === 0) {
    console.log('Empty database detected — seeding initial data...');
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`The Lad Pad Barbershop API running on http://localhost:${PORT}`);
  });
}

start();
