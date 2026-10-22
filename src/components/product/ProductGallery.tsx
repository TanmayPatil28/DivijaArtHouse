'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
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

  const isSvg = (src: string) => src.endsWith('.svg');

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Primary Image Display Showcase */}
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#F5EFE6] to-[#ECE3D5] border border-gold/25 ring-1 ring-gold/15 shadow-md group isolate">
        
        {/* Ambient Warm Vignette */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(197,154,90,0.06)_100%)] pointer-events-none z-10" 
          aria-hidden="true" 
        />

        {/* Product Image Frame */}
        <div className="relative w-full h-full p-4 sm:p-6 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          {isSvg(activeImage) ? (
            <img
              src={activeImage}
              alt={`${product.name} - View ${activeIndex + 1}`}
              className="w-full h-full object-contain p-2 drop-shadow-sm select-none"
            />
          ) : (
            <Image
              src={activeImage}
              alt={`${product.name} - View ${activeIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-3 drop-shadow-md select-none"
            />
          )}
        </div>

        {/* Top Badges Row */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-20 pointer-events-none">
          {/* Discount Badge */}
          {discountPercent > 0 ? (
            <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-primary text-white border border-gold/40 shadow-md">
              {discountPercent}% OFF
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/90 text-primary border border-gold/30 shadow-xs backdrop-blur-sm">
              Artisan Keepsake
            </span>
          )}

          {/* Social Proof Star Rating Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-gold/30 text-[11px] font-semibold text-text-main shadow-xs">
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span>4.9</span>
            <span className="text-text-muted text-[10px] font-normal">(140+)</span>
          </div>
        </div>

        {/* Bottom Badges Row */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-20 pointer-events-none">
          {/* Handcrafted Quality Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-gold/30 text-[11px] font-medium text-text-main shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">Handcrafted by Women Artisans</span>
            <span className="sm:hidden">Handcrafted</span>
          </div>

          {/* Stock & Dispatch Status */}
          <div>
            {product.stockQuantity > 0 ? (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-900/10 text-emerald-800 border border-emerald-700/25 text-[11px] font-semibold backdrop-blur-md bg-white/95">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>In Stock • Ready to Ship</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-[11px] font-semibold">
                Bespoke Order Only
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {images.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden flex-shrink-0 bg-[#FAF6F0] border-2 transition-all p-2 ${
                  isSelected
                    ? 'border-primary ring-2 ring-gold/40 shadow-md scale-102'
                    : 'border-border-subtle hover:border-gold/40 opacity-75 hover:opacity-100'
                }`}
                aria-label={`View product image ${idx + 1}`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                {isSvg(img) ? (
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="88px"
                    className="object-contain p-1"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
