'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatETB } from '@/lib/utils';
export default function EarningsChart({ data }: { data: { month: string; earnings: number }[] }) {
  if (!data.length) return <div className="flex h-64 items-center justify-center text-sm text-slate-400">No earnings yet</div>;
  return <ResponsiveContainer width="100%"
    height={280}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3"
        stroke="#f1f5f9" />
      <XAxis dataKey="month"
        tick={{ fontSize: 12 }}
        stroke="#94a3b8" />
      <YAxis tick={{ fontSize: 12 }}
        stroke="#94a3b8"
        tickFormatter={v => `${Math.round(v / 1000)}k`} />
      <Tooltip formatter={(value) => formatETB(Number(value))} />
      <Line type="monotone"
        dataKey="earnings"
        stroke="#1e3a8a"
        strokeWidth={3}
        dot={{ r: 4, fill: '#1e3a8a' }} />
    </LineChart>
  </ResponsiveContainer>;
}
