import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';

function pad(n) {
  return String(n).padStart(2, '0');
}

function icsDate(d) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

function buildIcsContent(booking) {
  const duration = booking.service?.duration || 30;
  const start = new Date(`${booking.date}T${booking.time}:00`);
  const end = new Date(start.getTime() + duration * 60000);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Lad Pad Barbershop//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@theladpad.ie`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${booking.service?.name || 'Appointment'} at The Lad Pad Barbershop`,
    `DESCRIPTION:Barber: ${booking.barber?.name || 'The Lad Pad team'}`,
    'LOCATION:5 Castle Hill\\, Centre\\, Carlow\\, R93 XD72',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadIcs(booking) {
  const blob = new Blob([buildIcsContent(booking)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lad-pad-booking.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const MAX_POLL_ATTEMPTS = 8;

export default function ConfirmationScreen({ sessionId, cancelled }) {
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState('loading');
  const [attempts, setAttempts] = useState(0);

  const poll = useCallback(async () => {
    if (!sessionId) {
      setStatus('error');
      return;
    }
    try {
      const res = await api.get(`/bookings/by-session/${sessionId}`);
      setBooking(res.booking);
      setStatus(res.booking.paymentStatus === 'paid' ? 'paid' : 'pending');
    } catch {
      setStatus('error');
    }
  }, [sessionId]);

  useEffect(() => {
    if (cancelled) {
      setStatus('cancelled');
      return;
    }
    poll();
  }, [poll, cancelled]);

  useEffect(() => {
    if (status !== 'pending' || attempts >= MAX_POLL_ATTEMPTS) return;
    const t = setTimeout(() => {
      setAttempts((a) => a + 1);
      poll();
    }, 1500);
    return () => clearTimeout(t);
  }, [status, attempts, poll]);

  if (status === 'cancelled') {
    return (
      <div className="card-surface p-10 text-center">
        <h1 className="font-display text-3xl text-text-primary mb-3">Checkout cancelled</h1>
        <p className="text-text-muted text-sm mb-8">No payment was taken — your slot wasn&rsquo;t held.</p>
        <Link to="/book" className="btn-copper min-tap">
          Try Again
        </Link>
      </div>
    );
  }

  if (status === 'loading' || (status === 'pending' && attempts < MAX_POLL_ATTEMPTS)) {
    return (
      <div className="card-surface p-10 text-center">
        <div className="w-10 h-10 border-2 border-copper/30 border-t-copper rounded-full animate-spin mx-auto mb-6" />
        <p className="text-text-muted text-sm">Confirming your payment…</p>
      </div>
    );
  }

  if (status === 'error' || status === 'pending') {
    return (
      <div className="card-surface p-10 text-center">
        <h1 className="font-display text-3xl text-text-primary mb-3">Still processing</h1>
        <p className="text-text-muted text-sm mb-8">
          Your payment is being confirmed — this can take a minute. Check your email shortly, or
          get in touch if you don&rsquo;t hear from us.
        </p>
        <Link to="/contact" className="btn-ghost min-tap">
          Contact Us
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface p-10 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="w-16 h-16 rounded-full bg-copper/15 border border-copper flex items-center justify-center mx-auto mb-6"
      >
        <svg className="w-8 h-8 text-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </motion.div>
      <p className="label-eyebrow justify-center mb-2">You&rsquo;re Booked In</p>
      <h1 className="font-display text-3xl text-text-primary mb-8">Sicker than your average — see you soon.</h1>

      <dl className="space-y-2 text-sm text-left max-w-xs mx-auto mb-8">
        <div className="flex justify-between">
          <dt className="text-text-muted">Service</dt>
          <dd className="text-text-primary">{booking.service?.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-muted">Barber</dt>
          <dd className="text-text-primary">{booking.barber?.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-muted">Date</dt>
          <dd className="text-text-primary">{booking.date}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-muted">Time</dt>
          <dd className="text-text-primary">{booking.time}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-muted">Paid</dt>
          <dd className="text-copper-soft">€{Number(booking.amountPaid).toFixed(2)}</dd>
        </div>
      </dl>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button type="button" onClick={() => downloadIcs(booking)} className="btn-ghost min-tap">
          Add to Calendar
        </button>
        <Link to="/" className="btn-copper min-tap">
          Back Home
        </Link>
      </div>
    </motion.div>
  );
}
