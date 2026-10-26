'use client';
import type { Booking, Car, User } from '@/types';
import { readStorage, writeStorage, STORAGE_KEYS } from './storage';
import { getCurrentUser } from './auth';

export function getOwnerCars(): Car[] {
  const user = getCurrentUser();
  if (!user) return [];
  return readStorage<Car[]>(STORAGE_KEYS.CARS, []).filter(car => car.ownerId === user.id);
}

export function getOwnerBookings() {
  const user = getCurrentUser();
  if (!user) return [];
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
  const users = readStorage<User[]>(STORAGE_KEYS.USERS, []);
  return bookings.filter(b => b.ownerId === user.id).map(b => ({
    ...b, car: cars.find(c => c.id === b.carId), renter: users.find(u => u.id === b.renterId),
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createCar(input: Omit<Car, 'id' | 'ownerId' | 'createdAt'>): Car | null {
  const user = getCurrentUser();
  if (!user || !user.roles.includes('owner')) return null;
  const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
  const car: Car = { ...input, id: crypto.randomUUID(), ownerId: user.id, createdAt: new Date().toISOString() };
  if (!writeStorage(STORAGE_KEYS.CARS, [...cars, car])) return null;
  return car;
}

export function updateCar(carId: string, updates: Partial<Car>): boolean {
  const user = getCurrentUser();
  if (!user || !user.roles.includes('owner')) return false;
  const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
  const index = cars.findIndex(c => c.id === carId && c.ownerId === user.id);
  if (index < 0) return false;
  cars[index] = { ...cars[index], ...updates, id: cars[index].id, ownerId: cars[index].ownerId };
  return writeStorage(STORAGE_KEYS.CARS, cars);
}

export function getOwnerEarnings() {
  const bookings = getOwnerBookings();
  const completed = bookings.filter(b => ['confirmed', 'in_progress', 'completed', 'reviewed'].includes(b.status));
  const total = completed.reduce((sum, b) => sum + b.total, 0);
  const monthly: Record<string, number> = {};
  completed.forEach(b => { const month = b.createdAt.slice(0, 7); monthly[month] = (monthly[month] || 0) + b.total; });
  const chartData = Object.entries(monthly).map(([month, earnings]) => ({ month, earnings })).sort((a, b) => a.month.localeCompare(b.month));
  return { total, count: completed.length, chartData };
}
