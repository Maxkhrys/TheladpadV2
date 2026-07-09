import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Photo from './Photo';
import { getBarberProfile } from '../data/barberProfiles';

export default function BarberCard({ barber, index = 0 }) {
  const profile = getBarberProfile(barber.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group card-surface overflow-hidden"
    >
      <Photo src={profile.photo} alt={barber.name} className="h-72 w-full" />
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest2 text-copper mb-2">{barber.specialty}</p>
        <h3 className="font-display text-2xl text-text-primary mb-2">{barber.name}</h3>
        {profile.bio && <p className="text-sm text-text-muted leading-relaxed mb-5">{profile.bio}</p>}
        <Link
          to={`/book?barberId=${barber.id}`}
          className="text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors"
        >
          Book with {barber.name.split(' ')[0]} →
        </Link>
      </div>
    </motion.div>
  );
}
