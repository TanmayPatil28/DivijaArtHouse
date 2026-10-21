'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { parseJson, calculateDiscount } from '@/lib/utils';
import type { ProductWithCategory } from '@/types';

interface ProductGalleryProps {
  product: ProductWithCategory;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = parseJson<string[]>(product.images, [
    '/images/products/blushing-peony-rose-1.svg',
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0] || '/images/products/blushing-peony-rose-1.svg';
  const discountPercent = calculateDiscount(product.price, product.compareAtPrice);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Primary Image Display */}
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-surface-warm via-blush-soft/30 to-surface-warm border border-border-subtle shadow-sm group">
        <div className="relative w-full h-full p-6 sm:p-10 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          <Image
            src={activeImage}
            alt={`${product.name} - View ${activeIndex + 1}`}
            fill
            priority
            unoptimized={activeImage.endsWith('.svg')}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4"
          />
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white shadow-md">
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Handcrafted Quality Pill */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-border-subtle text-[11px] font-medium text-text-main shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>100% Handcrafted Artisan Crochet</span>
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-4 right-4">
          {product.stockQuantity > 0 ? (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span>In Stock</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-[11px] font-semibold">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Interactive Thumbnail Carousel / Grid */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {images.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-warm border-2 transition-all p-2 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                    : 'border-border-subtle hover:border-blush opacity-75 hover:opacity-100'
                }`}
                aria-label={`View product image ${idx + 1}`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  fill
                  unoptimized={img.endsWith('.svg')}
                  sizes="96px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
