'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOwnerCars } from '@/lib/owner';
import type { Car } from '@/types';
import { formatETB } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil } from 'lucide-react';
export default function OwnerCars() {
  const [cars, setCars] = useState<Car[]>([]); useEffect(() => { setCars(getOwnerCars()) }, []);
  return <div className="mx-auto max-w-6xl">
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">My Cars</h1>
      <Link href="/owner/cars/new">
        <Button className="bg-blue-900">
          <Plus className="mr-1 h-4 w-4" />
          Add Car
        </Button>
      </Link>
    </div>

    {cars.length === 0 ? <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">No cars listed yet.</div> : <div className="grid gap-4 md:grid-cols-2">
      {cars.map(car => <div key={car.id}
        className="overflow-hidden rounded-2xl border bg-white">
        <img src={car.photos[0] || '/file.svg'}
          className="h-40 w-full object-cover"
          alt={`${car.make} ${car.model}`} />
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-bold">{car.make} {car.model}</h3>
            <Badge className={car.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>{car.status}</Badge>
          </div>
          <p className="mb-3 text-sm text-slate-500">{car.neighbourhood} • {formatETB(car.pricePerDay)}/day</p>
          <Link href={`/owner/cars/${car.id}/edit`}>
            <Button variant="outline"
              size="sm">
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </Link>
        </div>
      </div>)}
    </div>}
  </div>;
}
