'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getOwnerCars, getOwnerBookings, getOwnerEarnings } from '@/lib/owner';
import { updateBookingStatus } from '@/lib/bookings';
import type { Booking, Car } from '@/types';
import { formatETB } from '@/lib/utils';
import { Car as CarIcon, CalendarDays, DollarSign, Plus, Check, X, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EarningsChart from '@/components/charts/EarningsChart';

type OwnerBooking = Booking & { car?: Car; renter?: { name: string; email: string } };

export default function OwnerDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [earnings, setEarnings] = useState<{ total: number; count: number; chartData: { month: string; earnings: number }[] }>({ total: 0, count: 0, chartData: [] });
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    setCars(getOwnerCars());
    setBookings(getOwnerBookings() as OwnerBooking[]);
    setEarnings(getOwnerEarnings());
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRequest = (id: string, status: 'confirmed' | 'declined') => {
    const result = updateBookingStatus(id, status, true);
    setMessage(result.success ? `Booking ${status === 'confirmed' ? 'approved' : 'declined'} successfully.` : result.error);
    load();
  };

  const pending = bookings.filter((booking) => booking.status === 'requested');
  const activeRentals = bookings.filter((booking) => ['confirmed', 'in_progress'].includes(booking.status));
  const cards = [
    { label: 'My Cars', value: String(cars.length), icon: CarIcon, color: 'bg-blue-50 text-blue-900' },
    { label: 'Requests Awaiting Approval', value: String(pending.length), icon: CalendarDays, color: 'bg-amber-50 text-amber-900' },
    { label: 'Approved / Active Rentals', value: String(activeRentals.length), icon: Clock3, color: 'bg-purple-50 text-purple-900' },
    { label: 'Rental Earnings', value: formatETB(earnings.total), icon: DollarSign, color: 'bg-emerald-50 text-emerald-900' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div>
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your vehicles, rental requests, and earnings in one place.</p>
        </div>

        <Link href="/owner/cars/new">
          <Button className="bg-blue-900">
            <Plus className="mr-2 h-4 w-4" />
            List a Car
          </Button>
        </Link>

      </div>


      {message && <div role="status"
        className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">{message}</div>}


      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => <div key={card.label}
          className="rounded-2xl border bg-white p-5">
          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
            <card.icon className="h-5 w-5" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</div>
          <div className="mt-1 text-2xl font-bold">{card.value}</div>
        </div>)}

      </div>


      <section>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">My Listed Cars</h2>
            <p className="text-sm text-slate-500">Your cars are shown here without needing to open the separate listings page.</p>
          </div>
          <Link href="/owner/cars"
            className="text-sm font-semibold text-blue-900 hover:underline">Manage all cars</Link>
        </div>

        {cars.length === 0 ? <div className="rounded-2xl border bg-white p-10 text-center">
          <CarIcon className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <p className="font-semibold">You have not listed a car yet.</p>
          <p className="mt-1 text-sm text-slate-500">Add your first car to start receiving rental requests.</p>
          <Link href="/owner/cars/new"
            className="mt-4 inline-block">
            <Button className="bg-blue-900">List your first car</Button>
          </Link>
        </div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cars.map((car) => <article key={car.id}
            className="overflow-hidden rounded-2xl border bg-white">
            <img src={car.photos?.[0] || '/file.svg'}
              alt={`${car.make} ${car.model}`}
              className="h-44 w-full object-cover" />
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold">{car.make} {car.model}</h3>
                <Badge className={car.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : car.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}>{car.status}</Badge>
              </div>
              <p className="text-sm text-slate-500">{car.neighbourhood}, {car.city}</p>
              <p className="font-semibold">
                {formatETB(car.pricePerDay)}
                <span className="text-sm font-normal text-slate-500">/ day</span>
              </p>
              <Link href={`/owner/cars/${car.id}/edit`}>
                <Button variant="outline"
                  className="w-full">Edit listing</Button>
              </Link>
            </div>
          </article>)}
        </div>}

      </section>


      <section>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Rental Requests</h2>
            <p className="text-sm text-slate-500">Approve or decline new requests for your cars.</p>
          </div>
          <Link href="/owner/bookings"
            className="text-sm font-semibold text-blue-900 hover:underline">All bookings</Link>
        </div>

        {pending.length === 0 ? <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">There are no rental requests waiting for approval.</div> : <div className="space-y-3">
          {pending.map((booking) => <div key={booking.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-4">
            <div className="flex items-center gap-3">
              <img src={booking.car?.photos?.[0] || '/file.svg'}
                alt=""
                className="h-16 w-20 rounded-lg object-cover" />
              <div>
                <p className="font-semibold">{booking.car?.make} {booking.car?.model}</p>
                <p className="text-sm text-slate-500">Renter: {booking.renter?.name || 'Renter'}</p>
                <p className="text-sm text-slate-500">{booking.startDate} – {booking.endDate} · {booking.days} days</p>
                <p className="mt-1 font-semibold">{formatETB(booking.total)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleRequest(booking.id, 'confirmed')}
                className="bg-emerald-600 hover:bg-emerald-700">
                <Check className="mr-1 h-4 w-4" />
                Approve
              </Button>
              <Button variant="outline"
                onClick={() => handleRequest(booking.id, 'declined')}
                className="text-red-700">
                <X className="mr-1 h-4 w-4" />
                Decline
              </Button>
            </div>
          </div>)}
        </div>}

      </section>


      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-4 text-xl font-bold">Rental Earnings</h2>
        <p className="mb-4 text-sm text-slate-500">Earnings include confirmed, active, and completed rentals. Totals update when a request is approved.</p>
        <EarningsChart data={earnings.chartData} />
      </section>

    </div>
  );
}
