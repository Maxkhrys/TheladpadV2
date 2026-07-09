import { db } from '../db.js';

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const SLOT_INTERVAL_MINUTES = 15;
const PENDING_EXPIRY_MINUTES = 15;

export function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins) {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function getDayHours(location, dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  const dayName = DAY_NAMES[date.getDay()];
  return location.hours[dayName] || null;
}

export function isBookingActive(booking) {
  if (booking.status === 'cancelled') return false;
  if (booking.status === 'pending') {
    const createdAt = new Date(booking.createdAt).getTime();
    const ageMinutes = (Date.now() - createdAt) / 60000;
    if (ageMinutes > PENDING_EXPIRY_MINUTES) return false;
  }
  return true;
}

export function getActiveStaffForLocation(locationId) {
  return db.data.users.filter((u) => u.active && u.location === locationId);
}

function getBarberBookingsForDate(barberId, dateStr) {
  return db.data.bookings.filter(
    (b) => b.barberId === barberId && b.date === dateStr && isBookingActive(b)
  );
}

function barberIsFree(barberId, dateStr, startMin, endMin) {
  const bookings = getBarberBookingsForDate(barberId, dateStr);
  return bookings.every((b) => {
    const service = db.data.services.find((s) => s.id === b.serviceId);
    const duration = service ? service.duration : 30;
    const bStart = timeToMinutes(b.time);
    const bEnd = bStart + duration;
    return endMin <= bStart || startMin >= bEnd;
  });
}

/**
 * Returns open slots for a given date/service/barber (or 'any').
 * Each slot lists the barberIds who are actually free at that time.
 */
export function getOpenSlots({ location, date, serviceId, barberId }) {
  const dayHours = getDayHours(location, date);
  if (!dayHours) return [];

  const service = db.data.services.find((s) => s.id === serviceId);
  if (!service) return [];
  const duration = service.duration;

  const openMin = timeToMinutes(dayHours.open);
  const closeMin = timeToMinutes(dayHours.close);

  const candidateBarbers =
    barberId && barberId !== 'any'
      ? getActiveStaffForLocation(location.id).filter((u) => u.id === barberId)
      : getActiveStaffForLocation(location.id);

  const now = new Date();
  const isToday = date === now.toISOString().slice(0, 10);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const slots = [];
  for (let start = openMin; start + duration <= closeMin; start += SLOT_INTERVAL_MINUTES) {
    if (isToday && start <= nowMin) continue;
    const freeBarbers = candidateBarbers.filter((b) => barberIsFree(b.id, date, start, start + duration));
    if (freeBarbers.length > 0) {
      slots.push({ time: minutesToTime(start), barberIds: freeBarbers.map((b) => b.id) });
    }
  }
  return slots;
}

/**
 * Synchronously (no awaits) picks a free barber for the requested slot.
 * Must be called and its result acted on without an intervening await
 * so two simultaneous requests can't both claim the same slot.
 */
export function assignBarberForSlot({ location, date, time, serviceId, barberId }) {
  const service = db.data.services.find((s) => s.id === serviceId);
  if (!service) return null;
  const startMin = timeToMinutes(time);
  const endMin = startMin + service.duration;

  const candidates =
    barberId && barberId !== 'any'
      ? getActiveStaffForLocation(location.id).filter((u) => u.id === barberId)
      : getActiveStaffForLocation(location.id);

  return candidates.find((b) => barberIsFree(b.id, date, startMin, endMin)) || null;
}
