'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/auth/AdminGuard';
import {
  LayoutDashboard,
  Users,
  Car,
  AlertTriangle,
  LogOut,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, signOut } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = getCurrentUser();

  const nav = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/listings', label: 'Listings', icon: Car },
    { href: '/admin/bookings', label: 'Rental Requests', icon: CalendarDays },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
  ];

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-slate-50">
        <aside className="flex w-64 flex-col bg-slate-900 text-white">
          <div className="border-b border-slate-800 p-6">
            <Link href="/" className="text-lg font-bold">
              Sheggar Wheels
            </Link>
            <p className="mt-1 text-xs font-semibold text-amber-400">
              ADMIN PORTAL
            </p>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-slate-800 text-amber-400'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="mb-3 text-sm font-semibold">
              {user?.name ?? 'Administrator'}
            </p>

            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start text-slate-300 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
