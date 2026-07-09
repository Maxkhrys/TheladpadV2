import { useShop } from '../../context/ShopContext';
import Photo from '../Photo';
import { getBarberProfile } from '../../data/barberProfiles';

export default function StepBarber({ value, onChange, onNext }) {
  const { barbers, loading } = useShop();

  return (
    <div>
      <h2 className="font-display text-2xl text-text-primary mb-6">Choose your barber</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <button
          type="button"
          onClick={() => onChange('any')}
          className={`card-surface p-5 text-left min-tap ${value === 'any' ? 'border-copper shadow-copper' : ''}`}
        >
          <div className="h-16 w-16 rounded-full bg-copper/15 border border-copper/40 flex items-center justify-center mb-3">
            <span className="font-display text-xl text-copper">?</span>
          </div>
          <p className="text-text-primary font-medium text-sm">Any Available</p>
          <p className="text-text-muted text-xs mt-1">First free slot</p>
        </button>

        {(loading ? Array.from({ length: 3 }) : barbers).map((barber, i) =>
          barber ? (
            <button
              type="button"
              key={barber.id}
              onClick={() => onChange(barber.id)}
              className={`card-surface overflow-hidden text-left min-tap ${value === barber.id ? 'border-copper shadow-copper' : ''}`}
            >
              <Photo src={getBarberProfile(barber.name).photo} alt={barber.name} className="h-24 w-full" />
              <div className="p-3">
                <p className="text-text-primary font-medium text-sm">{barber.name}</p>
                <p className="text-text-muted text-xs mt-0.5">{barber.specialty}</p>
              </div>
            </button>
          ) : (
            <div key={i} className="card-surface h-32 animate-pulse" />
          )
        )}
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={onNext} disabled={!value} className="btn-copper min-tap disabled:opacity-50">
          Continue
        </button>
      </div>
    </div>
  );
}
