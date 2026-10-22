import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { ProductWithCategory } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

interface BestsellersGridProps {
  products: ProductWithCategory[];
}

export function BestsellersGrid({ products }: BestsellersGridProps) {
  return (
    <section
      aria-label="Bestselling Products"
      className="py-16 md:py-24 bg-[#FAF5F0] border-b border-gold/30 relative overflow-hidden"
    >
      {/* Subtle Warm Canvas Ambient Glow */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(232,184,188,0.12),transparent_70%)] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs mb-2.5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>FAVOURITES WORTH SHARING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
              The ones people{' '}
              <span className="font-serif italic font-normal text-primary">
                fall for.
              </span>
            </h2>
            <p className="text-sm text-text-muted mt-2 max-w-xl leading-relaxed">
              From cheerful desk companions to bouquets made for the biggest moments, these are the pieces to explore when you want your gift to feel a little more personal.
            </p>
          </div>

          <Link
            href="/shop?sort=featured"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gold/40 text-xs sm:text-sm font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-2xs hover:shadow-wine-glow group"
          >
            <span>Shop All Favourites</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Cards Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>

        {/* Bottom Banner Prompt with Gold Ambient Glow */}
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white hover:bg-primary text-text-main hover:text-white border border-gold/40 hover:border-primary text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-wine-glow hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore All Favourites</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
