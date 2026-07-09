import { Router } from 'express';
import { db } from '../db.js';
import { getOpenSlots } from '../services/scheduling.js';

const router = Router();

router.get('/', (req, res) => {
  const { date, serviceId, barberId, location } = req.query;
  if (!date || !serviceId) {
    return res.status(400).json({ error: 'date and serviceId are required' });
  }

  const locationId = location || 'carlow';
  const loc = db.data.locations.find((l) => l.id === locationId);
  if (!loc) return res.status(404).json({ error: 'Location not found' });

  const slots = getOpenSlots({ location: loc, date, serviceId, barberId });
  res.json({ slots: slots.map((s) => s.time) });
});

export default router;
