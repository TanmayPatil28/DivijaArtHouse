'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { CategoryWithProducts } from '@/types';

interface CollectionReelProps {
  categories: CategoryWithProducts[];
}

export function CollectionReel({ categories }: CollectionReelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
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
      className="py-8 sm:py-10 md:py-12 bg-white border-b border-gold/30 relative overflow-hidden shadow-[0_4px_24px_-10px_rgba(46,23,21,0.06)] z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-canvas border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs mb-2 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>OUR 4 SIGNATURE CRAFTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
              Festive traditions{' '}
              <span className="font-serif italic font-normal text-primary">
                crafted for every home.
              </span>
            </h2>
            <p className="text-sm text-text-muted mt-1.5 max-w-2xl leading-relaxed">
              Explore our authentic handcrafted catalog: reusable Kundan OHP rangolis, plush woolen floor art, everlasting pipe cleaner florals, and artisanal home decor.
            </p>
          </div>

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full border border-gold/40 bg-white hover:bg-primary hover:text-white hover:border-primary text-text-main transition-all duration-300 shadow-sm hover:shadow-wine-glow active:scale-95"
              aria-label="Scroll collections left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full border border-gold/40 bg-white hover:bg-primary hover:text-white hover:border-primary text-text-main transition-all duration-300 shadow-sm hover:shadow-wine-glow active:scale-95"
              aria-label="Scroll collections right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Medallions Rail */}
        <div
          ref={scrollContainerRef}
          data-lenis-prevent
          className="flex items-center justify-start md:justify-around lg:justify-between gap-5 sm:gap-6 md:gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex-shrink-0 flex flex-col items-center text-center w-20 sm:w-24 md:w-28 snap-start focus:outline-none"
            >
              {/* Compact Gold-Halo Medallion */}
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 md:w-[88px] md:h-[88px] rounded-full p-1 bg-surface-canvas/90 border border-gold/40 shadow-2xs group-hover:border-gold group-hover:shadow-[0_6px_20px_rgba(197,154,90,0.35)] group-hover:scale-105 transition-all duration-300 ease-out flex items-center justify-center">
                <div className="relative w-full h-full rounded-full overflow-hidden p-1.5 bg-gradient-to-br from-white via-[#FCF3F5] to-[#F5E3E6]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-110 drop-shadow-2xs"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Title */}
              <span className="mt-2 text-xs sm:text-sm font-semibold text-text-main group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                {item.name}
              </span>

              {/* Design Count */}
              {item.count > 0 && (
                <span className="text-[11px] text-text-muted mt-0.5 leading-none font-sans not-italic tabular-nums">
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
