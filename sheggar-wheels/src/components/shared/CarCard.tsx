'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/types';
import { formatETB } from '@/lib/utils';
import { getLocalCarImage } from '@/lib/car-images';
import { Users, Gauge, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link href={'/cars/' + car.id}
      className="group block">

      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-900 hover:shadow-xl transition-all duration-300">

        <div className="relative h-52 bg-slate-100 overflow-hidden">

          <Image
            src={getLocalCarImage(car)}

            alt={`${car.make} ${car.model}`}

            fill

            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"

            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />

          <Badge className="absolute top-3 right-3 bg-white text-slate-900 hover:bg-white">
            {formatETB(car.pricePerDay)}/day
          </Badge>

        </div>

        <div className="p-4">

          <div className="flex items-start justify-between mb-2">

            <h3 className="font-bold text-lg text-slate-900">{car.make} {car.model}</h3>

            <span className="text-xs text-slate-500">{car.year}</span>

          </div>

          <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">

            <MapPin className="w-3.5 h-3.5" />
            {car.neighbourhood}
            ,
            {car.city}

          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 pt-3 border-t border-slate-100">

            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {car.seats}
              seats
            </span>

            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              {car.transmission}
            </span>

          </div>

        </div>

      </div>

    </Link>
  );
}
