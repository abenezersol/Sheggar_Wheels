'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllBookings, reviewBookingRequest } from '@/lib/admin';
import type { Booking, Car, User } from '@/types';
import { formatETB } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, CalendarDays } from 'lucide-react';

type AdminBooking = Booking & { car?: Car; renter?: User; owner?: User };

const statusClass: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800', completed: 'bg-emerald-100 text-emerald-800',
  reviewed: 'bg-slate-100 text-slate-800', declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800', disputed: 'bg-orange-100 text-orange-800', resolved: 'bg-emerald-100 text-emerald-800',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [message, setMessage] = useState('');
  const load = useCallback(() => setBookings(getAllBookings() as AdminBooking[]), []);
  useEffect(() => { load(); }, [load]);

  const decide = (id: string, status: 'confirmed' | 'declined') => {
    const result = reviewBookingRequest(id, status);
    setMessage(result.success ? `Booking ${status === 'confirmed' ? 'approved' : 'declined'}. Dashboard and earnings have been updated.` : result.error);
    load();
  };

  const requests = bookings.filter((booking) => booking.status === 'requested');

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Rental Requests</h1>
        <p className="mt-1 text-sm text-slate-500">Admins can review and approve or decline booking requests across the platform.</p>
      </div>

      {message && <div role="status"
        className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">{message}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">Awaiting approval</p>
          <p className="mt-1 text-2xl font-bold">{requests.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">Approved / active</p>
          <p className="mt-1 text-2xl font-bold">{bookings.filter(b => ['confirmed', 'in_progress'].includes(b.status)).length}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">All bookings</p>
          <p className="mt-1 text-2xl font-bold">{bookings.length}</p>
        </div>
      </div>

      <section className="space-y-3">

        <h2 className="text-lg font-bold">Waiting for approval</h2>

        {requests.length === 0 ? <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">
          <CalendarDays className="mx-auto mb-2 h-8 w-8" />
          No booking requests need approval right now.
        </div> : requests.map((booking) => <article key={booking.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <img src={booking.car?.photos?.[0] || '/file.svg'}
              alt=""
              className="h-16 w-20 rounded-lg object-cover" />
            <div>
              <h3 className="font-semibold">{booking.car?.make} {booking.car?.model}</h3>
              <p className="text-sm text-slate-500">Renter: {booking.renter?.name || 'Unknown'} · Owner: {booking.owner?.name || 'Unknown'}</p>
              <p className="text-sm text-slate-500">{booking.startDate} – {booking.endDate} · {booking.days} days</p>
              <p className="mt-1 font-semibold">{formatETB(booking.total)} total · {formatETB(booking.fee)} platform fee</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => decide(booking.id, 'confirmed')}
              className="bg-emerald-600 hover:bg-emerald-700">
              <Check className="mr-1 h-4 w-4" />
              Approve
            </Button>
            <Button variant="outline"
              onClick={() => decide(booking.id, 'declined')}
              className="text-red-700">
              <X className="mr-1 h-4 w-4" />
              Decline
            </Button>
          </div>
        </article>)}

      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Booking history</h2>
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Car</th>
                <th className="p-3">Renter</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((booking) => <tr key={booking.id}>
                <td className="p-3 font-medium">{booking.car?.make} {booking.car?.model}</td>
                <td className="p-3">{booking.renter?.name || '—'}</td>
                <td className="p-3">{booking.owner?.name || '—'}</td>
                <td className="p-3">{booking.startDate} – {booking.endDate}</td>
                <td className="p-3">{formatETB(booking.total)}</td>
                <td className="p-3">
                  <Badge className={statusClass[booking.status] || 'bg-slate-100'}>{booking.status.replace('_', ' ')}</Badge>
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
