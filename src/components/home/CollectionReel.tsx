'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { CategoryWithProducts } from '@/types';

interface CollectionReelProps {
  categories: CategoryWithProducts[];
}

export function CollectionReel({ categories }: CollectionReelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const allItems = [
    {
      name: 'All Products',
      slug: 'all',
      href: '/shop',
      image: '/images/categories/all.svg',
      count: categories.reduce((sum, c) => sum + (c._count?.products || 0), 0),
    },
    ...categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      href: `/collections/${c.slug}`,
      image: c.image || '/images/categories/bouquets.svg',
      count: c._count?.products || 0,
    })),
  ];

  return (
    <section
      aria-label="Shop by Collection"
      className="py-12 md:py-16 bg-white border-b border-border-subtle overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>FIND YOUR KIND OF BLOOM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
              A little something for every kind of love.
            </h2>
            <p className="text-sm text-text-muted mt-1 max-w-2xl">
              Some gifts make people smile. Others become part of their everyday lives. Explore handcrafted pieces for every personality, occasion, and little corner worth brightening.
            </p>
          </div>

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full border border-border-subtle bg-white hover:bg-surface-warm hover:border-gold/50 text-text-main transition-colors shadow-sm"
              aria-label="Scroll collections left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full border border-border-subtle bg-white hover:bg-surface-warm hover:border-gold/50 text-text-main transition-colors shadow-sm"
              aria-label="Scroll collections right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontally Scrollable Reel */}
        <div
          ref={scrollContainerRef}
          data-lenis-prevent
          className="flex items-start gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex-shrink-0 flex flex-col items-center text-center w-28 sm:w-36 snap-start focus:outline-none"
            >
              {/* Circular Medallion Container */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-white border border-border-subtle group-hover:border-gold group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized={typeof item.image === 'string' && item.image.endsWith('.svg')}
                    className="object-contain p-1"
                  />
                </div>
              </div>

              {/* Title & Count */}
              <span className="mt-3 text-xs sm:text-sm font-semibold text-text-main group-hover:text-primary transition-colors line-clamp-1">
                {item.name}
              </span>
              {item.count > 0 && (
                <span className="text-[11px] text-text-muted mt-0.5">
                  {item.count} {item.count === 1 ? 'design' : 'designs'}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
