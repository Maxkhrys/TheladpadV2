# The Lad Pad Barbershop

Full-stack booking, staff, and admin platform for The Lad Pad Barbershop —
5 Castle Hill, Centre, Carlow, R93 XD72. *Sicker than your average.*

React + Vite frontend, Node/Express backend, lowdb (JSON file) database,
JWT auth, and Stripe Checkout for full prepayment on booking.

## Stack

- **Client**: React 18, Vite, React Router v6, Tailwind CSS, Framer Motion, Recharts, date-fns
- **Server**: Node/Express, lowdb, JWT + bcrypt, Stripe, Nodemailer
- **Database**: `server/data/db.json` (lowdb) — schema is flat and collection-based so it's a
  straightforward swap to Postgres later (one table per collection, same field names)

## Project structure

```
client/    React app (Vite)
server/    Express API
  routes/       one file per resource
  services/     stripe.js, email.js, scheduling.js
  middleware/   auth.js (requireAuth, requireAdmin)
  templates/    booking confirmation email HTML
  data/         seed.js + generated db.json
```

## Setup

Requires Node 18+.

```bash
npm run install:all       # installs root, server, and client deps
cp server/.env.example server/.env
cp client/.env.example client/.env   # optional — only needed if API is on a different origin
```

Fill in `server/.env`:

- `JWT_SECRET` — any long random string
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — from your [Stripe test dashboard](https://dashboard.stripe.com/test/apikeys)
- `STRIPE_WEBHOOK_SECRET` — see below
- `EMAIL_TRANSPORT` — leave as `console` to log emails to the terminal, or switch to `smtp` and fill in the SMTP fields to send real email

Seed the database (creates the owner + staff accounts, services, and the Carlow location):

```bash
npm run seed
```

This prints the seeded login credentials — **change the owner password immediately in a real deployment**.

Run both client and server together:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

### Stripe webhook (local dev)

Booking payments only get marked "paid" and trigger the confirmation email once the
`checkout.session.completed` webhook fires. Locally, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET` in `server/.env` and restart the server.

Without a webhook secret configured, the server will still accept webhook calls in dev
(skipping signature verification) so `stripe trigger checkout.session.completed` also works for quick testing —
but set the real secret before deploying.

## Seeded accounts

| Role  | Email                  | Password      |
|-------|-------------------------|---------------|
| Owner | owner@theladpad.ie      | ChangeMe123!  |
| Staff | cian@theladpad.ie       | ChangeMe123!  |
| Staff | sean@theladpad.ie       | ChangeMe123!  |
| Staff | jamie@theladpad.ie      | ChangeMe123!  |

Owner logs in and lands on `/dashboard/admin`; staff land on `/dashboard`.

## How booking + payment works

1. Customer completes the 4-step flow at `/book` (barber → service → date/time → details).
2. `POST /api/bookings/checkout` atomically re-checks the slot is still free, creates a
   `pending`/`unpaid` booking, and opens a Stripe Checkout Session for the full service price.
3. Customer pays on Stripe's hosted page (card, and Apple Pay / Google Pay automatically
   where supported by the browser).
4. Stripe calls `POST /api/webhooks/stripe` → booking flips to `confirmed`/`paid`, and a
   branded confirmation email is sent (logged to console by default).
5. Customer lands on `/book/confirmation`, which polls the booking status and shows an
   animated confirmation with an "Add to Calendar" `.ics` download.
6. If payment never completes, the booking stays `pending` and is automatically excluded
   from availability after 15 minutes, releasing the slot.

## Deploying (Vercel frontend + Railway API)

The client is a static Vite build (deploys anywhere that serves static files);
the API is a normal long-running Node/Express process with a JSON-file
database, so it needs a host that keeps a persistent process — Vercel's
serverless functions won't work for it as-is. This repo is set up for
**Vercel (frontend) + Railway (API)**, on two different domains.

### 1. API on Railway

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → select this repo.
2. In the service's **Settings**, set **Root Directory** to `server`. Railway will
   detect the Node app from `server/package.json` and run `npm install` / `npm start`
   automatically — no extra config needed.
3. Add these environment variables on the service (Settings → Variables):
   - `NODE_ENV=production`
   - `CLIENT_URL` — your Vercel URL, e.g. `https://theladpad-v2.vercel.app` (no trailing slash)
   - `JWT_SECRET` — a long random string
   - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` — see `.env.example`
   - `EMAIL_TRANSPORT`, and the `EMAIL_SMTP_*` vars if not using the console transport
4. **Persistence**: Railway's default filesystem is wiped on every redeploy. Add a
   [Volume](https://docs.railway.app/reference/volumes) mounted at e.g. `/data`, then set
   `DB_PATH=/data/db.json`. Without this, bookings/staff changes reset to the seed data
   on every deploy (fine for a demo, not for real use).
5. The server seeds itself automatically on first boot if the database is empty — no
   manual seed step needed. Once deployed, copy the public URL Railway gives you
   (Settings → Networking → **Generate Domain**).

### 2. Frontend on Vercel

Vite env vars are baked in at *build* time, so this has to be set before the
build that should use it:

1. Vercel project → **Settings → Environment Variables** → add `VITE_API_URL`
   set to the Railway URL from step 1 (e.g. `https://your-service.up.railway.app`, no
   trailing slash), for the **Production** environment.
2. Redeploy (Deployments tab → latest → **Redeploy**, or push any commit) so the
   build picks up the new env var.
3. `vercel.json` at the repo root already configures the build (`client/` only,
   output `client/dist`) and rewrites non-`/api` routes to `index.html` for
   client-side routing.

Once both are live, update `CLIENT_URL` on Railway if the Vercel URL ever changes
(custom domain, etc.) — CORS and the auth cookie are locked to that exact origin.

## Multi-location readiness

Locations are their own collection (`server/data/db.json` → `locations`), and every
barber and booking carries a `location` field. Only Carlow is seeded, but adding a second
shop is a data change (new location + staff with that `location` id) — no schema or UI rework.

## Notes

- Photography: the real shop logo and one real interior photo (hexagon LED ceiling) are
  bundled in `client/public/images/`. Remaining photography uses Unsplash placeholder URLs
  chosen to match the same dark, architectural aesthetic — swap `client/src/data/media.js`
  for real shoot photography whenever it's ready. Any image that fails to load falls back to
  a branded copper hex-pattern panel rather than a broken image icon.
- Email: `server/services/email.js` picks its transport from `EMAIL_TRANSPORT`. The default
  `console` transport just logs the rendered HTML; setting it to `smtp` and filling in the
  `EMAIL_SMTP_*` vars routes through any SMTP-compatible provider (Resend, SendGrid, etc.)
  with no code changes.
