'use client';

import type { Booking, Car } from '@/types';
import { readStorage, writeStorage, STORAGE_KEYS } from './storage';
import { getCurrentUser } from './auth';

export function calculateTotals(car: Car, days: number) {
  const safeDays = Math.max(0, Math.floor(days));
  const subtotal = car.pricePerDay * safeDays;
  const fee = Math.round(subtotal * 0.1);
  return { subtotal, fee, total: subtotal + fee };
}

export function createBooking(carId: string, startDate: string, endDate: string, days: number) {
  const user = getCurrentUser();
  if (!user) return { success: false as const, error: 'Not signed in' };
  if (!user.roles.includes('renter')) return { success: false as const, error: 'A renter account is required' };
  if (!startDate || !endDate || endDate <= startDate || !Number.isInteger(days) || days < 1) {
    return { success: false as const, error: 'Please choose valid rental dates' };
  }

  const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
  const car = cars.find((item) => item.id === carId && item.status === 'approved');
  if (!car) return { success: false as const, error: 'Car not found or unavailable' };

  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const activeStatuses: Booking['status'][] = ['requested', 'confirmed', 'in_progress'];
  const overlap = bookings.some((booking) =>
    booking.carId === carId &&
    activeStatuses.includes(booking.status) &&
    startDate < booking.endDate &&
    endDate > booking.startDate
  );
  if (overlap) return { success: false as const, error: 'Car is unavailable for these dates' };

  const { subtotal, fee, total } = calculateTotals(car, days);
  const now = new Date().toISOString();
  const newBooking: Booking = {
    id: crypto.randomUUID(),
    carId,
    renterId: user.id,
    ownerId: car.ownerId,
    startDate,
    endDate,
    days,
    pricePerDay: car.pricePerDay,
    subtotal,
    fee,
    total,
    paymentStatus: 'paid',
    status: 'requested',
    createdAt: now,
    updatedAt: now,
  };

  bookings.push(newBooking);
  if (!writeStorage(STORAGE_KEYS.BOOKINGS, bookings)) {
    return { success: false as const, error: 'Could not save booking. Check browser storage.' };
  }
  return { success: true as const, booking: newBooking };
}

export function updateBookingStatus(
  bookingId: string,
  newStatus: Booking['status'],
  isOwnerAction = false,
  isAdminAction = false
) {
  const user = getCurrentUser();
  if (!user) return { success: false as const, error: 'Not signed in' };

  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const index = bookings.findIndex((item) => item.id === bookingId);
  if (index === -1) return { success: false as const, error: 'Booking not found' };

  const booking = bookings[index];
  if (isAdminAction) {
    if (!user.roles.includes('admin')) return { success: false as const, error: 'Admin access required' };
  } else if (isOwnerAction) {
    if (booking.ownerId !== user.id || !user.roles.includes('owner')) {
      return { success: false as const, error: 'Not yours or owner access required' };
    }
  } else if (booking.renterId !== user.id) {
    return { success: false as const, error: 'Not yours' };
  }

  const validTransitions: Partial<Record<Booking['status'], Booking['status'][]>> = {
    requested: (isOwnerAction || isAdminAction) ? ['confirmed', 'declined'] : ['cancelled'],
    confirmed: (isOwnerAction || isAdminAction) ? ['in_progress', 'cancelled'] : ['cancelled'],
    in_progress: (isOwnerAction || isAdminAction) ? ['completed', 'disputed'] : ['disputed'],
    completed: ['reviewed'],
    disputed: ['resolved'],
  };

  if (!validTransitions[booking.status]?.includes(newStatus)) {
    return { success: false as const, error: 'Invalid state transition' };
  }

  const updated: Booking = { ...booking, status: newStatus, updatedAt: new Date().toISOString() };
  bookings[index] = updated;
  if (!writeStorage(STORAGE_KEYS.BOOKINGS, bookings)) {
    return { success: false as const, error: 'Could not save booking.' };
  }
  return { success: true as const, booking: updated };
}

export function getMyBookings() {
  const user = getCurrentUser();
  if (!user) return [];
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
  return bookings
    .filter((booking) => booking.renterId === user.id)
    .map((booking) => ({ ...booking, car: cars.find((car) => car.id === booking.carId) }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
