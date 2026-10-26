'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/types';
import { readStorage, STORAGE_KEYS } from '@/lib/storage';
import { getLocalCarImage } from '@/lib/car-images';
import { formatETB } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Gauge, MapPin, Shield } from 'lucide-react';

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
    const found = cars.find(c => c.id === id && c.status === 'approved');
    if (found) setCar(found);
    else setNotFound(true);
  }, [id]);

  if (notFound) return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">

      <h1 className="text-2xl font-bold mb-2">Car not found</h1>

      <p className="text-slate-500 mb-6">This listing may have been removed or is not yet approved.</p>

      <Link href="/cars">
        <Button>Back to Catalogue</Button>
      </Link>

    </div>
  );

  if (!car) return <div className="p-20 text-center">Loading...</div>;

  const days = 3;
  const subtotal = car.pricePerDay * days;
  const fee = Math.round(subtotal * 0.1);
  const total = subtotal + fee;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <Link href="/cars"
        className="text-sm text-blue-900 hover:underline mb-4 inline-block">← Back to results</Link>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">

        <div>

          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 mb-6">

            <Image
              src={getLocalCarImage(car)}

              alt={`${car.make} ${car.model}`}

              fill

              priority

              sizes="(max-width: 1024px) 100vw, 65vw"

              className="object-cover"
            />

          </div>

          <div className="flex items-start justify-between mb-4">

            <div>

              <h1 className="text-3xl font-bold">{car.make} {car.model}</h1>

              <p className="text-slate-500">{car.year} • {car.neighbourhood}, {car.city}</p>

            </div>

            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Approved</Badge>

          </div>

          <div className="grid grid-cols-3 gap-4 my-6">

            {[
              { icon: Users, label: 'Seats', value: car.seats },
              { icon: Gauge, label: 'Transmission', value: car.transmission },
              { icon: MapPin, label: 'Area', value: car.neighbourhood },
            ].map((f, i) => (
              <div key={i}
                className="bg-white border border-slate-200 rounded-xl p-4">

                <f.icon className="w-5 h-5 text-blue-900 mb-2" />

                <div className="text-xs text-slate-500">{f.label}</div>

                <div className="font-semibold">{f.value}</div>

              </div>
            ))}

          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">

            <h2 className="font-bold mb-2">About this car</h2>

            <p className="text-slate-600">{car.description}</p>

          </div>

        </div>


        <aside className="lg:sticky lg:top-24 h-fit">

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <div className="mb-4">

              <span className="text-3xl font-bold">{formatETB(car.pricePerDay)}</span>

              <span className="text-slate-500"> / day</span>

            </div>

            <div className="space-y-2 text-sm mb-4 border-t border-slate-100 pt-4">

              <div className="flex justify-between">
                <span className="text-slate-500">3 days × {formatETB(car.pricePerDay)}</span>
                <span>{formatETB(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Service fee (10%)</span>
                <span>{formatETB(fee)}</span>
              </div>

              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span>
                <span>{formatETB(total)}</span>
              </div>

            </div>

            <Link href={'/checkout?carId=' + car.id}
              className="mb-2 flex w-full items-center justify-center rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800">
              Request Booking
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">

              <Shield className="w-3.5 h-3.5" />
              Secure booking process.

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}
