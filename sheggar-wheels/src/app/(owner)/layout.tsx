'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, signOut } from '@/lib/auth';
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Car, CalendarDays, DollarSign, LogOut } from 'lucide-react';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false);
  useEffect(() => {
    const current = getCurrentUser();
    if (!current) { router.replace('/signin?next=' + encodeURIComponent(pathname)); return; }
    if (!current.roles.includes('owner')) {
      const users = readStorage<User[]>(STORAGE_KEYS.USERS, []);
      const updated = { ...current, roles: [...current.roles, 'owner' as const] };
      writeStorage(STORAGE_KEYS.USERS, users.map(item => item.id === current.id ? updated : item));
      setUser(updated);
    } else setUser(current);
    setReady(true);
  }, [pathname, router]);
  if (!ready) return <div className="p-20 text-center">Checking owner access...</div>;
  const nav = [
    { href: '/owner/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/owner/cars', label: 'My Cars', icon: Car },
    { href: '/owner/bookings', label: 'Bookings', icon: CalendarDays },
    { href: '/owner/earnings', label: 'Earnings', icon: DollarSign },
  ];
  return <div className="flex min-h-screen bg-slate-50">

    <aside className="hidden w-64 flex-col border-r bg-white md:flex">

      <div className="border-b p-6">
        <Link href="/"
          className="text-lg font-bold">Sheggar Wheels</Link>
        <p className="mt-1 text-xs font-semibold text-amber-600">OWNER PORTAL</p>
      </div>

      <div className="border-b p-4">
        <p className="text-xs text-slate-500">Signed in as</p>
        <p className="text-sm font-semibold">{user?.name}</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {nav.map(item => <Link key={item.href}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname === item.href ? 'bg-amber-50 text-amber-900' : 'text-slate-600 hover:bg-slate-50'}`}>
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>)}
      </nav>

      <div className="border-t p-4">
        <Button variant="ghost"
          onClick={signOut}
          className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

    </aside>
    <main className="min-w-0 flex-1 overflow-y-auto p-5 md:p-8">{children}</main>

  </div>;
}
