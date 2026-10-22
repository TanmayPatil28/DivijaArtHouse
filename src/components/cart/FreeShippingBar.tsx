'use client';

import React from 'react';
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD } from '@/context/CartContext';

interface FreeShippingBarProps {
  subtotal: number;
  remainingForFreeShipping: number;
}

export function FreeShippingBar({
  subtotal,
  remainingForFreeShipping,
}: FreeShippingBarProps) {
  const isQualified = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="w-full bg-[#FAF6F1] border border-gold/30 rounded-2xl p-3 sm:p-3.5 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between text-xs font-medium">
        {isQualified ? (
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
            <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Complimentary Pan-India Delivery Unlocked!</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-text-main text-xs">
            <Truck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>
              Add{' '}
              <strong className="text-primary font-bold font-sans not-italic tabular-nums">
                {formatINR(remainingForFreeShipping)}
              </strong>{' '}
              more to unlock Complimentary Shipping
            </span>
          </span>
        )}
        <span className="text-[11px] font-semibold font-sans not-italic tabular-nums text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
          {progressPercent}%
        </span>
      </div>

      {/* Luxury Progress Track with Gold Accent */}
      <div
        className="w-full h-2 bg-black/5 rounded-full overflow-hidden border border-black/5"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Free shipping qualification progress"
      >
        <div
          className={`h-full transition-all duration-600 ease-out rounded-full ${
            isQualified
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-sm'
              : 'bg-gradient-to-r from-primary via-[#8A2435] to-gold shadow-sm'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
