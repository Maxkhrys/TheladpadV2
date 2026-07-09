import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

function publicBarber(user) {
  return {
    id: user.id,
    name: user.name,
    specialty: user.specialty,
    location: user.location,
  };
}

router.get('/', (req, res) => {
  const { location } = req.query;
  let barbers = db.data.users.filter((u) => u.active);
  if (location) {
    barbers = barbers.filter((u) => u.location === location);
  }
  res.json({ barbers: barbers.map(publicBarber) });
});

export default router;
