import React from 'react';
import type { OrderStatus } from '@prisma/client';
import { Package, Sparkles, Truck, CheckCircle2, XCircle } from 'lucide-react';

interface OrderProgressBarProps {
  status: OrderStatus | string;
  className?: string;
}

const STAGES = [
  { label: 'Placed', icon: Package },
  { label: 'Confirmed', icon: CheckCircle2 },
  { label: 'Crafting', icon: Sparkles },
  { label: 'Dispatched', icon: Truck },
  { label: 'Delivered', icon: CheckCircle2 },
];

function getStageIndex(status: string): number {
  switch (status) {
    case 'PENDING':
    case 'PENDING_COD':
      return 0;
    case 'CONFIRMED':
      return 1;
    case 'PROCESSING':
      return 2;
    case 'SHIPPED':
      return 3;
    case 'DELIVERED':
      return 4;
    case 'CANCELLED':
      return -1;
    default:
      return 0;
  }
}

export function OrderProgressBar({ status, className = '' }: OrderProgressBarProps) {
  const currentIndex = getStageIndex(status);

  if (currentIndex === -1) {
    return (
      <div className={`flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full w-fit ${className}`}>
        <XCircle className="w-3.5 h-3.5" />
        <span>Order Cancelled</span>
      </div>
    );
  }

  const progressPercent = (currentIndex / (STAGES.length - 1)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress Track */}
      <div className="relative h-1.5 bg-border-subtle rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold to-primary transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stage Labels */}
      <div className="flex items-center justify-between text-[11px]">
        {STAGES.map((s, idx) => {
          const isComplete = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={s.label}
              className={`flex items-center gap-1 ${
                isCurrent
                  ? 'text-primary font-bold'
                  : isComplete
                  ? 'text-text-main font-medium'
                  : 'text-text-subtle/70'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCurrent
                    ? 'bg-primary ring-2 ring-gold/40'
                    : isComplete
                    ? 'bg-gold'
                    : 'bg-border-subtle'
                }`}
              />
              <span className={idx > 0 && idx < 4 ? 'hidden sm:inline' : 'inline'}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
