'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NEIGHBOURHOODS = ['Bole', 'Kazanchis', 'Old Airport', 'Piassa', 'Cmc', 'Megenagna', 'Sarbet', 'Summit'];

export default function CarFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (value && value !== 'all') newParams.set(key, value);
    else newParams.delete(key);
    router.push('/cars?' + newParams.toString());
  }, [params, router]);

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">

      <div>

        <Label className="text-xs font-semibold text-slate-500 uppercase">Search</Label>

        <Input placeholder="Make or model..."
          defaultValue={params.get('q') || ''}
          onChange={(e) => updateParam('q', e.target.value)}
          className="mt-1" />

      </div>

      <div>

        <Label className="text-xs font-semibold text-slate-500 uppercase">Neighbourhood</Label>

        <Select value={params.get('neighbourhood') || 'all'}
          onValueChange={(v) => {if (v !== null) {
                    updateParam('neighbourhood', v);}
                    }}>

          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">All areas</SelectItem>

            {NEIGHBOURHOODS.map(n => <SelectItem key={n}
              value={n}>{n}</SelectItem>)}

          </SelectContent>

        </Select>

      </div>

      <div>

        <Label className="text-xs font-semibold text-slate-500 uppercase">Transmission</Label>

        <Select value={params.get('transmission') || 'all'}
          onValueChange={(v) => {if (v !== null) {
                      updateParam('transmission', v);}
                  }}>

          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">Any</SelectItem>

            <SelectItem value="Automatic">Automatic</SelectItem>

            <SelectItem value="Manual">Manual</SelectItem>

          </SelectContent>

        </Select>

      </div>

      <div>

        <Label className="text-xs font-semibold text-slate-500 uppercase">Min Price (ETB)</Label>

        <Input type="number"
          placeholder="0"
          defaultValue={params.get('minPrice') || ''}
          onChange={(e) => updateParam('minPrice', e.target.value)}
          className="mt-1" />

      </div>

      <div>

        <Label className="text-xs font-semibold text-slate-500 uppercase">Max Price (ETB)</Label>

        <Input type="number"
          placeholder="20000"
          defaultValue={params.get('maxPrice') || ''}
          onChange={(e) => updateParam('maxPrice', e.target.value)}
          className="mt-1" />

      </div>

      <div>

        <Label className="text-xs font-semibold text-slate-500 uppercase">Min Seats</Label>

        <Input type="number"
          placeholder="1"
          defaultValue={params.get('minSeats') || ''}
          onChange={(e) => updateParam('minSeats', e.target.value)}
          className="mt-1" />

      </div>

    </div>
  );
}
