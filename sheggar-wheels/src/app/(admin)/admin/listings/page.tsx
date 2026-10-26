'use client';
import { useEffect, useState } from 'react';
import { getAllCars, updateCarStatus } from '@/lib/admin';
import type { Car } from '@/types';
import { formatETB } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
export default function AdminListings() {  
const [cars, setCars] = useState<Car[]>([]); const load = () => setCars(getAllCars()); useEffect(() => { load() }, []); const change = (id: string, status: Car['status']) => { updateCarStatus(id, status); load() }; return <div className="mx-auto max-w-6xl">
    <h1 className="mb-6 text-2xl font-bold">Car Listings</h1>
    <div className="divide-y rounded-2xl border bg-white">
      {cars.length === 0 ? <p className="p-12 text-center text-slate-500">No car listings yet.</p> : cars.map(car => <div key={car.id}
        className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <img src={car.photos[0] || '/file.svg'}
            className="h-14 w-14 rounded-lg object-cover"
            alt="" />
          <div>
            <div className="font-semibold">{car.make} {car.model}</div>
            <div className="text-xs text-slate-500">{formatETB(car.pricePerDay)}/day • {car.neighbourhood}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={car.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : car.status === 'pending' ? 'bg-amber-100 text-amber-800' : car.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}>{car.status}</Badge>
          {car.status === 'pending' && <><Button size="sm"
            className="bg-emerald-600"
            onClick={() => change(car.id, 'approved')}>Approve</Button><Button size="sm"
              variant="outline"
              className="text-red-600"
              onClick={() => change(car.id, 'rejected')}>Reject</Button></>}
          {car.status === 'approved' && <Button size="sm"
            variant="outline"
            onClick={() => change(car.id, 'inactive')}>Deactivate</Button>}
          {car.status === 'inactive' && <Button size="sm"
            variant="outline"
            onClick={() => change(car.id, 'approved')}>Reactivate</Button>}
        </div>
      </div>)}
    </div>
  </div>
}
