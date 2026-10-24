'use client';

import React, { useState } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types';

export interface OrderItemForReorder {
  productId?: string | null;
  productName: string;
  productSlug: string;
  variantId?: string | null;
  variantName?: string | null;
  unitPrice: number;
  quantity: number;
  image?: string | null;
  personalizationText?: string | null;
}

interface ReorderButtonProps {
  items: OrderItemForReorder[];
  className?: string;
  label?: string;
}

export function ReorderButton({
  items,
  className = '',
  label = 'Buy Again',
}: ReorderButtonProps) {
  const { addToCart, openCart } = useCart();
  const [isCopied, setIsCopied] = useState(false);

  const handleReorder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!items || items.length === 0) return;

    items.forEach((item) => {
      const resolvedProductId = item.productId || item.productSlug;
      const cartItem: CartItem = {
        id: `${resolvedProductId}-${item.variantId || 'default'}`,
        productId: resolvedProductId,
        name: item.productName,
        slug: item.productSlug,
        image: item.image || '/images/products/blushing-peony-rose-1.svg',
        unitPrice: item.unitPrice,
        quantity: item.quantity || 1,
        variantId: item.variantId || undefined,
        variantName: item.variantName || undefined,
        personalization: item.personalizationText || undefined,
      };
      addToCart(cartItem);
    });

    setIsCopied(true);
    openCart();

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      onClick={handleReorder}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-[0.98] ${
        isCopied
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
          : 'bg-gold-light hover:bg-gold/20 text-gold-hover border border-gold/30 hover:border-gold/60 shadow-2xs'
      } ${className}`}
      title="Add these handcrafted bouquets back to your shopping bag"
    >
      {isCopied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Added to Bag!</span>
        </>
      ) : (
        <>
          <RefreshCw className="w-3.5 h-3.5 text-gold shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
