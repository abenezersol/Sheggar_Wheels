import { Car } from 'lucide-react';

export default function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">

      <div className="bg-slate-100 rounded-full p-4 mb-4">

        <Car className="w-8 h-8 text-slate-400" />

      </div>

      <h3 className="font-semibold text-lg text-slate-900 mb-1">{title}</h3>

      <p className="text-slate-500 max-w-sm">{description}</p>

    </div>
  );
}
