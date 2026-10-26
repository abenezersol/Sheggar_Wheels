'use client';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CarCard from '@/components/shared/CarCard';
import CarFilters from '@/components/cars/CarFilters';
import EmptyState from '@/components/shared/EmptyState';
import { Car } from '@/types';
import { initializeDemoData, getApprovedCars } from '@/lib/seed';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function CarsContent() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    initializeDemoData();
    setCars(getApprovedCars());
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    let result = [...cars];
    const q = params.get('q')?.toLowerCase();
    const nb = params.get('neighbourhood');
    const trans = params.get('transmission');
    const minPrice = Number(params.get('minPrice')) || 0;
    const maxPrice = Number(params.get('maxPrice')) || Infinity;
    const minSeats = Number(params.get('minSeats')) || 0;
    const sort = params.get('sort') || 'newest';

    if (q) result = result.filter(c => (c.make + ' ' + c.model).toLowerCase().includes(q));
    if (nb && nb !== 'all') result = result.filter(c => c.neighbourhood === nb);
    if (trans && trans !== 'all') result = result.filter(c => c.transmission === trans);
    result = result.filter(c => c.pricePerDay >= minPrice && c.pricePerDay <= maxPrice);
    result = result.filter(c => c.seats >= minSeats);

    if (sort === 'price-asc') result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sort === 'price-desc') result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [cars, params]);

  const handleSort = (value: string | null) => {
    if (!value) return;
    const newParams = new URLSearchParams(params.toString());
    newParams.set('sort', value);
    router.push('/cars?' + newParams.toString());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">Browse Cars</h1>

        <p className="text-slate-500 mt-1">
          {loading ? 'Loading...' : filtered.length + ' car' + (filtered.length !== 1 ? 's' : '') + ' available in Addis Ababa'}
        </p>

      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">

        <aside>
          <CarFilters />
        </aside>

        <div>

          <div className="flex justify-end mb-4">

            <Select value={params.get('sort') || 'newest'}
              onValueChange={handleSort}>

              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="newest">Newest</SelectItem>

                <SelectItem value="price-asc">Price: Low to High</SelectItem>

                <SelectItem value="price-desc">Price: High to Low</SelectItem>

              </SelectContent>

            </Select>

          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i}
                className="h-80 rounded-2xl" />)}

            </div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No cars match your filters"
              description="Try adjusting your search or clearing filters to see more vehicles." />
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

              {filtered.map(car => <CarCard key={car.id}
                car={car} />)}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function CarsPage() {
  return <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
    <CarsContent />
  </Suspense>;
}
