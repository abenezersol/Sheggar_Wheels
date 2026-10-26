'use client';

import type { User, Role } from '@/types';
import { readStorage, STORAGE_KEYS } from './storage';

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  // Keep the demo session across route changes, reloads, and browser tabs.
  const userId = window.localStorage.getItem(STORAGE_KEYS.SESSION)
    ?? window.sessionStorage.getItem(STORAGE_KEYS.SESSION);
  if (!userId) return null;
  // Migrate sessions created by older versions of the demo.
  window.localStorage.setItem(STORAGE_KEYS.SESSION, userId);
  window.sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  const users = readStorage<User[]>(STORAGE_KEYS.USERS, []);
  const user = users.find((item) => item.id === userId);
  return user?.status === 'suspended' ? null : user ?? null;
}

export function signInAsDemo(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  const users = readStorage<User[]>(STORAGE_KEYS.USERS, []);
  const user = users.find((item) => item.id === userId);
  if (!user || user.status === 'suspended') return false;
  window.localStorage.setItem(STORAGE_KEYS.SESSION, userId);
  window.sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  return true;
}

export function signOut(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEYS.SESSION);
  window.sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  window.location.href = '/';
}

export function hasRole(user: User | null, role: Role): boolean {
  return user ? user.roles.includes(role) : false;
}

export function getSafeReturnPath(queryParam: string | null): string {
  if (!queryParam || !queryParam.startsWith('/') || queryParam.startsWith('//') || queryParam.includes('\\\\')) {
    return '/';
  }
  return queryParam;
}
