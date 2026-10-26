'use client';
import Link from 'next/link';
import { Car as CarIcon, Menu, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { getCurrentUser, hasRole, signOut } from '@/lib/auth';
import type { User } from '@/types';
export default function Navbar() {  
const [open, setOpen] = useState(false); const [user, setUser] = useState<User | null>(null); useEffect(() => { const sync = () => setUser(getCurrentUser()); sync(); window.addEventListener('storage', sync); window.addEventListener('focus', sync); return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus', sync) } }, []); const links = <><Link onClick={() => setOpen(false)}
    href="/cars"
    className="text-sm font-medium text-slate-600 hover:text-slate-900">Browse Cars</Link>{user && hasRole(user, 'renter') && <Link onClick={() => setOpen(false)}
      href="/dashboard"
      className="text-sm font-medium text-slate-600 hover:text-slate-900">My Dashboard</Link>}{user && hasRole(user, 'owner') && <Link onClick={() => setOpen(false)}
        href="/owner/dashboard"
        className="text-sm font-medium text-slate-600 hover:text-slate-900">Owner Portal</Link>}{user && hasRole(user, 'admin') && <Link onClick={() => setOpen(false)}
          href="/admin"
          className="text-sm font-medium text-slate-600 hover:text-slate-900">Admin</Link>}</>; return <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <Link href="/"
                  className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-900 p-2">
                    <CarIcon className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">
                    Sheggar
                    <span className="text-amber-500">Wheels</span>
                  </span>
                </Link>
                <div className="hidden items-center gap-6 md:flex">{links}</div>
                <div className="hidden items-center gap-3 md:flex">
                  {user ? <><span className="text-sm text-slate-500">Hi, {user.name.split(' ')[0]}</span><Button variant="ghost"
                    aria-label="Sign out"
                    onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                  </Button></> : <><Link href="/signin">
                    <Button variant="ghost">Sign In</Button>
                  </Link><Link href="/signup">
                      <Button className="bg-blue-900 hover:bg-blue-800">Get Started</Button>
                    </Link></>}
                </div>
                <button type="button"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  className="md:hidden"
                  onClick={() => setOpen(v => !v)}>
                  {open ? <X /> : <Menu />}
                </button>
              </div>
              {open && <div className="space-y-4 border-t py-4 md:hidden">
                <div className="flex flex-col gap-4">{links}</div>
                {user ? <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Hi, {user.name.split(' ')[0]}</span>
                  <Button variant="outline"
                    onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div> : <div className="flex gap-3">
                  <Link href="/signin">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-blue-900">Get Started</Button>
                  </Link>
                </div>}
              </div>}
            </div>
          </nav>
}
