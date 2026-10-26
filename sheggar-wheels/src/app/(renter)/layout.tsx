'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, signOut } from '@/lib/auth';
import { LayoutDashboard, Calendar, LogOut, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';

export default function RenterLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  const router = useRouter(); const pathname = usePathname();
  useEffect(() => { const current = getCurrentUser(); if (!current || !current.roles.includes('renter')) router.replace('/signin?next=' + encodeURIComponent(pathname)); else { setUser(current); setLoading(false); } }, [router, pathname]);
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  const nav = [{ href: '/dashboard', label: 'Overview', icon: LayoutDashboard }, { href: '/bookings', label: 'My Bookings', icon: Calendar }];
  return <div className="flex min-h-screen bg-slate-50">
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="p-6 border-b">
        <Link href="/"
          className="flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-900" />
          <span className="font-bold">Sheggar Wheels</span>
        </Link>
      </div>
      <div className="p-4 border-b">
        <p className="text-xs text-slate-500">Signed in as</p>
        <p className="font-semibold text-sm">{user?.name}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => <Link key={item.href}
          href={item.href}
          className={'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ' + (pathname === item.href ? 'bg-blue-50 text-blue-900' : 'text-slate-600 hover:bg-slate-50')}>
          <item.icon className="w-4 h-4" />
          {item.label}
        </Link>)}
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost"
          onClick={signOut}
          className="w-full justify-start">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
    <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
  </div>;
}
