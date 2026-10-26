'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOwnerCars, updateCar } from '@/lib/owner';
import type { Car } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export default function EditCarPage() {
  const params = useParams<{ id: string }>(); const router = useRouter(); const [car, setCar] = useState<Car | null>(null); const [error, setError] = useState('');
  useEffect(() => { setCar(getOwnerCars().find(c => c.id === params.id) || null) }, [params.id]);
  if (!car) return <div className="rounded-xl border bg-white p-8">{error || 'Car not found or you do not own this car.'}</div>;
  const save = (e: React.FormEvent) => { e.preventDefault(); if (!car.make.trim() || !car.model.trim() || car.pricePerDay < 1) { setError('Enter a make, model, and valid price.'); return; } const ok = updateCar(car.id, { make: car.make, model: car.model, year: Number(car.year), pricePerDay: Number(car.pricePerDay), neighbourhood: car.neighbourhood, description: car.description }); if (ok) router.push('/owner/cars'); else setError('Could not update this car.'); };
  return <div className="max-w-2xl">
    <h1 className="mb-6 text-2xl font-bold">Edit Car</h1>
    <form onSubmit={save}
      className="space-y-4 rounded-2xl border bg-white p-6">
      {error && <p role="alert"
        className="text-sm text-red-700">{error}</p>}
      {(['make', 'model', 'year', 'pricePerDay', 'neighbourhood', 'description'] as const).map(key => <div key={key}>
        <Label htmlFor={key}>{key === 'pricePerDay' ? 'Price per day (ETB)' : key[0].toUpperCase() + key.slice(1)}</Label>
        <Input id={key}
          type={key === 'year' || key === 'pricePerDay' ? 'number' : 'text'}
          value={car[key]}
          onChange={e => setCar({ ...car, [key]: key === 'year' || key === 'pricePerDay' ? Number(e.target.value) : e.target.value })} />
      </div>)}
      <Button type="submit">Save Changes</Button>
    </form>
  </div>;
}
