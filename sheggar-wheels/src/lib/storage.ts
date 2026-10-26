export const STORAGE_KEYS = {
  USERS: 'sw_users_v1',
  CARS: 'sw_cars_v1',
  BOOKINGS: 'sw_bookings_v1',
  REVIEWS: 'sw_reviews_v1',
  DISPUTES: 'sw_disputes_v1',
  ANNOUNCEMENTS: 'sw_announcements_v1',
  SESSION: 'sw_session_v1',
  CREDENTIALS: 'sw_credentials_v1',
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error('Error parsing storage key', key, error);
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error writing to storage key', key, error);
    return false;
  }
}
