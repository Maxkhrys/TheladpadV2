import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ProgressBar from '../components/BookingFlow/ProgressBar';
import StepBarber from '../components/BookingFlow/StepBarber';
import StepService from '../components/BookingFlow/StepService';
import StepDateTime from '../components/BookingFlow/StepDateTime';
import StepConfirm from '../components/BookingFlow/StepConfirm';
import { useReducedMotion } from '../hooks/useReducedMotion';

const STEPS = ['Barber', 'Service', 'Date & Time', 'Details & Payment'];

export default function Book() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const [data, setData] = useState({
    barberId: searchParams.get('barberId') || 'any',
    serviceId: searchParams.get('serviceId') || '',
    date: '',
    time: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  });

  function update(patch) {
    setData((d) => ({ ...d, ...patch }));
  }

  function goNext() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  const variants = {
    enter: (dir) => (reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => (reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <PageTransition>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <p className="label-eyebrow justify-center mb-3 text-center">Book Your Slot</p>
        <h1 className="font-display text-4xl sm:text-5xl text-text-primary text-center mb-10">
          Sicker than your average, booked in minutes.
        </h1>

        <ProgressBar steps={STEPS} currentStep={step} />

        <div className="mt-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && <StepBarber value={data.barberId} onChange={(barberId) => update({ barberId })} onNext={goNext} />}
              {step === 1 && (
                <StepService value={data.serviceId} onChange={(serviceId) => update({ serviceId, time: '' })} onNext={goNext} onBack={goBack} />
              )}
              {step === 2 && <StepDateTime data={data} onChange={update} onNext={goNext} onBack={goBack} />}
              {step === 3 && <StepConfirm data={data} onChange={update} onBack={goBack} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
}
