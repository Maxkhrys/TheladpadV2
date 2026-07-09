import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

const isProd = process.env.NODE_ENV === 'production';

// In production the client (Vercel) and API (e.g. Railway) live on different
// domains, so the auth cookie needs SameSite=None + Secure to be sent on
// cross-site fetch requests. In dev, Vite's proxy makes everything look
// same-origin to the browser, so Lax (and no Secure, since it's plain HTTP)
// is correct there.
const COOKIE_OPTS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.data.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || !user.active) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user);
  res.cookie('lad_pad_token', token, COOKIE_OPTS);
  res.json({ user: publicUser(user) });
});

router.post('/logout', (req, res) => {
  res.clearCookie('lad_pad_token', { ...COOKIE_OPTS, maxAge: undefined });
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
