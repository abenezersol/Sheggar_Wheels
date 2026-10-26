'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Booking, Review } from '@/types';
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>(); const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null); const [rating, setRating] = useState('5'); const [comment, setComment] = useState(''); const [error, setError] = useState('');
  useEffect(() => { const user = getCurrentUser(); if (!user) { router.replace('/signin?next=' + encodeURIComponent('/bookings/' + id + '/review')); return; } const found = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []).find((item) => item.id === id && item.renterId === user.id); setBooking(found ?? null); }, [id, router]);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const user = getCurrentUser(); if (!user || !booking || booking.status !== 'completed') { setError('Only the renter can review a completed booking.'); return; } const reviews = readStorage<Review[]>(STORAGE_KEYS.REVIEWS, []); if (reviews.some((item) => item.bookingId === booking.id)) { setError('This booking already has a review.'); return; } const review: Review = { id: crypto.randomUUID(), bookingId: booking.id, carId: booking.carId, renterId: user.id, ownerId: booking.ownerId, rating: Number(rating), comment: comment.trim(), createdAt: new Date().toISOString() }; if (!writeStorage(STORAGE_KEYS.REVIEWS, [...reviews, review])) { setError('Could not save review.'); return; } const updated = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []).map((item) => item.id === booking.id ? { ...item, status: 'reviewed' as const, updatedAt: new Date().toISOString() } : item); writeStorage(STORAGE_KEYS.BOOKINGS, updated); router.push('/bookings/' + booking.id); router.refresh(); };
  if (!booking) return <div className="p-12 text-center">Booking not found or loading.</div>;
  if (booking.status !== 'completed') return <div className="max-w-xl mx-auto p-12 text-center">
    <h1 className="text-2xl font-bold mb-3">Review unavailable</h1>
    <p className="text-slate-500 mb-4">You can review after the rental is completed.</p>
    <Link href={'/bookings/' + id}>Back to booking</Link>
  </div>;
  return <div className="max-w-xl mx-auto bg-white border rounded-2xl p-6">
    <h1 className="text-2xl font-bold mb-2">Leave a Review</h1>
    <p className="text-slate-500 mb-6">Share your experience with the car owner.</p>
    {error && <p role="alert"
      className="text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
    <form onSubmit={submit}
      className="space-y-4">
      <div>
        <Label htmlFor="rating">Rating</Label>
        <select id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border rounded-md p-2 mt-1">
          <option value="5">5 — Excellent</option>
          <option value="4">4 — Very good</option>
          <option value="3">3 — Good</option>
          <option value="2">2 — Fair</option>
          <option value="1">1 — Poor</option>
        </select>
      </div>
      <div>
        <Label htmlFor="comment">Comment (optional)</Label>
        <textarea id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={5}
          placeholder="How was your rental experience?"
          className="w-full border rounded-md p-3 mt-1" />
      </div>
      <Button type="submit"
        className="bg-blue-900">Submit Review</Button>
    </form>
  </div>;
}
