export type Role = 'renter' | 'owner' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type CarStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'inactive';
export type BookingStatus = 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'reviewed' | 'declined' | 'cancelled' | 'disputed' | 'resolved';
export type Transmission = 'Automatic' | 'Manual';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: Role[];
  status: UserStatus;
  createdAt: string;
}

export interface Car {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  transmission: Transmission;
  seats: number;
  city: string;
  neighbourhood: string;
  latitude: number;
  longitude: number;
  pricePerDay: number;
  photos: string[];
  description: string;
  status: CarStatus;
  unavailableDates: string[];
  createdAt: string;
}


export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  carId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  days: number;
  pricePerDay: number;
  subtotal: number;
  fee: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  carId: string;
  renterId: string;
  ownerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
