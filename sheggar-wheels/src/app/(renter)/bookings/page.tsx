'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyBookings } from '@/lib/bookings';
import { formatETB } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const colors: Record<string, string> = { requested: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800', in_progress: 'bg-purple-100 text-purple-800', completed: 'bg-emerald-100 text-emerald-800', reviewed: 'bg-slate-100 text-slate-800', cancelled: 'bg-red-100 text-red-800', declined: 'bg-red-100 text-red-800', disputed: 'bg-orange-100 text-orange-800', resolved: 'bg-slate-100 text-slate-800' };
export default function BookingsList() {
  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(() => { setBookings(getMyBookings()); }, []);
  return <div className="max-w-6xl">
    <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
    {bookings.length === 0 ? <div className="bg-white border rounded-2xl p-12 text-center text-slate-500">No bookings yet.</div> : <div className="bg-white border rounded-2xl divide-y">
      {bookings.map((b) => <Link key={b.id}
        href={'/bookings/' + b.id}
        className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50">
        <div className="flex items-center gap-4">
          <img src={b.car?.photos?.[0] || '/images/car-placeholder.png'}
            className="w-16 h-16 rounded-lg object-cover"
            alt="" />
          <div>
            <div className="font-semibold">{b.car?.make} {b.car?.model}</div>
            <div className="text-sm text-slate-500">{b.startDate} → {b.endDate} • {b.days} days</div>
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
