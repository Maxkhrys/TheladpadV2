import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import StatCard from '../components/dashboard/StatCard';
import EarningsChart from '../components/dashboard/EarningsChart';
import BookingsTable from '../components/dashboard/BookingsTable';
import StaffModal from '../components/dashboard/StaffModal';
import ServiceModal from '../components/dashboard/ServiceModal';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';

const SORT_OPTIONS = [
  { field: 'date', label: 'Date' },
  { field: 'customer', label: 'Customer' },
  { field: 'amount', label: 'Amount' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [overview, setOverview] = useState(null);
  const [staffEarnings, setStaffEarnings] = useState([]);
  const [earningsRange, setEarningsRange] = useState('week');

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [filters, setFilters] = useState({ staffId: '', from: '', to: '', paymentStatus: '', status: '' });
  const [sort, setSort] = useState({ field: 'date', order: 'desc' });

  const [staffList, setStaffList] = useState([]);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [services, setServices] = useState([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadOverview = useCallback(async () => {
    const [ov, se] = await Promise.all([api.get('/earnings/overview'), api.get('/earnings/staff')]);
    setOverview(ov);
    setStaffEarnings(se.breakdown);
  }, []);

  const loadStaff = useCallback(async () => {
    const res = await api.get('/staff');
    setStaffList(res.staff);
  }, []);

  const loadServices = useCallback(async () => {
    const res = await api.get('/services');
    setServices(res.services);
  }, []);

  const loadBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.staffId) params.set('staffId', filters.staffId);
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);
      if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus);
      if (filters.status) params.set('status', filters.status);
      params.set('sort', sort.field);
      params.set('order', sort.order);
      const res = await api.get(`/bookings?${params}`);
      setBookings(res.bookings);
    } finally {
      setBookingsLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([loadOverview(), loadStaff(), loadServices()]);
      setLoading(false);
    }
    init();
  }, [loadOverview, loadStaff, loadServices]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const chartData = useMemo(
    () =>
      staffEarnings.map((s) => ({
        name: s.name.split(' ')[0],
        revenue: earningsRange === 'week' ? s.weekRevenue : s.monthRevenue,
      })),
    [staffEarnings, earningsRange]
  );

  async function handleAddOrEditStaff(payload) {
    if (editingStaff) {
      await api.patch(`/staff/${editingStaff.id}`, payload);
    } else {
      await api.post('/staff', payload);
    }
    setStaffModalOpen(false);
    setEditingStaff(null);
    await loadStaff();
    await loadOverview();
  }

  async function toggleStaffActive(member) {
    await api.patch(`/staff/${member.id}`, { active: !member.active });
    await loadStaff();
    await loadOverview();
  }

  async function handleAddOrEditService(payload) {
    if (editingService) {
      await api.patch(`/services/${editingService.id}`, payload);
    } else {
      await api.post('/services', payload);
    }
    setServiceModalOpen(false);
    setEditingService(null);
    await loadServices();
  }

  async function handleRemoveService(service) {
    if (!window.confirm(`Remove ${service.name}? This can't be undone.`)) return;
    await api.delete(`/services/${service.id}`);
    await loadServices();
  }

  function toggleSort(field) {
    setSort((s) => (s.field === field ? { field, order: s.order === 'asc' ? 'desc' : 'asc' } : { field, order: 'asc' }));
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-ink">
        <header className="border-b border-copper/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo className="h-10" />
              <div className="hidden sm:block h-8 border-l border-copper/30" />
              <div>
                <p className="label-eyebrow">Admin Dashboard</p>
                <p className="font-display text-xl text-text-primary">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors">
                My Dashboard →
              </Link>
              <button onClick={logout} className="btn-ghost min-tap !px-5 !py-2.5 text-[11px]">
                Log Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
          <section>
            <p className="label-eyebrow mb-4">Overview</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard label="Revenue This Month" value={overview?.totalRevenueThisMonth ?? 0} prefix="€" decimals={2} loading={loading || !overview} />
              <StatCard label="Total Bookings" value={overview?.totalBookings ?? 0} loading={loading || !overview} />
              <StatCard label="Active Staff" value={overview?.activeStaffCount ?? 0} loading={loading || !overview} />
            </div>
          </section>

          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="label-eyebrow">Staff Earnings Breakdown</p>
              <div className="inline-flex border border-border-subtle rounded-sm overflow-hidden">
                {['week', 'month'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setEarningsRange(r)}
                    className={`px-4 py-2 text-[11px] uppercase tracking-widest2 min-tap capitalize transition-colors ${
                      earningsRange === r ? 'bg-copper text-ink' : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    This {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-surface p-6 mb-6">
              <EarningsChart data={chartData} />
            </div>
            <div className="hidden md:block overflow-x-auto card-surface p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted uppercase tracking-widest2 text-[10px] border-b border-border-subtle">
                    <th className="py-3 pr-4 font-medium">Staff</th>
                    <th className="py-3 pr-4 font-medium">Specialty</th>
                    <th className="py-3 pr-4 font-medium">Bookings</th>
                    <th className="py-3 pr-4 font-medium">This Week</th>
                    <th className="py-3 pr-4 font-medium">This Month</th>
                    <th className="py-3 pr-4 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {staffEarnings.map((s) => (
                    <tr key={s.staffId} className="border-b border-border-subtle/60">
                      <td className="py-3 pr-4 text-text-primary whitespace-nowrap">{s.name}</td>
                      <td className="py-3 pr-4 text-text-muted whitespace-nowrap">{s.specialty}</td>
                      <td className="py-3 pr-4 text-text-muted">{s.bookingsCompleted}</td>
                      <td className="py-3 pr-4 text-copper-soft whitespace-nowrap">€{s.weekRevenue.toFixed(2)}</td>
                      <td className="py-3 pr-4 text-copper-soft whitespace-nowrap">€{s.monthRevenue.toFixed(2)}</td>
                      <td className="py-3 pr-4 text-text-primary whitespace-nowrap">€{s.totalRevenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {staffEarnings.map((s) => (
                <div key={s.staffId} className="card-surface p-4">
                  <p className="text-text-primary font-medium">{s.name}</p>
                  <p className="text-text-muted text-xs mb-2">{s.specialty}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">{s.bookingsCompleted} bookings</span>
                    <span className="text-copper-soft">€{(earningsRange === 'week' ? s.weekRevenue : s.monthRevenue).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="label-eyebrow mb-6">All Bookings</p>
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                className="input-field !w-auto min-tap"
                value={filters.staffId}
                onChange={(e) => setFilters((f) => ({ ...f, staffId: e.target.value }))}
              >
                <option value="">All Staff</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="input-field !w-auto min-tap"
                value={filters.from}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
                aria-label="From date"
              />
              <input
                type="date"
                className="input-field !w-auto min-tap"
                value={filters.to}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
                aria-label="To date"
              />
              <select
                className="input-field !w-auto min-tap"
                value={filters.paymentStatus}
                onChange={(e) => setFilters((f) => ({ ...f, paymentStatus: e.target.value }))}
              >
                <option value="">Any Payment</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <select
                className="input-field !w-auto min-tap"
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="">Any Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="inline-flex border border-border-subtle rounded-sm overflow-hidden">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.field}
                    onClick={() => toggleSort(opt.field)}
                    className={`px-3 py-2 text-[11px] uppercase tracking-widest2 min-tap transition-colors ${
                      sort.field === opt.field ? 'bg-copper text-ink' : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {opt.label} {sort.field === opt.field ? (sort.order === 'asc' ? '↑' : '↓') : ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-surface p-6">
              {bookingsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 bg-raised/60 rounded-sm animate-pulse" />
                  ))}
                </div>
              ) : (
                <BookingsTable bookings={bookings} showBarber />
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="label-eyebrow">Staff Management</p>
              <button
                onClick={() => {
                  setEditingStaff(null);
                  setStaffModalOpen(true);
                }}
                className="btn-copper min-tap !px-5 !py-3 text-[11px]"
              >
                Add New Staff Member
              </button>
            </div>
            <div className="card-surface divide-y divide-border-subtle">
              {staffList.map((member) => (
                <div key={member.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-text-primary font-medium">{member.name}</p>
                      <span className="text-[10px] uppercase tracking-widest2 text-copper border border-copper/40 rounded-full px-2 py-0.5">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-text-muted text-xs mt-1">
                      {member.email} · {member.specialty}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleStaffActive(member)}
                      className={`text-[11px] uppercase tracking-widest2 px-3 py-2 rounded-sm border min-tap transition-colors ${
                        member.active ? 'border-emerald-500/40 text-emerald-300' : 'border-border-subtle text-text-muted'
                      }`}
                    >
                      {member.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingStaff(member);
                        setStaffModalOpen(true);
                      }}
                      className="text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors min-tap"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="label-eyebrow">Services Management</p>
              <button
                onClick={() => {
                  setEditingService(null);
                  setServiceModalOpen(true);
                }}
                className="btn-copper min-tap !px-5 !py-3 text-[11px]"
              >
                Add Service
              </button>
            </div>
            <div className="card-surface divide-y divide-border-subtle">
              {services.map((service) => (
                <div key={service.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-text-primary font-medium">{service.name}</p>
                    <p className="text-text-muted text-xs mt-1">
                      €{service.price} · {service.duration} min
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setServiceModalOpen(true);
                      }}
                      className="text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors min-tap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveService(service)}
                      className="text-xs uppercase tracking-widest2 text-red-400 hover:text-red-300 transition-colors min-tap"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <StaffModal
        open={staffModalOpen}
        onClose={() => {
          setStaffModalOpen(false);
          setEditingStaff(null);
        }}
        onSubmit={handleAddOrEditStaff}
        initial={editingStaff}
      />
      <ServiceModal
        open={serviceModalOpen}
        onClose={() => {
          setServiceModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleAddOrEditService}
        initial={editingService}
      />
    </PageTransition>
  );
}
