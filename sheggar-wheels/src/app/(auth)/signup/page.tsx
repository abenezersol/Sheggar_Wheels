'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage';
import { signInAsDemo } from '@/lib/auth';
import { initializeDemoData } from '@/lib/seed';
import type { User } from '@/types';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', asOwner: false });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('');
    const name = form.name.trim(), email = form.email.trim().toLowerCase(), phone = form.phone.trim();
    if (!name || !email || !phone || !form.password || !form.confirmPassword) { setError('Please fill in all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    initializeDemoData();
    const users = readStorage<User[]>(STORAGE_KEYS.USERS, []);
    if (users.some((user) => user.email.toLowerCase() === email)) { setError('An account with this email already exists.'); return; }
    const user: User = { id: crypto.randomUUID(), name, email, phone, roles: form.asOwner ? ['renter', 'owner'] : ['renter'], status: 'active', createdAt: new Date().toISOString() };
    if (!writeStorage(STORAGE_KEYS.USERS, [...users, user])) { setError('Could not save your account.'); return; }
    const credentials = readStorage<Record<string, string>>(STORAGE_KEYS.CREDENTIALS, {});
    if (!writeStorage(STORAGE_KEYS.CREDENTIALS, { ...credentials, [email]: form.password })) {
      writeStorage(STORAGE_KEYS.USERS, users);
      setError('Could not save your password. Please try again.');
      return;
    }
    signInAsDemo(user.id); router.push('/dashboard'); router.refresh();
  };
  return <><div className="text-center mb-6">
    <h1 className="text-2xl font-bold">Create Account</h1>
    <p className="text-sm text-slate-500 mt-1">Join Sheggar Wheels today</p>
  </div>
    {error && <p role="alert"
      className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>}
    <form onSubmit={submit}
      className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Abebe Bikila" />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com" />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone"
          type="tel"
          autoComplete="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+251 91 123 4567" />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="At least 6 characters" />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="Enter password again" />
      </div>

      <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
        <input type="checkbox"
          checked={form.asOwner}
          onChange={(e) => setForm({ ...form, asOwner: e.target.checked })}
          className="w-4 h-4 accent-blue-900" />
        <span className="text-sm">I also want to list my car as an owner</span>
      </label>

      <Button type="submit"
        className="w-full bg-blue-900 hover:bg-blue-800">Create Account</Button>
    </form>
    <p className="mt-6 text-center text-sm text-slate-500">
      Already have an account?
      <Link href="/signin"
        className="text-blue-900 font-medium hover:underline">Sign in</Link>
    </p></>;
}
