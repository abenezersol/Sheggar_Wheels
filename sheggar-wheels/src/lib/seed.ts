import { User, Car } from '@/types';
import { writeStorage, STORAGE_KEYS, readStorage } from './storage';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Abebe Bikila', email: 'renter@demo.com', phone: '+251911000001', roles: ['renter'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u2', name: 'Sara Tesfaye', email: 'owner@demo.com', phone: '+251911000002', roles: ['owner', 'renter'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u3', name: 'Admin User', email: 'admin@demo.com', phone: '+251911000003', roles: ['admin'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u4', name: 'Dawit Bekele', email: 'dawit@demo.com', phone: '+251911000004', roles: ['owner'], status: 'active', createdAt: '2024-01-02T00:00:00Z' },
];

const MOCK_CARS: Car[] = [
  { id: 'c1', ownerId: 'u2', make: 'Toyota', model: 'Vitz', year: 2018, transmission: 'Automatic', seats: 5, city: 'Addis Ababa', neighbourhood: 'Bole', latitude: 8.9806, longitude: 38.7578, pricePerDay: 3500, photos: ['/Image/Cars/Vitz.png'], description: 'Great on fuel, perfect for city driving.', status: 'approved', unavailableDates: [], createdAt: '2024-01-03T00:00:00Z' },
  { id: 'c2', ownerId: 'u2', make: 'Suzuki', model: 'Dzire', year: 2020, transmission: 'Automatic', seats: 5, city: 'Addis Ababa', neighbourhood: 'Kazanchis', latitude: 9.0192, longitude: 38.7525, pricePerDay: 4200, photos: ['/Image/Cars/Suzuki_dzire.png'], description: 'Comfortable sedan for business trips.', status: 'approved', unavailableDates: [], createdAt: '2024-01-03T00:00:00Z' },
  { id: 'c3', ownerId: 'u4', make: 'Hyundai', model: 'Tucson', year: 2021, transmission: 'Automatic', seats: 5, city: 'Addis Ababa', neighbourhood: 'Old Airport', latitude: 8.9936, longitude: 38.7578, pricePerDay: 6800, photos: ['/Image/Cars/Hyundai_tucson.png'], description: 'Spacious SUV, great for family trips.', status: 'approved', unavailableDates: [], createdAt: '2024-01-04T00:00:00Z' },
  { id: 'c4', ownerId: 'u4', make: 'Toyota', model: 'Corolla', year: 2019, transmission: 'Manual', seats: 5, city: 'Addis Ababa', neighbourhood: 'Piassa', latitude: 9.0347, longitude: 38.7492, pricePerDay: 3800, photos: ['/Image/Cars/toyota_corola.png'], description: 'Reliable and economical.', status: 'approved', unavailableDates: [], createdAt: '2024-01-04T00:00:00Z' },
  { id: 'c5', ownerId: 'u2', make: 'Mitsubishi', model: 'Pajero', year: 2017, transmission: 'Automatic', seats: 7, city: 'Addis Ababa', neighbourhood: 'Cmc', latitude: 9.0200, longitude: 38.8100, pricePerDay: 8500, photos: ['/Image/Cars/Mitsubishi_pajero.png'], description: 'Powerful 4x4 for off-road adventures.', status: 'approved', unavailableDates: [], createdAt: '2024-01-05T00:00:00Z' },
  { id: 'c6', ownerId: 'u4', make: 'Kia', model: 'Rio', year: 2020, transmission: 'Automatic', seats: 5, city: 'Addis Ababa', neighbourhood: 'Megenagna', latitude: 9.0300, longitude: 38.7900, pricePerDay: 3900, photos: ['/Image/Cars/Kia_reo.png'], description: 'Modern compact car.', status: 'approved', unavailableDates: [], createdAt: '2024-01-05T00:00:00Z' },
  { id: 'c7', ownerId: 'u2', make: 'Toyota', model: 'Land Cruiser', year: 2016, transmission: 'Automatic', seats: 7, city: 'Addis Ababa', neighbourhood: 'Sarbet', latitude: 9.0080, longitude: 38.7480, pricePerDay: 12000, photos: ['/Image/Cars/Land_cruser.png'], description: 'Luxury SUV for VIP travel.', status: 'approved', unavailableDates: [], createdAt: '2024-01-06T00:00:00Z' },
  { id: 'c8', ownerId: 'u4', make: 'Honda', model: 'Fit', year: 2019, transmission: 'Automatic', seats: 5, city: 'Addis Ababa', neighbourhood: 'Summit', latitude: 9.0400, longitude: 38.8200, pricePerDay: 3300, photos: ['/Image/Cars/Honda_fit.png'], description: 'Small, efficient, and easy to park.', status: 'approved', unavailableDates: [], createdAt: '2024-01-06T00:00:00Z' },
];

export function initializeDemoData() {
  if (typeof window === 'undefined') return;
  const existing = readStorage<User[]>(STORAGE_KEYS.USERS, []);
  if (existing.length === 0) {
    writeStorage(STORAGE_KEYS.USERS, MOCK_USERS);
    writeStorage(STORAGE_KEYS.CARS, MOCK_CARS);
    writeStorage(STORAGE_KEYS.BOOKINGS, []);
  }
}

export function getApprovedCars(): Car[] {
  const cars = readStorage<Car[]>(STORAGE_KEYS.CARS, []);
  return cars.filter(c => c.status === 'approved');
}
