'use client';
import { useEffect, useState } from 'react';
import { getOwnerEarnings, getOwnerBookings } from '@/lib/owner';
import { formatETB } from '@/lib/utils';
import { exportToCSV } from '@/lib/csv';
import EarningsChart from '@/components/charts/EarningsChart';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
type Earnings = { total: number; count: number; chartData: { month: string; earnings: number }[] };
export default function OwnerEarnings() {  
const [stats, setStats] = useState<Earnings>({ total: 0, count: 0, chartData: [] }); useEffect(() => { setStats(getOwnerEarnings()) }, []); const exportRows = () => exportToCSV(getOwnerBookings().filter(b => ['completed', 'reviewed'].includes(b.status)).map(b => ({ bookingId: b.id, car: `${b.car?.make || ''} ${b.car?.model || ''}`, startDate: b.startDate, total: b.total, fee: b.fee })), 'earnings.csv'); return <div className="mx-auto max-w-6xl">
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Earnings</h1>
      <Button variant="outline"
        onClick={exportRows}>
        <Download className="mr-1 h-4 w-4" />
        Export CSV
      </Button>
    </div>
    <div className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white">
      <div className="text-xs uppercase opacity-80">Total Earnings</div>
      <div className="mt-1 text-3xl font-bold">{formatETB(stats.total)}</div>
      <div className="mt-1 text-sm opacity-80">From {stats.count} completed trips</div>
    </div>
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 font-bold">Monthly Earnings</h2>
      <EarningsChart data={stats.chartData} />
    </div>
  </div>
}
