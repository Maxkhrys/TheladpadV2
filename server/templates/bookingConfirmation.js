import { format } from 'date-fns';

const INK = '#12100E';
const SURFACE = '#1C1916';
const PAPER = '#F0E6D8';
const TEXT_PRIMARY = '#F5EFE6';
const TEXT_MUTED = '#9A9082';
const COPPER = '#C16B3E';
const COPPER_DEEP = '#8F4E2C';

function formatDate(dateStr) {
  try {
    return format(new Date(`${dateStr}T00:00:00`), 'EEEE d MMMM yyyy');
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr) {
  try {
    return format(new Date(`2000-01-01T${timeStr}:00`), 'h:mmaaa');
  } catch {
    return timeStr;
  }
}

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export function bookingConfirmationTemplate({ booking, service, barber, location }) {
  const logoUrl = `${CLIENT_URL}/images/lad-pad-logo.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>You're booked in — The Lad Pad Barbershop</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PAPER};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${SURFACE};border-radius:4px;overflow:hidden;">

          <tr>
            <td style="background-color:${INK};padding:32px 40px;text-align:center;">
              <img src="${logoUrl}" alt="The Lad Pad Barbershop" width="180" style="display:inline-block;max-width:180px;height:auto;" />
            </td>
          </tr>

          <tr>
            <td style="padding:4px;background-color:${COPPER};"></td>
          </tr>

          <tr>
            <td style="padding:40px 40px 8px 40px;">
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${COPPER};font-weight:600;">Booking Confirmed</p>
              <h1 style="margin:0;font-size:30px;line-height:1.2;color:${TEXT_PRIMARY};font-weight:700;">You&rsquo;re booked in.</h1>
              <p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:${TEXT_MUTED};">
                Nice one, ${booking.customerName.split(' ')[0]}. Your slot is locked in and paid for — here&rsquo;s everything you need.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2E2820;border-radius:4px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #2E2820;">
                    <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${TEXT_MUTED};">Service</p>
                    <p style="margin:4px 0 0 0;font-size:16px;color:${TEXT_PRIMARY};font-weight:600;">${service ? service.name : 'Service'}</p>
                  </td>
                  <td style="padding:16px 20px;border-bottom:1px solid #2E2820;text-align:right;">
                    <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${TEXT_MUTED};">Paid</p>
                    <p style="margin:4px 0 0 0;font-size:16px;color:${COPPER};font-weight:700;">&euro;${Number(booking.amountPaid || (service ? service.price : 0)).toFixed(2)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #2E2820;" colspan="2">
                    <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${TEXT_MUTED};">Barber</p>
                    <p style="margin:4px 0 0 0;font-size:16px;color:${TEXT_PRIMARY};font-weight:600;">${barber ? barber.name : 'A Lad Pad barber'}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;" colspan="2">
                    <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${TEXT_MUTED};">Date &amp; Time</p>
                    <p style="margin:4px 0 0 0;font-size:16px;color:${TEXT_PRIMARY};font-weight:600;">${formatDate(booking.date)} at ${formatTime(booking.time)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:18px 20px;background-color:${INK};border-left:3px solid ${COPPER};border-radius:2px;">
                    <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${TEXT_MUTED};">${location ? location.name : 'The Lad Pad Barbershop'}</p>
                    <p style="margin:6px 0 0 0;font-size:14px;color:${TEXT_PRIMARY};line-height:1.5;">${location ? location.address : '5 Castle Hill, Centre, Carlow, R93 XD72'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 32px 40px;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:${TEXT_MUTED};">
                Need to change something? Give us a shout at least 24 hours before your slot — no-shows and late cancellations may not be refunded. Full details in our cancellation policy.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px;background-color:${INK};text-align:center;">
              <p style="margin:0;font-size:13px;letter-spacing:1px;color:${COPPER_DEEP};text-transform:uppercase;font-weight:700;">Sicker than your average.</p>
              <p style="margin:8px 0 0 0;font-size:12px;color:${TEXT_MUTED};">The Lad Pad Barbershop &middot; 5 Castle Hill, Centre, Carlow, R93 XD72</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
