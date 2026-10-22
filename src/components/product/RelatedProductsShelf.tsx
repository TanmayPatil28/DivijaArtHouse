'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { ProductWithCategory } from '@/types';
import { ProductCard } from './ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface RelatedProductsShelfProps {
  products: ProductWithCategory[];
}

export function RelatedProductsShelf({ products }: RelatedProductsShelfProps) {
  if (!products || products.length === 0) return null;

  return (
    <section 
      aria-label="Complementary and related artisan creations"
      className="w-full mt-16 sm:mt-20 bg-[#F7ECEE] border-t border-gold/30 py-16 sm:py-20 relative overflow-hidden"
    >
      {/* Ambient Radial Floral Glow */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(197,154,90,0.09),transparent_70%)] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-0 left-10 w-96 h-96 bg-[radial-gradient(circle,rgba(120,29,44,0.06),transparent_70%)] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <SectionHeader
          eyebrow="Complementary Blooms"
          titleLead="You May Also"
          titleAccent="Cherish."
          description="Discover more artisan creations hand-crocheted with everlasting love to pair with your gift."
          align="center"
          size="lg"
        />

        {/* 4 Recommended Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Explore Full Boutique Catalogue CTA */}
        <div className="mt-12 sm:mt-14 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
          >
            <span>Explore Full Boutique Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
