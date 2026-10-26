'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCar } from '@/lib/owner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export default function NewCarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ make: '', model: '', year: 2020, transmission: 'Automatic' as 'Automatic' | 'Manual', seats: 5, neighbourhood: '', pricePerDay: 3000, description: '', photo: '' });
  const [error, setError] = useState('');
  const change = (key: keyof typeof form, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setError(''); if (!form.make.trim() || !form.model.trim() || !form.neighbourhood.trim()) return setError('Please complete make, model, and neighbourhood.'); if (form.year < 1980 || form.year > new Date().getFullYear() + 1 || form.seats < 1 || form.pricePerDay < 1) return setError('Check the year, seats, and daily price.'); const car = createCar({ make: form.make.trim(), model: form.model.trim(), year: Number(form.year), transmission: form.transmission, seats: Number(form.seats), city: 'Addis Ababa', neighbourhood: form.neighbourhood.trim(), latitude: 9.0, longitude: 38.75, pricePerDay: Number(form.pricePerDay), photos: [form.photo.trim() || '/Image/Cars/Vitz.png'], description: form.description.trim(), status: 'pending', unavailableDates: [] }); if (car) router.push('/owner/cars'); else setError('Could not save the car. Check that you are signed in as an owner.'); };
  return <div className="max-w-2xl">
    <h1 className="mb-6 text-2xl font-bold">Add New Car</h1>
    <form onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border bg-white p-6">
      {error && <p role="alert"
        className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make *</Label>
          <Input id="make"
            value={form.make}
            onChange={e => change('make', e.target.value)}
            placeholder="Toyota"
            required />
        </div>
        <div>
          <Label htmlFor="model">Model *</Label>
          <Input id="model"
            value={form.model}
            onChange={e => change('model', e.target.value)}
            placeholder="Vitz"
            required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input id="year"
            type="number"
            value={form.year}
            onChange={e => change('year', Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="seats">Seats</Label>
          <Input id="seats"
            type="number"
            value={form.seats}
            onChange={e => change('seats', Number(e.target.value))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="transmission">Transmission</Label>
          <select id="transmission"
            className="h-10 w-full rounded-md border px-3"
            value={form.transmission}
            onChange={e => change('transmission', e.target.value)}>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </div>
        <div>
          <Label htmlFor="neighbourhood">Neighbourhood *</Label>
          <Input id="neighbourhood"
            value={form.neighbourhood}
            onChange={e => change('neighbourhood', e.target.value)}
            placeholder="Bole"
            required />
        </div>
      </div>
      <div>
        <Label htmlFor="price">Price per day (ETB)</Label>
        <Input id="price"
          type="number"
          value={form.pricePerDay}
          onChange={e => change('pricePerDay', Number(e.target.value))} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea id="description"
          className="min-h-24 w-full rounded-lg border p-3 text-sm"
          value={form.description}
          onChange={e => change('description', e.target.value)} />
      </div>
      <Button type="submit"
        className="w-full bg-blue-900">Submit for Approval</Button>
      <p className="text-center text-xs text-slate-500">An admin must approve the car before it appears publicly.</p>
    </form>
  </div>;
}
