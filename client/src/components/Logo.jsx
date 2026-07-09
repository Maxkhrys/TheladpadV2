import { Link } from 'react-router-dom';

export default function Logo({ className = 'h-12', linkClassName = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center ${linkClassName}`} aria-label="The Lad Pad Barbershop — home">
      <img
        src="/images/lad-pad-logo.png"
        alt="The Lad Pad Barbershop"
        className={`w-auto object-contain ${className}`}
      />
    </Link>
  );
}
