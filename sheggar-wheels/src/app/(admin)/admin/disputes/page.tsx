'use client';
import { useEffect, useState } from 'react';
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
type Dispute = { id: string; bookingId?: string; reason?: string; status?: string; resolvedAt?: string;[key: string]: unknown };
export default function AdminDisputes() {  
const [disputes, setDisputes] = useState<Dispute[]>([]); const load = () => setDisputes(readStorage<Dispute[]>(STORAGE_KEYS.DISPUTES, [])); useEffect(() => { load() }, []); const resolve = (id: string) => { const all = readStorage<Dispute[]>(STORAGE_KEYS.DISPUTES, []); const idx = all.findIndex(d => d.id === id); if (idx !== -1) { all[idx] = { ...all[idx], status: 'resolved', resolvedAt: new Date().toISOString() }; writeStorage(STORAGE_KEYS.DISPUTES, all); load() } }; return <div className="mx-auto max-w-6xl">
    <h1 className="mb-6 text-2xl font-bold">Disputes</h1>
    {disputes.length === 0 ? <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">No disputes to review. This section becomes active when a renter or owner raises an issue from a booking.</div> : <div className="divide-y rounded-2xl border bg-white">
      {disputes.map(d => <div key={d.id}
        className="flex items-center justify-between gap-4 p-4">
        <div>
          <div className="font-semibold">Booking #{d.bookingId?.slice(0, 8) || '—'}</div>
          <div className="text-sm text-slate-500">{d.reason || 'No reason provided'}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={d.status === 'resolved' ? 'bg-emerald-100' : 'bg-amber-100'}>{d.status || 'open'}</Badge>
          {d.status !== 'resolved' && <Button size="sm"
            onClick={() => resolve(d.id)}>Resolve</Button>}
        </div>
      </div>)}
    </div>}
  </div>
}
