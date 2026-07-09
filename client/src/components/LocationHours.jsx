import { summarizeHours } from '../lib/format';

export default function LocationHours({ location }) {
  if (!location) return null;
  const hoursLines = summarizeHours(location.hours);
  const mapQuery = encodeURIComponent(location.address);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 card-surface overflow-hidden">
      <div className="relative min-h-[320px] bg-gradient-to-br from-raised via-surface to-ink grain-overlay flex items-center justify-center">
        <div className="text-center px-8">
          <svg className="w-10 h-10 mx-auto mb-4 text-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          <p className="label-eyebrow justify-center">{location.name}</p>
          <p className="text-text-muted text-sm mt-2 max-w-xs mx-auto">Map embed goes live at launch — find us at Castle Hill in the meantime.</p>
        </div>
      </div>
      <div className="p-10 lg:p-12 flex flex-col justify-center">
        <p className="label-eyebrow mb-3">Find Us</p>
        <h3 className="font-display text-3xl text-text-primary mb-6">{location.address}</h3>
        <ul className="space-y-2 mb-8">
          {hoursLines.map((line) => (
            <li key={line.label} className="flex justify-between max-w-xs text-sm">
              <span className="text-text-muted">{line.label}</span>
              <span className="text-text-primary font-medium">{line.value}</span>
            </li>
          ))}
        </ul>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost self-start min-tap"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}
