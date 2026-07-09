import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { db, persist } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

router.get('/', requireAdmin, (req, res) => {
  res.json({ staff: db.data.users.map(publicUser) });
});

router.post('/', requireAdmin, async (req, res) => {
  const { name, email, password, role, specialty, location } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password and role are required' });
  }
  if (!['owner', 'staff'].includes(role)) {
    return res.status(400).json({ error: 'Role must be owner or staff' });
  }
  const exists = db.data.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'A staff member with that email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: nanoid(),
    name,
    email,
    passwordHash,
    role,
    specialty: specialty || '',
    active: true,
    location: location || 'carlow',
    createdAt: new Date().toISOString(),
  };
  db.data.users.push(newUser);
  await persist();
  res.status(201).json({ user: publicUser(newUser) });
});

router.patch('/:id', requireAdmin, async (req, res) => {
  const user = db.data.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Staff member not found' });

  const { name, email, role, specialty, active, location, password } = req.body;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined && ['owner', 'staff'].includes(role)) user.role = role;
  if (specialty !== undefined) user.specialty = specialty;
  if (active !== undefined) user.active = active;
  if (location !== undefined) user.location = location;
  if (password) user.passwordHash = await bcrypt.hash(password, 10);

  await persist();
  res.json({ user: publicUser(user) });
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const user = db.data.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Staff member not found' });
  user.active = false;
  await persist();
  res.json({ user: publicUser(user) });
});

export default router;
