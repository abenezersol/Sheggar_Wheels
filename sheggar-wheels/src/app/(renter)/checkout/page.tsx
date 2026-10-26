'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Car } from '@/types';
import { readStorage, STORAGE_KEYS } from '@/lib/storage';
import { calculateTotals, createBooking } from '@/lib/bookings';
import { formatETB } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

function CheckoutContent() {
  const params = useSearchParams(); const router = useRouter(); const carId = params.get('carId');
  const [car, setCar] = useState<Car | null>(null); const [loaded, setLoaded] = useState(false);
  const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(''); const [processing, setProcessing] = useState(false);
  useEffect(() => {
    if (!getCurrentUser()) { router.replace('/signin?next=' + encodeURIComponent('/checkout?carId=' + (carId ?? ''))); return; }
    const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
    setCar(cars.find((item) => item.id === carId && item.status === 'approved') ?? null); setLoaded(true);
  }, [carId, router]);
  const days = startDate && endDate ? Math.round((Date.parse(endDate) - Date.parse(startDate)) / 86400000) : 0;
  const totals = car && days > 0 ? calculateTotals(car, days) : { subtotal: 0, fee: 0, total: 0 };
  const submit = () => {
    setError('');
    if (!car) { setError('Car not found or unavailable.'); return; }
    if (!startDate || !endDate || days < 1) { setError('Please select valid rental dates.'); return; }
    setProcessing(true);
    window.setTimeout(() => {
      const result = createBooking(car.id, startDate, endDate, days);
      if (result.success) { router.push('/bookings/' + result.booking.id); }
      else { setError(result.error); setProcessing(false); }
    }, 500);
  };
  if (!loaded) return <div className="p-20 text-center">Loading booking...</div>;
  if (!car) return <div className="max-w-xl mx-auto p-20 text-center">
    <h1 className="text-2xl font-bold mb-3">Car unavailable</h1>
    <p className="text-slate-500 mb-5">Choose an approved car from our catalogue.</p>
    <Button onClick={() => router.push('/cars')}>Browse cars</Button>
  </div>;
  const today = new Date().toISOString().slice(0, 10);
  return <div className="max-w-5xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
    <p className="text-slate-500 mb-8">Review your trip details and confirm your booking.</p>

    <div className="grid md:grid-cols-[1fr_380px] gap-8">
      <div className="space-y-6">
        <section className="bg-white border rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">1. Select Dates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Start Date</Label>
              <Input id="start"
                type="date"
                required
                min={today}
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); if (endDate && endDate <= e.target.value) setEndDate(''); }} />
            </div>
            <div>
              <Label htmlFor="end">End Date</Label>
              <Input id="end"
                type="date"
                required
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          {days > 0 && <p className="text-sm text-slate-500 mt-3">
            Selected:
            <strong>{days} day{days !== 1 ? 's' : ''}</strong>
          </p>}
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">2. Payment (TeleBirr)</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-4">Payment confirmation is handled through this booking flow.</div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="text-xs text-slate-500 uppercase mb-1">Transaction reference</div>
            <div className="font-mono font-bold">TB-{car.id.toUpperCase()}-{startDate || 'DATE'}</div>
          </div>
        </section>
      </div>

      <aside>
        <div className="bg-white border rounded-2xl p-6">
          <img src={car.photos[0] || '/images/car-placeholder.png'}
            className="w-full h-40 object-cover rounded-xl mb-4"
            alt={car.make + ' ' + car.model} />
          <h3 className="font-bold">{car.make} {car.model}</h3>
          <p className="text-sm text-slate-500 mb-4">{car.neighbourhood}, {car.city}</p>
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span className="text-slate-500">{days > 0 ? days : 0} days × {formatETB(car.pricePerDay)}</span>
              <span>{formatETB(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service fee</span>
              <span>{formatETB(totals.fee)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>Total</span>
              <span>{formatETB(totals.total)}</span>
            </div>
          </div>
          {error && <p role="alert"
            className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mt-3">{error}</p>}
          <Button onClick={submit}
            disabled={processing || days < 1}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold mt-4">{processing ? 'Processing...' : 'Confirm Booking'}</Button>
          <div className="flex items-center gap-1 justify-center text-xs text-slate-500 mt-3">
            <Shield className="w-3 h-3" />
            Booking payment information
          </div>
        </div>
      </aside>
    </div>
  </div>;
}
export default function CheckoutPage() {
  return <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
    <CheckoutContent />
  </Suspense>;
}
