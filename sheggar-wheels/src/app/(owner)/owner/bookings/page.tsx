'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOwnerBookings } from '@/lib/owner';
import { formatETB } from '@/lib/utils';
import { exportToCSV } from '@/lib/csv';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
const colors: Record<string, string> = { requested: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800', in_progress: 'bg-purple-100 text-purple-800', completed: 'bg-emerald-100 text-emerald-800', reviewed: 'bg-slate-100 text-slate-800', cancelled: 'bg-red-100 text-red-800', declined: 'bg-red-100 text-red-800' };
export default function OwnerBookings() {  
const [bookings, setBookings] = useState<ReturnType<typeof getOwnerBookings>>([]); useEffect(() => { setBookings(getOwnerBookings()) }, []); const exportRows = () => exportToCSV(bookings.map(b => ({ id: b.id, car: `${b.car?.make || ''} ${b.car?.model || ''}`, renter: b.renter?.name || '', startDate: b.startDate, endDate: b.endDate, days: b.days, total: b.total, status: b.status })), 'owner-bookings.csv');
  return <div className="mx-auto max-w-6xl">
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Bookings</h1>
      <Button variant="outline"
        onClick={exportRows}>
        <Download className="mr-1 h-4 w-4" />
        Export CSV
      </Button>
    </div>
    <div className="divide-y rounded-2xl border bg-white">
      {bookings.length === 0 ? <div className="p-12 text-center text-slate-500">No bookings yet.</div> : bookings.map(b => <Link key={b.id}
        href={`/owner/bookings/${b.id}`}
        className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50">
        <div className="flex items-center gap-4">
          <img src={b.car?.photos?.[0] || '/file.svg'}
            className="h-14 w-14 rounded-lg object-cover"
            alt="" />
          <div>
            <div className="font-semibold">{b.car?.make} {b.car?.model}</div>
            <div className="text-xs text-slate-500">By {b.renter?.name || 'Renter'} • {b.startDate}</div>
          </div>
        </div>
        <div className="text-right">
          <Badge className={colors[b.status] || 'bg-slate-100'}>{b.status}</Badge>
          <div className="mt-1 text-sm font-bold">{formatETB(b.total)}</div>
        </div>
      </Link>)}
    </div>
  </div>
}
