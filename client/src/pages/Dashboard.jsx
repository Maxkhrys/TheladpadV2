import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfToday } from 'date-fns';
import PageTransition from '../components/PageTransition';
import StatCard from '../components/dashboard/StatCard';
import AppointmentCard from '../components/dashboard/AppointmentCard';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ from: '', to: '' });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (range.from) params.set('from', range.from);
        if (range.to) params.set('to', range.to);
        const [bookingsRes, earningsRes] = await Promise.all([
          api.get(`/bookings/mine${params.toString() ? `?${params}` : ''}`),
          api.get('/earnings/mine'),
        ]);
        if (cancelled) return;
        setBookings(bookingsRes.bookings);
        setEarnings(earningsRes);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [range.from, range.to]);

  const todayStr = format(startOfToday(), 'yyyy-MM-dd');
  const upcoming = useMemo(
    () =>
      [...bookings]
        .filter((b) => b.status !== 'cancelled')
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [bookings]
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-ink">
        <header className="border-b border-copper/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo className="h-10" />
              <div className="hidden sm:block h-8 border-l border-copper/30" />
              <div>
                <p className="label-eyebrow">Welcome back</p>
                <p className="font-display text-xl text-text-primary">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user?.role === 'owner' && (
                <Link to="/dashboard/admin" className="text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors">
                  Admin →
                </Link>
              )}
              <button onClick={logout} className="btn-ghost min-tap !px-5 !py-2.5 text-[11px]">
                Log Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          <section>
            <p className="label-eyebrow mb-4">My Earnings</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <StatCard label="This Week" value={earnings?.weekRevenue ?? 0} prefix="€" decimals={2} loading={loading || !earnings} />
              <StatCard label="This Month" value={earnings?.monthRevenue ?? 0} prefix="€" decimals={2} loading={loading || !earnings} />
            </div>
          </section>

          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="label-eyebrow">My Upcoming Appointments</p>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  className="input-field !py-2 !text-xs min-tap"
                  value={range.from}
                  onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
                  aria-label="From date"
                />
                <span className="text-text-muted text-xs">to</span>
                <input
                  type="date"
                  className="input-field !py-2 !text-xs min-tap"
                  value={range.to}
                  onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
                  aria-label="To date"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card-surface h-20 animate-pulse" />
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <p className="text-text-muted text-sm py-10 text-center card-surface">No appointments found for this range.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((b, i) => (
                  <AppointmentCard key={b.id} booking={b} isToday={b.date === todayStr} index={i} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </PageTransition>
  );
}
