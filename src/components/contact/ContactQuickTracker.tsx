'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackageSearch, ArrowRight } from 'lucide-react';

export function ContactQuickTracker() {
  const [orderNumber, setOrderNumber] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    router.push(`/track-order?orderNumber=${encodeURIComponent(orderNumber.trim())}`);
  };

  return (
    <form onSubmit={handleTrack} className="space-y-2">
      <div className="relative">
        <PackageSearch className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. DAH-89241"
          className="w-full pl-9 pr-20 py-2.5 text-xs rounded-xl border border-gold/35 bg-white text-text-main placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 font-sans not-italic uppercase tracking-wider shadow-2xs"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-xs active:scale-95"
        >
          <span>Track</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </form>
  );
}
