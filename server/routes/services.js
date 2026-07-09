import { Router } from 'express';
import { nanoid } from 'nanoid';
import { db, persist } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ services: db.data.services });
});

router.post('/', requireAdmin, async (req, res) => {
  const { name, price, duration, description } = req.body;
  if (!name || price == null || !duration) {
    return res.status(400).json({ error: 'Name, price and duration are required' });
  }
  const service = {
    id: nanoid(),
    name,
    price: Number(price),
    duration: Number(duration),
    description: description || '',
  };
  db.data.services.push(service);
  await persist();
  res.status(201).json({ service });
});

router.patch('/:id', requireAdmin, async (req, res) => {
  const service = db.data.services.find((s) => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const { name, price, duration, description } = req.body;
  if (name !== undefined) service.name = name;
  if (price !== undefined) service.price = Number(price);
  if (duration !== undefined) service.duration = Number(duration);
  if (description !== undefined) service.description = description;

  await persist();
  res.json({ service });
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const idx = db.data.services.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });
  db.data.services.splice(idx, 1);
  await persist();
  res.json({ ok: true });
});

export default router;
