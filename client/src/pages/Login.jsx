import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'owner' ? '/dashboard/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      const from = location.state?.from?.pathname;
      navigate(from || (loggedInUser.role === 'owner' ? '/dashboard/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
      setShake((s) => s + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <motion.div
          key={shake}
          animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md card-surface p-10"
        >
          <p className="label-eyebrow justify-center mb-3">The Lad Pad Barbershop</p>
          <h1 className="font-display text-3xl text-text-primary text-center mb-8">Staff Login</h1>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="label-eyebrow block mb-2">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@theladpad.ie"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-eyebrow block mb-2">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-copper-soft text-sm text-center" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-copper min-tap w-full disabled:opacity-60">
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>
        </motion.div>
      </section>
    </PageTransition>
  );
}
