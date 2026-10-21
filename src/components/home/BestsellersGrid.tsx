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
      className="py-12 md:py-20 bg-surface-warm/40 border-b border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
              Most Loved Bestsellers
            </h2>
            <p className="text-sm text-text-muted mt-1 max-w-xl">
              Everlasting bouquets, sunny desk pots, and curated gift hampers that bring enduring smiles across India.
            </p>
          </div>

          <Link
            href="/shop?sort=featured"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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

        {/* Bottom Banner Prompt */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-surface-warm border border-border-subtle text-text-main hover:text-primary text-sm font-semibold transition-all shadow-sm hover:border-blush"
          >
            <span>Explore All 16+ Handcrafted Blooms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
