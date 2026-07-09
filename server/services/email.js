import nodemailer from 'nodemailer';
import { db } from '../db.js';
import { bookingConfirmationTemplate } from '../templates/bookingConfirmation.js';

const FROM_ADDRESS = process.env.EMAIL_FROM || 'The Lad Pad Barbershop <bookings@theladpad.ie>';

/**
 * Transport is chosen entirely by env var so a real provider (Resend, SendGrid, etc.)
 * can be dropped in later by setting EMAIL_TRANSPORT=smtp + the EMAIL_SMTP_* vars —
 * no code change required. Defaults to logging the rendered email to the console.
 */
function buildTransport() {
  const mode = process.env.EMAIL_TRANSPORT || 'console';

  if (mode === 'console') {
    return {
      async sendMail({ to, subject, html }) {
        console.log('\n──────── EMAIL (console transport) ────────');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('--- HTML body ---');
        console.log(html);
        console.log('────────────────────────────────────────────\n');
        return { messageId: `console-${Date.now()}` };
      },
    };
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: Number(process.env.EMAIL_SMTP_PORT || 587),
    secure: process.env.EMAIL_SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS,
    },
  });
}

const transport = buildTransport();

export async function sendEmail({ to, subject, html }) {
  return transport.sendMail({ from: FROM_ADDRESS, to, subject, html });
}

export async function sendBookingConfirmation(booking) {
  const service = db.data.services.find((s) => s.id === booking.serviceId);
  const barber = db.data.users.find((u) => u.id === booking.barberId);
  const location = db.data.locations.find((l) => l.id === booking.location) || db.data.locations[0];

  const html = bookingConfirmationTemplate({ booking, service, barber, location });
  return sendEmail({
    to: booking.customerEmail,
    subject: "You're booked in — The Lad Pad Barbershop",
    html,
  });
}
