'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyBookings } from '@/lib/bookings';
import { formatETB } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Car as CarIcon } from 'lucide-react';

const colors: Record<string, string> = { requested: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800', in_progress: 'bg-purple-100 text-purple-800', completed: 'bg-emerald-100 text-emerald-800', reviewed: 'bg-slate-100 text-slate-800', cancelled: 'bg-red-100 text-red-800', declined: 'bg-red-100 text-red-800', disputed: 'bg-orange-100 text-orange-800', resolved: 'bg-slate-100 text-slate-800' };
export default function RenterDashboard() {
  const [bookings, setBookings] = useState<
    ReturnType<typeof getMyBookings>
    >([]);
  useEffect(() => { setBookings(getMyBookings()); }, []);
  const upcoming = bookings.filter((b) => ['requested', 'confirmed', 'in_progress'].includes(b.status));
  const completed = bookings.filter((b) => ['completed', 'reviewed'].includes(b.status));
  const stats = [{ label: 'Upcoming Trips', value: upcoming.length, icon: Calendar, color: 'bg-blue-50 text-blue-900' }, { label: 'Completed Trips', value: completed.length, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-900' }, { label: 'Total Spent', value: formatETB(bookings.filter((b) => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.total, 0)), icon: CarIcon, color: 'bg-amber-50 text-amber-900' }];
  return <div className="max-w-6xl">
    <h1 className="text-2xl font-bold mb-6">Welcome back 👋</h1>
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      {stats.map((s) => <div key={s.label}
        className="bg-white border rounded-2xl p-6">
        <div className={'w-10 h-10 rounded-xl flex items-center justify-center mb-3 ' + s.color}>
          <s.icon className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-500 uppercase font-semibold">{s.label}</div>
        <div className="text-2xl font-bold mt-1">{s.value}</div>
      </div>)}
    </div>
    <h2 className="font-bold text-lg mb-4">Recent Bookings</h2>
    {bookings.length === 0 ? <div className="bg-white border rounded-2xl p-12 text-center">
      <p className="text-slate-500 mb-4">You haven&apos;t booked any cars yet.</p>
      <Link href="/cars">
        <Button className="bg-blue-900">Browse Cars</Button>
      </Link>
    </div> : <div className="bg-white border rounded-2xl divide-y">
      {bookings.slice(0, 5).map((b) => <Link key={b.id}
        href={'/bookings/' + b.id}
        className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50">
        <div className="flex items-center gap-4">
          <img src={b.car?.photos?.[0] || '/images/car-placeholder.png'}
            className="w-16 h-16 rounded-lg object-cover"
            alt="" />
          <div>
            <div className="font-semibold">{b.car?.make} {b.car?.model}</div>
            <div className="text-sm text-slate-500">{b.startDate} → {b.endDate}</div>
          </div>
        </div>
        <div className="text-right">
          <Badge className={colors[b.status] || ''}>{b.status.replace('_', ' ')}</Badge>
          <div className="font-bold mt-1">{formatETB(b.total)}</div>
        </div>
      </Link>)}
    </div>}
  </div>;
}
