import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function StaggerHeadline({ words, className = '', wordClassName = '', as = 'h1' }) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.h1;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.1 } },
  };
  const item = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <MotionTag
      initial="hidden"
      animate="visible"
      variants={container}
      className={`flex flex-wrap gap-x-3 ${className}`}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={item} className={`${wordClassName} ${w.copper ? 'text-copper' : 'text-text-primary'}`}>
          {w.text}
        </motion.span>
      ))}
    </MotionTag>
  );
}
