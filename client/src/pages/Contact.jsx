import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import { useShop } from '../context/ShopContext';
import { summarizeHours } from '../lib/format';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { primaryLocation } = useShop();
  const hoursLines = summarizeHours(primaryLocation?.hours);

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Please tell us your name.';
    if (!form.email.trim() || !EMAIL_RE.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.message.trim()) next.message = "Don't forget your message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  }

  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <Reveal>
          <SectionLabel>Get In Touch</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl text-text-primary max-w-2xl mb-16">
            Questions? We&rsquo;re listening.
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="card-surface p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="w-16 h-16 rounded-full bg-copper/15 border border-copper flex items-center justify-center mx-auto mb-6"
                  >
                    <svg className="w-8 h-8 text-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </motion.div>
                  <h3 className="font-display text-2xl text-text-primary mb-2">Message sent.</h3>
                  <p className="text-text-muted text-sm">
                    Thanks {form.name.split(' ')[0]} — we&rsquo;ll get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="name" className="label-eyebrow block mb-2">Name</label>
                    <input
                      id="name"
                      className="input-field"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-copper-soft text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="label-eyebrow block mb-2">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="input-field"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-copper-soft text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="message" className="label-eyebrow block mb-2">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      className="input-field resize-none"
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="How can we help?"
                    />
                    {errors.message && <p className="text-copper-soft text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit" className="btn-copper min-tap w-full sm:w-auto">
                    Send
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card-surface p-10 h-full">
              <p className="label-eyebrow mb-4">{primaryLocation?.name || 'The Lad Pad Barbershop'}</p>
              <p className="font-display text-2xl text-text-primary mb-8">
                {primaryLocation?.address || '5 Castle Hill, Centre, Carlow, R93 XD72'}
              </p>

              <p className="label-eyebrow mb-3">Hours</p>
              <ul className="space-y-2 mb-8">
                {hoursLines.map((line) => (
                  <li key={line.label} className="flex justify-between max-w-xs text-sm">
                    <span className="text-text-muted">{line.label}</span>
                    <span className="text-text-primary font-medium">{line.value}</span>
                  </li>
                ))}
              </ul>

              <div className="hairline pt-8">
                <div className="aspect-video bg-gradient-to-br from-raised via-surface to-ink grain-overlay rounded-sm flex items-center justify-center mb-6">
                  <p className="text-text-muted text-xs uppercase tracking-widest2">Map embed placeholder</p>
                </div>
                {primaryLocation?.instagram && (
                  <a
                    href={primaryLocation.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors"
                  >
                    Follow on Instagram →
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
