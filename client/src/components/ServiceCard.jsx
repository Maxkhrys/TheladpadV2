import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../lib/format';

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface p-8 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-xs font-sans tracking-widest2 text-copper">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-display text-2xl text-copper-soft">{formatPrice(service.price)}</span>
      </div>
      <h3 className="font-display text-2xl text-text-primary mb-2">{service.name}</h3>
      <p className="text-sm text-text-muted leading-relaxed flex-1">{service.description}</p>
      <div className="mt-6 flex items-center justify-between hairline pt-4">
        <span className="text-xs uppercase tracking-widest2 text-text-muted">{service.duration} min</span>
        <Link
          to={`/book?serviceId=${service.id}`}
          className="text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors"
        >
          Book This →
        </Link>
      </div>
    </motion.div>
  );
}
