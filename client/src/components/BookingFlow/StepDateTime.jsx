import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { api } from '../../lib/api';

export default function StepDateTime({ data, onChange, onNext, onBack }) {
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 60), 'yyyy-MM-dd');

  useEffect(() => {
    if (!data.date || !data.serviceId) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    async function load() {
      setLoadingSlots(true);
      setError('');
      try {
        const params = new URLSearchParams({ date: data.date, serviceId: data.serviceId });
        if (data.barberId && data.barberId !== 'any') params.set('barberId', data.barberId);
        const res = await api.get(`/availability?${params}`);
        if (!cancelled) setSlots(res.slots);
      } catch {
        if (!cancelled) setError('Could not load availability. Try another date.');
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [data.date, data.serviceId, data.barberId]);

  return (
    <div>
      <h2 className="font-display text-2xl text-text-primary mb-6">Choose date &amp; time</h2>

      <label htmlFor="booking-date" className="label-eyebrow block mb-2">Date</label>
      <input
        id="booking-date"
        type="date"
        min={today}
        max={maxDate}
        value={data.date}
        onChange={(e) => onChange({ date: e.target.value, time: '' })}
        className="input-field mb-8 min-tap"
      />

      {data.date && (
        <>
          <label className="label-eyebrow block mb-3">Available Times</label>
          {loadingSlots ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-11 bg-raised rounded-sm animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <p className="text-copper-soft text-sm mb-8">{error}</p>
          ) : slots.length === 0 ? (
            <p className="text-text-muted text-sm mb-8">No slots left that day — try another date.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
              {slots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => onChange({ time: slot })}
                  className={`min-tap py-3 rounded-sm border text-sm transition-colors ${
                    data.time === slot ? 'bg-copper text-ink border-copper' : 'border-border-subtle text-text-primary hover:border-copper/60'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-ghost min-tap">
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!data.date || !data.time}
          className="btn-copper min-tap disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
