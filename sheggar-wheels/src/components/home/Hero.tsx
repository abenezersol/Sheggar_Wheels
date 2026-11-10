'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Car } from '@/types';
import { getLocalCarImage } from '@/lib/car-images';

const FLEET_SIZE = 4;

/** Pick cars spread evenly across the price range so the list shows the real spread, cheapest to priciest. */
function pickFleet(cars: Car[], n = FLEET_SIZE): Car[] {
  const sorted = [...cars].sort((a, b) => a.pricePerDay - b.pricePerDay);
  if (sorted.length <= n) return sorted;
  return Array.from({ length: n }, (_, i) => sorted[Math.round((i * (sorted.length - 1)) / (n - 1))]);
}

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

export default function Hero({ cars, loaded }: { cars: Car[]; loaded: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const fleet = useMemo(() => pickFleet(cars), [cars]);
  const neighbourhoodCount = useMemo(() => new Set(cars.map(c => c.neighbourhood)).size, [cars]);
  const lowestPrice = cars.length ? Math.min(...cars.map(c => c.pricePerDay)) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/cars?q=' + encodeURIComponent(query.trim()));
  };

  return (
    <section className="bg-blue-900 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-24">
        {/* Left: the promise and the search */}
        <div>
          <h1 className="font-display text-5xl font-normal leading-[1.03] tracking-[-0.025em] sm:text-6xl lg:text-7xl">
            Cars from your neighbours, by the day.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-blue-100">
            Browse cars parked around Addis Ababa, see the daily price up front, and book straight with the owner.
          </p>

          <form
            onSubmit={handleSearch}
            role="search"
            className="mt-8 flex max-w-xl items-center gap-2 rounded-xl bg-white p-1.5 focus-within:ring-2 focus-within:ring-amber-400 focus-within:ring-offset-2 focus-within:ring-offset-blue-900"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search cars by make or model
            </label>
            <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
            <input
              id="hero-search"
              name="q"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Make or model, e.g. Toyota Vitz"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-1 py-3 text-base text-slate-900 outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-lg bg-amber-400 px-5 text-base font-semibold text-slate-900 transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
            >
              Search cars
            </button>
          </form>

          <p className="mt-4 min-h-6 text-base text-blue-200">
            {loaded && cars.length > 0 &&
              `${cars.length} cars in ${neighbourhoodCount} neighbourhoods, from ETB ${formatNumber(lowestPrice)} a day.`}
          </p>
        </div>

        {/* Right: the fleet. Hover or focus a row to see that car. */}
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-blue-950">
            {!loaded && <div className="absolute inset-0 animate-pulse bg-blue-800 motion-reduce:animate-none" />}

            {loaded && fleet.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 bg-blue-800 p-6">
                <p className="text-lg font-medium">No cars listed yet.</p>
                <Link href="/signup" className="text-base text-amber-300 underline underline-offset-4 hover:text-amber-200">
                  List the first one
                </Link>
              </div>
            )}

            {fleet.map((car, i) => (
              <Image
                key={car.id}
                src={getLocalCarImage(car)}
                alt={i === active ? `${car.make} ${car.model}` : ''}
                aria-hidden={i === active ? undefined : true}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 560px, 100vw"
                className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${
                  i === active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          <ul className="mt-4 border-t border-white/20" aria-label="Cars available now">
            {!loaded &&
              Array.from({ length: FLEET_SIZE }, (_, i) => (
                <li key={i} className="h-[3.4rem] border-b border-white/20">
                  <div className="my-3 h-7 animate-pulse rounded-lg bg-white/5 motion-reduce:animate-none" />
                </li>
              ))}

            {fleet.map((car, i) => {
              const isActive = i === active;
              return (
                <li key={car.id} className="border-b border-white/20">
                  <Link
                    href={'/cars/' + car.id}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`grid grid-cols-[1fr_auto] items-center gap-x-4 px-3 py-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-400 sm:grid-cols-[8.5rem_1fr_auto] ${
                      isActive ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="hidden text-base text-blue-200 sm:block">{car.neighbourhood}</span>

                    <span className="min-w-0">
                      <span className="block truncate text-base font-semibold">
                        {car.make} {car.model}
                      </span>
                      <span className="block text-sm text-blue-200 sm:hidden">{car.neighbourhood}</span>
                    </span>

                    <span className={`text-right tabular-nums ${isActive ? 'text-amber-300' : 'text-white'}`}>
                      <span className="text-base font-semibold">{formatNumber(car.pricePerDay)}</span>
                      <span className="ml-1 text-sm text-blue-200">ETB/day</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
