'use client';
import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInAsDemo, getSafeReturnPath } from '@/lib/auth';
import { initializeDemoData } from '@/lib/seed';
import { readStorage, STORAGE_KEYS } from '@/lib/storage';
import type { User } from '@/types';

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    initializeDemoData();
    const normalizedEmail = email.trim().toLowerCase();
    const users = readStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);
    const credentials = readStorage<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, {});
    if (!user || user.status === 'suspended' || credentials[normalizedEmail] !== password) {
      setError('Email or password is incorrect. If this is a demo account, use the demo sign-in buttons below.');
      return;
    }
    if (signInAsDemo(user.id)) {
      router.push(getSafeReturnPath(params.get('next')) === '/' ? '/dashboard' : getSafeReturnPath(params.get('next')));
      router.refresh();
    } else setError('Could not sign you in. Please try again.');
  };
  const demoAccounts = [
    { id: 'u1', name: 'Abebe Bikila', email: 'renter@demo.com', role: 'Renter', desc: 'Demo renter account' },
    { id: 'u2', name: 'Sara Tesfaye', email: 'owner@demo.com', role: 'Owner & Renter', desc: 'Demo owner account' },
    { id: 'u3', name: 'Admin User', email: 'admin@demo.com', role: 'Admin', desc: 'Demo admin account' },
  ];
  const signInDemo = (id: string) => {
    initializeDemoData();
    if (signInAsDemo(id)) {
      router.push(getSafeReturnPath(params.get('next')) === '/' ? (id === 'u3' ? '/' : id === 'u2' ? '/owner/bookings' : '/dashboard') : getSafeReturnPath(params.get('next')));
      router.refresh();
    } else setError('This demo account is unavailable. Refresh the page and try again.');
  };
  return <>
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold">Welcome Back</h1>
      <p className="text-sm text-slate-500 mt-1">Sign in to your Sheggar Wheels account</p>
    </div>
    {error && <p role="alert"
      className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>}
    <form onSubmit={submit}
      className="space-y-4">

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password" />
      </div>

      <Button type="submit"
        className="w-full bg-blue-900 hover:bg-blue-800">Sign In</Button>

    </form>
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-xs uppercase tracking-wider text-slate-400">Or try a demo</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
    <div className="space-y-3">
      {demoAccounts.map((account) => <button type="button"
        key={account.id}
        onClick={() => signInDemo(account.id)}
        className="w-full text-left p-4 border rounded-xl hover:border-blue-900 hover:bg-blue-50 transition-all group">
        <div className="flex justify-between items-center gap-3">
          <div>
            <div className="font-semibold">{account.name}</div>
            <div className="text-xs text-slate-500">{account.desc}</div>
            <div className="text-xs text-slate-400 mt-1">{account.email}</div>
          </div>
          <span className="text-xs bg-slate-100 group-hover:bg-blue-100 px-2 py-1 rounded">{account.role}</span>
        </div>
      </button>)}
    </div>
    <p className="mt-6 text-center text-sm text-slate-500">
      Don&apos;t have an account?
      <Link href="/signup"
        className="text-blue-900 font-medium hover:underline">Sign up</Link>
    </p>
    <p className="mt-4 text-xs text-slate-400">Demo note: accounts created here are stored in this browser only. This is a coursework demo, not production authentication.</p>
  </>;
}
export default function SignInPage() {
  return <Suspense fallback={<div>Loading...</div>}>
    <SignInForm />
  </Suspense>;
}
