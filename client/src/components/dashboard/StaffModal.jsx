import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StaffModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff', specialty: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || '',
        email: initial?.email || '',
        password: '',
        role: initial?.role || 'staff',
        specialty: initial?.specialty || '',
      });
      setError('');
    }
  }, [open, initial]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || (!initial && !form.password)) {
      setError(`Name, email${initial ? '' : ' and password'} are required.`);
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await onSubmit(payload);
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
          className="card-surface w-full max-w-md p-8 max-h-[90vh] overflow-y-auto"
        >
          <h3 className="font-display text-2xl text-text-primary mb-6">
            {initial ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-eyebrow block mb-2">Name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label-eyebrow block mb-2">Email</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="label-eyebrow block mb-2">
                Password {initial && <span className="normal-case text-text-muted">(leave blank to keep current)</span>}
              </label>
              <input type="password" className="input-field" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-eyebrow block mb-2">Role</label>
                <select className="input-field" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                  <option value="staff">Staff</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              <div>
                <label className="label-eyebrow block mb-2">Specialty</label>
                <input className="input-field" value={form.specialty} onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))} />
              </div>
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
