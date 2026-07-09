import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useShop } from '../context/ShopContext';
import { summarizeHours } from '../lib/format';

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/barbers', label: 'Barbers' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/book', label: 'Book Now' },
];

export default function Footer() {
  const { primaryLocation } = useShop();
  const hoursLines = summarizeHours(primaryLocation?.hours);

  return (
    <footer className="bg-ink border-t border-copper/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <Logo className="h-16 mb-5" />
          <p className="text-text-muted text-sm leading-relaxed max-w-xs">
            Sicker than your average. Not just about the haircut — it&rsquo;s the vibe.
          </p>
        </div>

        <div>
          <p className="label-eyebrow mb-4">Navigate</p>
          <ul className="space-y-3">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-text-primary hover:text-copper-soft transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-eyebrow mb-4">Hours</p>
          <ul className="space-y-2">
            {hoursLines.map((line) => (
              <li key={line.label} className="flex justify-between gap-4 text-sm text-text-muted max-w-[220px]">
                <span>{line.label}</span>
                <span className="text-text-primary">{line.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-eyebrow mb-4">Visit</p>
          {primaryLocation && (
            <address className="not-italic text-sm text-text-muted leading-relaxed">
              {primaryLocation.name}
              <br />
              {primaryLocation.address}
            </address>
          )}
          {primaryLocation?.instagram && (
            <a
              href={primaryLocation.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors"
            >
              Instagram →
            </a>
          )}
        </div>
      </div>

      <div className="hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} The Lad Pad Barbershop.</p>
          <p className="text-xs text-text-muted">
            <Link to="/login" className="hover:text-copper-soft transition-colors">Staff Login</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
