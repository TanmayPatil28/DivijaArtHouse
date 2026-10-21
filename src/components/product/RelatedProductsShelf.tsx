'use client';

import React from 'react';
import type { ProductWithCategory } from '@/types';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

interface RelatedProductsShelfProps {
  products: ProductWithCategory[];
}

export function RelatedProductsShelf({ products }: RelatedProductsShelfProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full mt-16 pt-12 border-t border-border-subtle">
      <div className="flex flex-col items-center text-center mb-8">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Complementary Blooms
        </span>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
          You May Also Cherish
        </h2>
        <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-md">
          Discover more artisan creations hand-crocheted with everlasting love to pair with your gift.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
