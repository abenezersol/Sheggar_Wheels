'use client';
import { useEffect, useState } from 'react';
import { getPlatformStats } from '@/lib/admin';
import { formatETB } from '@/lib/utils';
import { Users, Car, TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
export default function AdminOverview() {  
const [stats, setStats] = useState<ReturnType<typeof getPlatformStats> | null>(null); useEffect(() => { setStats(getPlatformStats()) }, []); if (!stats) return <div className="p-20 text-center">Loading...</div>; const totalBookings = Object.values(stats.bookingsByStatus).reduce((a, b) => a + b, 0); const cards = [{ label: 'Active Users', value: String(stats.activeUsers), sub: `of ${stats.totalUsers}`, icon: Users }, { label: 'Approved Cars', value: String(stats.approvedCars), sub: `${stats.pendingCars} pending`, icon: Car }, { label: 'Total Bookings', value: String(totalBookings), sub: 'all time', icon: TrendingUp }, { label: 'Commission', value: formatETB(stats.totalCommission), sub: 'platform fee', icon: DollarSign }]; return <div className="mx-auto max-w-6xl">
    <h1 className="mb-6 text-2xl font-bold">Platform Overview</h1>
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(s => <div key={s.label}
        className="rounded-2xl border bg-white p-6">
        <s.icon className="mb-3 h-5 w-5 text-blue-900" />
        <div className="text-xs font-semibold uppercase text-slate-500">{s.label}</div>
        <div className="mt-1 text-2xl font-bold">{s.value}</div>
        <div className="mt-1 text-xs text-slate-400">{s.sub}</div>
      </div>)}
    </div>
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 font-bold">Booking Volume (ETB)</h2>
      <ResponsiveContainer width="100%"
        height={280}>
        <LineChart data={stats.chartData}>
          <CartesianGrid strokeDasharray="3 3"
            stroke="#f1f5f9" />
          <XAxis dataKey="month"
            tick={{ fontSize: 12 }}
            stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }}
            stroke="#94a3b8"
            tickFormatter={v => `${Math.round(v / 1000)}k`} />
          <Tooltip formatter={value => formatETB(Number(value))} />
          <Line type="monotone"
            dataKey="volume"
            stroke="#1e3a8a"
            strokeWidth={3}
            dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
}
