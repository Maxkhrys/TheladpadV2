import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function StatCard({ label, value = 0, prefix = '', suffix = '', decimals = 0, loading = false }) {
  const [display, setDisplay] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (loading) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, reduceMotion, loading]);

  if (loading) {
    return <div className="card-surface p-6 h-[104px] animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface p-6"
    >
      <p className="label-eyebrow mb-3">{label}</p>
      <p className="font-display text-4xl text-text-primary">
        {prefix}
        {display.toFixed(decimals)}
        {suffix}
      </p>
    </motion.div>
  );
}
