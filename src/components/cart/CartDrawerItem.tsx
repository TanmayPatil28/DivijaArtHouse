'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Gift } from 'lucide-react';
import type { CartItem } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface CartDrawerItemProps {
  item: CartItem;
  onItemClick?: () => void;
}

const FALLBACK_IMAGE = '/images/products/blushing-peony-rose-1.svg';

export function CartDrawerItem({ item, onItemClick }: CartDrawerItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_IMAGE);

  const lineTotal = item.unitPrice * (item.quantity || 1);
  const maxStock = item.stock;
  const isAtMin = item.quantity <= 1;
  const isAtMax = maxStock !== undefined && maxStock !== null && item.quantity >= maxStock;

  return (
    <div className="flex gap-3.5 py-4 border-b border-border-subtle group">
      {/* Thumbnail */}
      <Link
        href={`/products/${item.slug}`}
        onClick={onItemClick}
        className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl bg-surface-warm border border-border-subtle overflow-hidden flex-shrink-0"
      >
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          sizes="88px"
          className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${item.slug}`}
              onClick={onItemClick}
              className="font-display font-medium text-sm text-text-main hover:text-primary transition-colors line-clamp-1"
              title={item.name}
            >
              {item.name}
            </Link>

            {/* Remove Action Button */}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-text-muted hover:text-primary p-1 -mr-1 rounded transition-colors"
              aria-label={`Remove ${item.name} from bag`}
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Variant Pill */}
          {item.variantName && (
            <div className="mt-0.5">
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-warm text-text-muted border border-border-subtle">
                Style: {item.variantName}
              </span>
            </div>
          )}

          {/* Personalization Note Preview */}
          {item.personalization && (
            <div className="mt-1 flex items-start gap-1 text-[11px] text-text-muted bg-blush-soft/50 rounded-md px-2 py-1 border border-blush/60">
              <Gift className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1 italic">
                Note: &ldquo;{item.personalization}&rdquo;
              </span>
            </div>
          )}
        </div>

        {/* Price and Stepper Row */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-border-subtle rounded-lg bg-white overflow-hidden shadow-2xs h-8">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={isAtMin}
              className="w-7 h-full flex items-center justify-center text-text-main hover:bg-surface-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm select-none"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-semibold select-none">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={isAtMax}
              className="w-7 h-full flex items-center justify-center text-text-main hover:bg-surface-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm select-none"
              aria-label="Increase quantity"
              title={isAtMax ? 'Maximum available stock reached' : undefined}
            >
              +
            </button>
          </div>

          {/* Pricing */}
          <div className="text-right">
            <div className="font-semibold text-sm text-text-main">
              {formatINR(lineTotal)}
            </div>
            {item.quantity > 1 && (
              <div className="text-[10px] text-text-muted">
                {formatINR(item.unitPrice)} each
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
