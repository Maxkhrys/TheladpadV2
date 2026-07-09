import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../lib/format';

export default function StepService({ value, onChange, onNext, onBack }) {
  const { services, loading } = useShop();

  return (
    <div>
      <h2 className="font-display text-2xl text-text-primary mb-6">Choose your service</h2>
      <div className="space-y-3 mb-8">
        {(loading ? Array.from({ length: 4 }) : services).map((service, i) =>
          service ? (
            <button
              type="button"
              key={service.id}
              onClick={() => onChange(service.id)}
              className={`w-full card-surface p-5 flex items-center justify-between text-left min-tap ${
                value === service.id ? 'border-copper shadow-copper' : ''
              }`}
            >
              <div>
                <p className="text-text-primary font-medium">{service.name}</p>
                <p className="text-text-muted text-xs mt-1">
                  {service.duration} min · {service.description}
                </p>
              </div>
              <span className="font-display text-xl text-copper-soft shrink-0 ml-4">{formatPrice(service.price)}</span>
            </button>
          ) : (
            <div key={i} className="card-surface h-20 animate-pulse" />
          )
        )}
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-ghost min-tap">
          Back
        </button>
        <button type="button" onClick={onNext} disabled={!value} className="btn-copper min-tap disabled:opacity-50">
          Continue
        </button>
      </div>
    </div>
  );
}
