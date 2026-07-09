import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({ name: '', price: '', duration: '', description: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || '',
        price: initial?.price ?? '',
        duration: initial?.duration ?? '',
        description: initial?.description || '',
      });
      setError('');
    }
  }, [open, initial]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || form.price === '' || form.duration === '') {
      setError('Name, price and duration are required.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="card-surface w-full max-w-md p-8"
        >
          <h3 className="font-display text-2xl text-text-primary mb-6">
            {initial ? 'Edit Service' : 'Add New Service'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-eyebrow block mb-2">Name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-eyebrow block mb-2">Price (€)</label>
                <input type="number" min="0" step="0.5" className="input-field" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
              </div>
              <div>
                <label className="label-eyebrow block mb-2">Duration (min)</label>
                <input type="number" min="5" step="5" className="input-field" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label-eyebrow block mb-2">Description</label>
              <textarea rows={3} className="input-field resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            {error && <p className="text-copper-soft text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost min-tap flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-copper min-tap flex-1 disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
