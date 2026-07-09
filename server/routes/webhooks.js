import { Router } from 'express';
import express from 'express';
import { stripe } from '../services/stripe.js';
import { db, persist } from '../db.js';
import { sendBookingConfirmation } from '../services/email.js';

const router = Router();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      console.warn('[webhook] STRIPE_WEBHOOK_SECRET not set — skipping signature verification (dev only)');
      event = JSON.parse(req.body.toString('utf8'));
    }
  } catch (err) {
    console.error('[webhook] signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    const booking = db.data.bookings.find((b) => b.id === bookingId);

    if (booking) {
      booking.status = 'confirmed';
      booking.paymentStatus = 'paid';
      booking.amountPaid = (session.amount_total || 0) / 100;
      booking.stripeSessionId = session.id;
      await persist();

      try {
        await sendBookingConfirmation(booking);
      } catch (err) {
        console.error('[webhook] failed to send confirmation email:', err);
      }
    } else {
      console.warn('[webhook] checkout.session.completed for unknown bookingId:', bookingId);
    }
  }

  res.json({ received: true });
});

export default router;
