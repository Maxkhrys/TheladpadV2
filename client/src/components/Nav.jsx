import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/barbers', label: 'Barbers' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const navLinkClass = ({ isActive }) =>
    `font-sans text-xs uppercase tracking-widest2 transition-colors duration-200 ${
      isActive ? 'text-copper' : 'text-text-primary hover:text-copper-soft'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-copper/30">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
        <Logo className="h-11 sm:h-14" />

        <div className="hidden lg:flex items-center gap-10">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <Link to="/login" className="text-[11px] uppercase tracking-widest2 text-text-muted hover:text-copper-soft transition-colors">
            Staff Login
          </Link>
          <Link to="/book" className="btn-copper min-tap">
            Book Now
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-3">
          <Link to="/book" className="btn-copper !px-4 !py-3 min-tap text-[11px]">
            Book Now
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="min-tap flex flex-col items-center justify-center gap-1.5 text-text-primary"
          >
            <span className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-[1.5px] w-6 bg-current transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-border-subtle bg-ink"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `font-display text-2xl ${isActive ? 'text-copper' : 'text-text-primary'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="hairline pt-5 mt-1">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-xs uppercase tracking-widest2 text-text-muted"
                >
                  Staff Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
