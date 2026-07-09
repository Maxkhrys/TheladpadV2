const STATUS_STYLES = {
  pending: 'bg-copper/15 text-copper-soft border-copper/40',
  confirmed: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  completed: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  cancelled: 'bg-red-500/10 text-red-300 border-red-500/30',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest2 border whitespace-nowrap ${STATUS_STYLES[status] || 'border-border-subtle text-text-muted'}`}>
      {status}
    </span>
  );
}

export default function BookingsTable({ bookings, showBarber = true }) {
  if (!bookings || bookings.length === 0) {
    return <p className="text-text-muted text-sm py-10 text-center">No bookings found.</p>;
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted uppercase tracking-widest2 text-[10px] border-b border-border-subtle">
              <th className="py-3 pr-4 font-medium">Customer</th>
              <th className="py-3 pr-4 font-medium">Service</th>
              {showBarber && <th className="py-3 pr-4 font-medium">Barber</th>}
              <th className="py-3 pr-4 font-medium">Date</th>
              <th className="py-3 pr-4 font-medium">Time</th>
              <th className="py-3 pr-4 font-medium">Amount</th>
              <th className="py-3 pr-4 font-medium">Payment</th>
              <th className="py-3 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-border-subtle/60 hover:bg-raised/40 transition-colors">
                <td className="py-3 pr-4 text-text-primary whitespace-nowrap">{b.customerName}</td>
                <td className="py-3 pr-4 text-text-muted whitespace-nowrap">{b.service?.name || '—'}</td>
                {showBarber && <td className="py-3 pr-4 text-text-muted whitespace-nowrap">{b.barber?.name || '—'}</td>}
                <td className="py-3 pr-4 text-text-muted whitespace-nowrap">{b.date}</td>
                <td className="py-3 pr-4 text-text-muted whitespace-nowrap">{b.time}</td>
                <td className="py-3 pr-4 text-copper-soft whitespace-nowrap">
                  €{Number(b.amountPaid || b.service?.price || 0).toFixed(2)}
                </td>
                <td className="py-3 pr-4 capitalize text-text-muted whitespace-nowrap">{b.paymentStatus}</td>
                <td className="py-3 pr-4">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="card-surface p-4">
            <div className="flex justify-between items-start mb-2 gap-2">
              <p className="text-text-primary font-medium">{b.customerName}</p>
              <StatusBadge status={b.status} />
            </div>
            <p className="text-text-muted text-xs mb-1">
              {b.service?.name}
              {showBarber && b.barber ? ` · ${b.barber.name}` : ''}
            </p>
            <div className="flex justify-between items-center mt-3 text-xs">
              <span className="text-text-muted">{b.date} · {b.time}</span>
              <span className="text-copper-soft font-medium">
                €{Number(b.amountPaid || b.service?.price || 0).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
