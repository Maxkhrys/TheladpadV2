import { useState } from 'react';

/**
 * Renders a photograph with the site's warm copper duotone treatment.
 * Falls back to a branded hex-pattern panel (never a broken image icon)
 * if the source fails to load.
 */
const POSITION_CLASS_RE = /(^|\s)(static|fixed|absolute|relative|sticky)(\s|$)/;

export default function Photo({ src, alt = '', className = '', duotone = true, hex = false, imgClassName = '' }) {
  const [errored, setErrored] = useState(false);
  const shapeClass = hex ? 'hex-clip' : '';
  // Only default to `relative` when the caller hasn't specified their own
  // position utility (e.g. `absolute inset-0` for full-bleed heroes) —
  // Tailwind's stylesheet order makes `.relative` beat `.absolute` outright
  // if both classes are present, regardless of their order in the HTML.
  const positionClass = POSITION_CLASS_RE.test(className) ? '' : 'relative';

  if (errored || !src) {
    return (
      <div className={`${positionClass} overflow-hidden bg-gradient-to-br from-raised via-surface to-ink ${shapeClass} ${className}`}>
        <div className="absolute inset-0 grain-overlay" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.14]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hexpattern" width="12" height="20.78" patternUnits="userSpaceOnUse">
              <polygon points="6,0 12,3.5 12,10.4 6,13.9 0,10.4 0,3.5" fill="none" stroke="#C16B3E" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hexpattern)" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${positionClass} overflow-hidden ${shapeClass} ${duotone ? 'duotone-copper' : ''} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
