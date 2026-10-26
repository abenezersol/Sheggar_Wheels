'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Booking, Car } from '@/types';
import { readStorage, STORAGE_KEYS } from '@/lib/storage';
import { updateBookingStatus } from '@/lib/bookings';
import { formatETB } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Download } from 'lucide-react';

const colors: Record<string, string> = { requested: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800', in_progress: 'bg-purple-100 text-purple-800', completed: 'bg-emerald-100 text-emerald-800', reviewed: 'bg-slate-100 text-slate-800', cancelled: 'bg-red-100 text-red-800', declined: 'bg-red-100 text-red-800', disputed: 'bg-orange-100 text-orange-800', resolved: 'bg-slate-100 text-slate-800' };
export default function BookingDetail() {
  const params = useParams<{ id: string }>(); const id = params.id; const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null); const [car, setCar] = useState<Car | null>(null); const [error, setError] = useState('');
  const load = () => { const b = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []).find((item) => item.id === id); if (!b) { setBooking(null); setCar(null); return; } setBooking(b); setCar(readStorage<Car[]>(STORAGE_KEYS.CARS, []).find((item) => item.id === b.carId) ?? null); };
  useEffect(() => { load(); }, [id]);
  const cancel = () => { if (!booking) return; const result = updateBookingStatus(booking.id, 'cancelled'); if (result.success) load(); else setError(result.error); };
  if (!booking || !car) return <div className="p-20 text-center">
    <h1 className="text-xl font-bold mb-4">Booking not found</h1>
    <Button onClick={() => router.push('/bookings')}>Back to bookings</Button>
  </div>;
  return <div className="max-w-4xl">
    <Link href="/bookings"
      className="text-sm text-blue-900 hover:underline mb-4 inline-flex items-center gap-1">
      <ArrowLeft className="w-4 h-4" />
      Back to bookings
    </Link>
    <div className="bg-white border rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white p-8 flex justify-between gap-4">
        <div>
          <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Booking Receipt</div>
          <h1 className="text-2xl font-bold">{car.make} {car.model}</h1>
          <p className="opacity-90 mt-1">#{booking.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <Badge className={(colors[booking.status] || '') + ' border-0'}>{booking.status.replace('_', ' ')}</Badge>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {[['Pickup', booking.startDate], ['Return', booking.endDate], ['Duration', booking.days + ' days'], ['Payment', booking.paymentStatus]].map(([label, value]) => <div key={label}>
            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">{label}</div>
            <div className="font-semibold flex items-center gap-1">
              {label === 'Payment' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {value}
            </div>
          </div>)}
        </div>
        <div className="border-t pt-6">
          <h3 className="font-bold mb-3">Price Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">{booking.days} days × {formatETB(booking.pricePerDay)}</span>
              <span>{formatETB(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service fee</span>
              <span>{formatETB(booking.fee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total</span>
              <span>{formatETB(booking.total)}</span>
            </div>
          </div>
        </div>
        {error && <p role="alert"
          className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</p>}
        <div className="flex gap-2 flex-wrap pt-4">
          <Button variant="outline"
            onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Print / Save Receipt
          </Button>
          {['requested', 'confirmed'].includes(booking.status) && <Button variant="outline"
            onClick={cancel}
            className="text-red-600 hover:bg-red-50">Cancel Booking</Button>}
          {booking.status === 'completed' && <Link href={'/bookings/' + booking.id + '/review'}>
            <Button className="bg-amber-500 text-slate-900">Leave Review</Button>
          </Link>}
        </div>
      </div>
    </div>
  </div>;
}
