'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CarCard from '@/components/shared/CarCard';
import { initializeDemoData, getApprovedCars } from '@/lib/seed';
import { useEffect, useState } from 'react';
import { Car } from '@/types';
import { Search, Shield, TrendingUp, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    initializeDemoData();
    setCars(getApprovedCars().slice(0, 4));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/cars?q=' + encodeURIComponent(query.trim()));
  };

  return (
    <>
      {/* ============ SIMPLE MODERN HERO ============ */}
      <section className="relative overflow-hidden bg-slate-50 pt-24 pb-32">


        {/* Beautiful Gradient Background */}

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50/50" />


        {/* Soft glowing blobs for a modern feel */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10" />

        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-amber-100/40 rounded-full blur-3xl -z-10" />


        <div className="relative max-w-4xl mx-auto px-4 text-center">


          {/* Small Top Badge */}

          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-8 shadow-sm">

            <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>

            <span className="text-sm font-medium text-slate-600">Available in Addis Ababa</span>

          </div>


          {/* Big Clean Heading */}

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">

            Your next ride,

            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
              right around the corner.
            </span>

          </h1>


          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Rent directly from trusted local owners. No hidden fees, flexible dates, and a seamless booking experience.
          </p>


          {/* Clean Search Bar */}

          <form onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-16 relative group">

            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-amber-100 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-lg border border-slate-100">

              <div className="flex-1 flex items-center gap-3 px-4">

                <Search className="w-5 h-5 text-slate-400" />

                <input
                  value={query}

                  onChange={(e) => setQuery(e.target.value)}

                  placeholder="Search by make or model (e.g. Toyota Vitz)"

                  className="w-full bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 text-lg"
                />

              </div>

              <Button type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl px-8 h-12 text-base font-semibold">
                Search
              </Button>

            </div>

          </form>


        </div>

      </section>

      {/* FEATURED CARS */}
      <section className="max-w-7xl mx-auto px-4 py-20 -mt-10 relative z-10">

        <div className="flex items-end justify-between mb-10">

          <div>

            <h2 className="text-3xl font-bold text-slate-900">Featured Cars</h2>

            <p className="text-slate-500 mt-1">Hand-picked vehicles from top-rated owners.</p>

          </div>

          <Link href="/cars">

            <Button variant="outline"
              className="hidden sm:flex">

              View All
              <ArrowRight className="w-4 h-4 ml-1" />

            </Button>

          </Link>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {cars.map(car => <CarCard key={car.id}
            car={car} />)}

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works"
        className="bg-white py-24 border-y border-slate-200">

        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-16">How Sheggar Wheels Works</h2>

          <div className="grid md:grid-cols-3 gap-12">

            {[
              { icon: Search, title: 'Find a Car', desc: 'Browse verified vehicles near you, filter by price, area, and availability.' },
              { icon: Shield, title: 'Book Securely', desc: 'Reserve your car with a mock TeleBirr payment. Prices locked in instantly.' },
              { icon: TrendingUp, title: 'Hit the Road', desc: 'Pick up your car and enjoy the journey. Leave a review after you are done.' },
            ].map((f, i) => (
              <div key={i}
                className="text-center">

                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">

                  <f.icon className="w-7 h-7 text-blue-900" />

                </div>

                <h3 className="font-bold text-xl mb-3">{f.title}</h3>

                <p className="text-slate-500 leading-relaxed">{f.desc}</p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">

          {/* Subtle pattern overlay */}

          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />

          <div className="relative z-10">

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Own a car? Start earning today.</h2>

            <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">Your car sits idle 90% of the time. Turn it into income — list it on Sheggar Wheels in minutes.</p>

            <Link href="/signup">

              <Button className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-8 h-12 text-base">
                List Your Car
              </Button>

            </Link>

          </div>

        </div>

      </section>
    </>
  );
}