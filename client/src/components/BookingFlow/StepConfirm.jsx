import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { api } from '../../lib/api';
import { formatPrice } from '../../lib/format';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StepConfirm({ data, onChange, onBack }) {
  const { services, barbers } = useShop();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const service = services.find((s) => s.id === data.serviceId);
  const barber = data.barberId !== 'any' ? barbers.find((b) => b.id === data.barberId) : null;

  function validate() {
    const next = {};
    if (!data.customerName.trim()) next.customerName = 'Name is required.';
    if (!data.customerEmail.trim() || !EMAIL_RE.test(data.customerEmail)) next.customerEmail = 'Valid email required.';
    if (!data.customerPhone.trim()) next.customerPhone = 'Phone is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await api.post('/bookings/checkout', data);
      window.location.href = res.url;
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-text-primary mb-6">Your details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="customerName" className="label-eyebrow block mb-2">Name</label>
          <input
            id="customerName"
            className="input-field"
            value={data.customerName}
            onChange={(e) => onChange({ customerName: e.target.value })}
          />
          {errors.customerName && <p className="text-copper-soft text-xs mt-1">{errors.customerName}</p>}
        </div>
        <div>
          <label htmlFor="customerPhone" className="label-eyebrow block mb-2">Phone</label>
          <input
            id="customerPhone"
            className="input-field"
            value={data.customerPhone}
            onChange={(e) => onChange({ customerPhone: e.target.value })}
          />
          {errors.customerPhone && <p className="text-copper-soft text-xs mt-1">{errors.customerPhone}</p>}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="customerEmail" className="label-eyebrow block mb-2">Email</label>
        <input
          id="customerEmail"
          type="email"
          className="input-field"
          value={data.customerEmail}
          onChange={(e) => onChange({ customerEmail: e.target.value })}
        />
        {errors.customerEmail && <p className="text-copper-soft text-xs mt-1">{errors.customerEmail}</p>}
      </div>
      <div className="mb-8">
        <label htmlFor="notes" className="label-eyebrow block mb-2">Notes (optional)</label>
        <textarea
          id="notes"
          rows={3}
          className="input-field resize-none"
          value={data.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Anything we should know?"
        />
      </div>

      <div className="card-surface p-6 mb-8">
        <p className="label-eyebrow mb-4">Booking Summary</p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">Service</dt>
            <dd className="text-text-primary">{service?.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Barber</dt>
            <dd className="text-text-primary">{barber ? barber.name : 'Any available'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Date</dt>
            <dd className="text-text-primary">{data.date}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Time</dt>
            <dd className="text-text-primary">{data.time}</dd>
          </div>
        </dl>
        <div className="hairline mt-4 pt-4 flex justify-between items-center">
          <span className="text-text-muted text-sm">Total due now</span>
          <span className="font-display text-2xl text-copper-soft">{service ? formatPrice(service.price) : '—'}</span>
        </div>
      </div>

      {submitError && <p className="text-copper-soft text-sm mb-4 text-center">{submitError}</p>}

      <div className="flex justify-between items-center gap-4">
        <button type="button" onClick={onBack} className="btn-ghost min-tap">
          Back
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={submitting}
          className="btn-copper min-tap disabled:opacity-60 flex-1 sm:flex-none"
        >
          {submitting ? 'Redirecting…' : `Pay & Confirm — ${service ? formatPrice(service.price) : ''}`}
        </button>
      </div>
    </div>
  );
}
