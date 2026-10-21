'use client';

import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
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
    <div className="w-full bg-surface-warm/90 border border-border-subtle rounded-xl p-3 sm:p-3.5 space-y-2">
      <div className="flex items-center justify-between text-xs font-medium">
        {isQualified ? (
          <span className="flex items-center gap-1.5 text-green-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>🎉 You have qualified for FREE delivery!</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-text-main">
            <Truck className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              Add{' '}
              <strong className="text-primary font-bold">
                {formatINR(remainingForFreeShipping)}
              </strong>{' '}
              more for FREE shipping!
            </span>
          </span>
        )}
        <span className="text-[11px] text-text-muted font-mono font-medium">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Track */}
      <div
        className="w-full h-2 bg-gray-200/80 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Free shipping qualification progress"
      >
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isQualified ? 'bg-green-600' : 'bg-primary'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
