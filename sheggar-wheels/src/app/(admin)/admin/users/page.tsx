'use client';
import { useEffect, useState } from 'react';
import { getAllUsers, updateUserStatus } from '@/lib/admin';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
export default function AdminUsers() {  
const [users, setUsers] = useState<User[]>([]); const load = () => setUsers(getAllUsers()); useEffect(() => { load() }, []); const toggle = (u: User) => { updateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active'); load() }; return <div className="mx-auto max-w-6xl">
    <h1 className="mb-6 text-2xl font-bold">Users</h1>
    <div className="divide-y rounded-2xl border bg-white">
      {users.length === 0 ? <p className="p-12 text-center text-slate-500">No users found.</p> : users.map(u => <div key={u.id}
        className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <div className="font-semibold">{u.name}</div>
          <div className="text-xs text-slate-500">{u.email} • {u.roles.join(', ')}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}>{u.status}</Badge>
          {!u.roles.includes('admin') && <Button size="sm"
            variant="outline"
            onClick={() => toggle(u)}>{u.status === 'active' ? 'Suspend' : 'Reactivate'}</Button>}
        </div>
      </div>)}
    </div>
  </div>
}
