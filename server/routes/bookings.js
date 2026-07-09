import { Router } from 'express';
import { db, persist } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

function enrichBooking(b) {
  const service = db.data.services.find((s) => s.id === b.serviceId);
  const barber = db.data.users.find((u) => u.id === b.barberId);
  return {
    ...b,
    service: service
      ? { id: service.id, name: service.name, price: service.price, duration: service.duration }
      : null,
    barber: barber ? { id: barber.id, name: barber.name } : null,
  };
}

// Staff: my bookings
router.get('/mine', requireAuth, (req, res) => {
  const { from, to } = req.query;
  let bookings = db.data.bookings.filter((b) => b.barberId === req.user.id);
  if (from) bookings = bookings.filter((b) => b.date >= from);
  if (to) bookings = bookings.filter((b) => b.date <= to);
  bookings = [...bookings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  res.json({ bookings: bookings.map(enrichBooking) });
});

// Admin: all bookings, filterable + sortable
router.get('/', requireAdmin, (req, res) => {
  const { staffId, from, to, paymentStatus, status, sort = 'date', order = 'desc' } = req.query;
  let bookings = db.data.bookings;
  if (staffId) bookings = bookings.filter((b) => b.barberId === staffId);
  if (from) bookings = bookings.filter((b) => b.date >= from);
  if (to) bookings = bookings.filter((b) => b.date <= to);
  if (paymentStatus) bookings = bookings.filter((b) => b.paymentStatus === paymentStatus);
  if (status) bookings = bookings.filter((b) => b.status === status);

  const enriched = bookings.map(enrichBooking);
  enriched.sort((a, b) => {
    let av, bv;
    if (sort === 'amount') {
      av = a.amountPaid;
      bv = b.amountPaid;
    } else if (sort === 'customer') {
      av = a.customerName.toLowerCase();
      bv = b.customerName.toLowerCase();
    } else {
      av = a.date + a.time;
      bv = b.date + b.time;
    }
    const cmp = av > bv ? 1 : av < bv ? -1 : 0;
    return order === 'asc' ? cmp : -cmp;
  });

  res.json({ bookings: enriched });
});

// Public: fetch booking by Stripe session id (used by the confirmation page)
router.get('/by-session/:sessionId', (req, res) => {
  const booking = db.data.bookings.find((b) => b.stripeSessionId === req.params.sessionId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json({ booking: enrichBooking(booking) });
});

// Staff (own bookings) or admin (any booking): update status
router.patch('/:id/status', requireAuth, async (req, res) => {
  const booking = db.data.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (req.user.role !== 'owner' && booking.barberId !== req.user.id) {
    return res.status(403).json({ error: 'Not your booking' });
  }
  const { status } = req.body;
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  booking.status = status;
  await persist();
  res.json({ booking: enrichBooking(booking) });
});

export default router;
