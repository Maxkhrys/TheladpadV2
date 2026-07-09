import { motion } from 'framer-motion';

export default function AppointmentCard({ booking, isToday, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`card-surface p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${isToday ? 'border-copper/60' : ''}`}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-text-primary font-medium">{booking.customerName}</p>
          {isToday && <span className="text-[10px] uppercase tracking-widest2 text-copper">Today</span>}
        </div>
        <p className="text-text-muted text-xs">
          {booking.service?.name} · {booking.date} at {booking.time}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-copper-soft font-display text-lg">
          €{Number(booking.amountPaid || booking.service?.price || 0).toFixed(2)}
        </span>
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest2 border ${
            booking.paymentStatus === 'paid'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-copper/15 text-copper-soft border-copper/40'
          }`}
        >
          {booking.paymentStatus}
        </span>
      </div>
    </motion.div>
  );
}
