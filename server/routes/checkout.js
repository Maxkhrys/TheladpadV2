import { Router } from 'express';
import { nanoid } from 'nanoid';
import { db, persist } from '../db.js';
import { stripe } from '../services/stripe.js';
import { assignBarberForSlot } from '../services/scheduling.js';

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// POST /api/bookings/checkout — creates a pending booking and a Stripe Checkout Session
router.post('/', async (req, res) => {
  try {
    const {
      barberId,
      serviceId,
      date,
      time,
      customerName,
      customerEmail,
      customerPhone,
      notes,
      location,
    } = req.body;

    if (!serviceId || !date || !time || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ error: 'Missing required booking details' });
    }

    const locationId = location || 'carlow';
    const loc = db.data.locations.find((l) => l.id === locationId);
    if (!loc) return res.status(400).json({ error: 'Invalid location' });

    const service = db.data.services.find((s) => s.id === serviceId);
    if (!service) return res.status(400).json({ error: 'Invalid service' });

    // Synchronous check-and-reserve (no awaits between here and db.data.bookings.push)
    // so two simultaneous requests can never both claim the same slot.
    const assignedBarber = assignBarberForSlot({ location: loc, date, time, serviceId, barberId });
    if (!assignedBarber) {
      return res.status(409).json({ error: 'That slot is no longer available. Please choose another time.' });
    }

    const booking = {
      id: nanoid(),
      customerName,
      customerEmail,
      customerPhone,
      notes: notes || '',
      barberId: assignedBarber.id,
      requestedAnyBarber: !barberId || barberId === 'any',
      serviceId,
      date,
      time,
      status: 'pending',
      paymentStatus: 'unpaid',
      stripeSessionId: null,
      amountPaid: 0,
      location: locationId,
      createdAt: new Date().toISOString(),
    };
    db.data.bookings.push(booking);
    await persist();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(service.price * 100),
            product_data: {
              name: service.name,
              description: `${service.duration} min · ${loc.name}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        barberId: assignedBarber.id,
        serviceId: service.id,
      },
      success_url: `${CLIENT_URL}/book/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/book?cancelled=1`,
    });

    booking.stripeSessionId = session.id;
    await persist();

    res.json({ url: session.url, sessionId: session.id, bookingId: booking.id });
  } catch (err) {
    console.error('[checkout] error creating session', err);
    res.status(500).json({ error: 'Could not start checkout. Please try again.' });
  }
});

export default router;
