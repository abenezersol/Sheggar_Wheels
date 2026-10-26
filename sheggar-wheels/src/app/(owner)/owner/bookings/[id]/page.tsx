'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOwnerBookings } from '@/lib/owner';
import { formatETB } from '@/lib/utils';
export default function OwnerBookingDetail() {  
const params = useParams<{ id: string }>(); const [booking, setBooking] = useState<ReturnType<typeof getOwnerBookings>[number] | null>(null); useEffect(() => { setBooking(getOwnerBookings().find(b => b.id === params.id) || null) }, [params.id]); if (!booking) return <div className="rounded-xl border bg-white p-8">Booking not found.</div>; return <div className="max-w-3xl">
    <Link href="/owner/bookings"
      className="text-sm text-blue-900 hover:underline">← Back to bookings</Link>
    <h1 className="my-5 text-2xl font-bold">Booking details</h1>
    <div className="space-y-3 rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-semibold">{booking.car?.make} {booking.car?.model}</h2>
      <p>Renter: {booking.renter?.name || 'Unknown renter'}</p>
      <p>Email: {booking.renter?.email || '—'}</p>
      <p>Dates: {booking.startDate} – {booking.endDate}</p>
      <p>Duration: {booking.days} days</p>
      <p>Status: {booking.status}</p>
      <p>Payment: {booking.paymentStatus}</p>
      <p className="text-xl font-bold">Total: {formatETB(booking.total)}</p>
    </div>
  </div>
}
