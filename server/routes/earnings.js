import { Router } from 'express';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { db } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

function dateStr(d) {
  return d.toISOString().slice(0, 10);
}

function inRange(dateISO, start, end) {
  return dateISO >= dateStr(start) && dateISO <= dateStr(end);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function computeStaffEarnings(bookings, users) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const paid = bookings.filter((b) => b.paymentStatus === 'paid');

  return users.map((u) => {
    const staffBookings = paid.filter((b) => b.barberId === u.id);
    const weekBookings = staffBookings.filter((b) => inRange(b.date, weekStart, weekEnd));
    const monthBookings = staffBookings.filter((b) => inRange(b.date, monthStart, monthEnd));
    return {
      staffId: u.id,
      name: u.name,
      specialty: u.specialty,
      bookingsCompleted: staffBookings.length,
      totalRevenue: round2(staffBookings.reduce((s, b) => s + b.amountPaid, 0)),
      weekRevenue: round2(weekBookings.reduce((s, b) => s + b.amountPaid, 0)),
      weekBookingsCount: weekBookings.length,
      monthRevenue: round2(monthBookings.reduce((s, b) => s + b.amountPaid, 0)),
      monthBookingsCount: monthBookings.length,
    };
  });
}

// Admin: earnings breakdown per staff member
router.get('/staff', requireAdmin, (req, res) => {
  const staffUsers = db.data.users.filter((u) => u.active);
  res.json({ breakdown: computeStaffEarnings(db.data.bookings, staffUsers) });
});

// Admin: top-line overview numbers
router.get('/overview', requireAdmin, (req, res) => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const paid = db.data.bookings.filter((b) => b.paymentStatus === 'paid');
  const monthPaid = paid.filter((b) => inRange(b.date, monthStart, monthEnd));

  res.json({
    totalRevenueThisMonth: round2(monthPaid.reduce((s, b) => s + b.amountPaid, 0)),
    totalBookings: db.data.bookings.length,
    activeStaffCount: db.data.users.filter((u) => u.active).length,
  });
});

// Any authenticated staff member: their own earnings
router.get('/mine', requireAuth, (req, res) => {
  const [mine] = computeStaffEarnings(db.data.bookings, [req.user]);
  res.json(mine);
});

export default router;
