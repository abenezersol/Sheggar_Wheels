'use client';
import type { Booking, Car, User } from '@/types';
import { updateBookingStatus } from './bookings';
import { readStorage, writeStorage, STORAGE_KEYS } from './storage';

export function getPlatformStats() {
  const users = readStorage<User[]>(STORAGE_KEYS.USERS, []);
  const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const activeUsers = users.filter(u => u.status === 'active').length;
  const approvedCars = cars.filter(c => c.status === 'approved').length;
  const pendingCars = cars.filter(c => c.status === 'pending').length;
  const bookingsByStatus = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1; return acc;
  }, {} as Record<string, number>);
  const monthly: Record<string, number> = {};
  bookings.filter(b => ['confirmed', 'in_progress', 'completed', 'reviewed'].includes(b.status)).forEach(b => { const month = b.createdAt.slice(0, 7); monthly[month] = (monthly[month] || 0) + b.total; });
  const chartData = Object.entries(monthly).map(([month, volume]) => ({ month, volume })).sort((a, b) => a.month.localeCompare(b.month));
  const totalCommission = bookings.filter(b => ['confirmed', 'in_progress', 'completed', 'reviewed'].includes(b.status)).reduce((sum, b) => sum + b.fee, 0);
  return { activeUsers, totalUsers: users.length, approvedCars, pendingCars, bookingsByStatus, chartData, totalCommission };
}
export function getAllCars(): Car[] { return readStorage<Car[]>(STORAGE_KEYS.CARS, []); }
export function getAllUsers(): User[] { return readStorage<User[]>(STORAGE_KEYS.USERS, []); }
export function updateCarStatus(id: string, status: Car['status']): boolean {
  const cars = getAllCars(); const index = cars.findIndex(c => c.id === id);
  if (index < 0) return false; cars[index] = { ...cars[index], status }; return writeStorage(STORAGE_KEYS.CARS, cars);
}
export function updateUserStatus(id: string, status: User['status']): boolean {
  const users = getAllUsers(); const index = users.findIndex(u => u.id === id);
  if (index < 0) return false; users[index] = { ...users[index], status }; return writeStorage(STORAGE_KEYS.USERS, users);
}

export function getAllBookings() {
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
  const users = readStorage<User[]>(STORAGE_KEYS.USERS, []);
  return bookings.map(b => ({ ...b, car: cars.find(c => c.id === b.carId), renter: users.find(u => u.id === b.renterId), owner: users.find(u => u.id === b.ownerId) })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function reviewBookingRequest(bookingId: string, status: 'confirmed' | 'declined') {
  return updateBookingStatus(bookingId, status, false, true);
}
