import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function EarningsChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-text-muted text-sm py-16 text-center">No earnings data yet.</p>;
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#2E2820" vertical={false} />
          <XAxis dataKey="name" stroke="#9A9082" tick={{ fontSize: 11, fill: '#9A9082' }} axisLine={{ stroke: '#2E2820' }} tickLine={false} />
          <YAxis stroke="#9A9082" tick={{ fontSize: 11, fill: '#9A9082' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1C1916', border: '1px solid #2E2820', borderRadius: 4, color: '#F5EFE6' }}
            labelStyle={{ color: '#9A9082' }}
            cursor={{ fill: 'rgba(193,107,62,0.08)' }}
            formatter={(value) => [`€${Number(value).toFixed(2)}`, 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#C16B3E" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
