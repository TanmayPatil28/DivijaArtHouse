import { Flower2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-blush-soft border border-blush flex items-center justify-center text-primary animate-pulse mb-4">
        <Flower2 className="w-6 h-6 stroke-[1.5] animate-spin" style={{ animationDuration: '3s' }} />
      </div>
      <p className="text-sm font-medium text-text-muted">Loading handcrafted blooms...</p>
    </div>
  );
}
