'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import type { CategoryWithProducts } from '@/types';

interface CollectionReelProps {
  categories: CategoryWithProducts[];
}

export function CollectionReel({ categories }: CollectionReelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const totalScroll = scrollWidth - clientWidth;
    if (totalScroll > 0) {
      setScrollProgress((scrollLeft / totalScroll) * 100);
    }
  };

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
      className="py-12 md:py-16 bg-surface-canvas border-b border-border-subtle relative overflow-hidden"
    >
      {/* Ambient Silk Atmosphere Glow */}
      <div 
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(197,154,90,0.08),transparent_70%)] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs mb-2 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>FIND YOUR KIND OF BLOOM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
              A little something{' '}
              <span className="font-serif italic font-normal text-primary">
                for every kind of love.
              </span>
            </h2>
            <p className="text-sm text-text-muted mt-1.5 max-w-2xl leading-relaxed">
              Some gifts make people smile. Others become part of their everyday lives. Explore handcrafted pieces for every personality, occasion, and little corner worth brightening.
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

        {/* Horizontally Scrollable Reel with Fluted Gold Concentric Medallions */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          data-lenis-prevent
          className="flex items-start gap-5 sm:gap-7 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex-shrink-0 flex flex-col items-center text-center w-28 sm:w-36 md:w-40 snap-start focus:outline-none"
            >
              {/* Luxury Gold-Halo Medallion Container */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1 bg-white/80 backdrop-blur-sm border border-gold/40 shadow-sm group-hover:border-gold group-hover:shadow-[0_8px_30px_rgba(197,154,90,0.35)] group-hover:scale-105 transition-all duration-500 ease-out flex items-center justify-center">
                {/* Concentric Golden Ring & Blush Medallion Disc */}
                <div className="relative w-full h-full rounded-full overflow-hidden p-1.5 bg-gradient-to-br from-white via-[#FCF3F5] to-[#F5E3E6]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-xs"
                    loading="lazy"
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

              {/* Interactive Shop Reveal */}
              <span className="text-[10px] sm:text-[11px] font-semibold text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 mt-1 transform translate-y-1 group-hover:translate-y-0">
                <span>Shop</span>
                <ArrowRight className="w-3 h-3 text-gold" />
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Subtle Progress Indicator Track */}
        <div className="sm:hidden mt-3 flex justify-center">
          <div className="w-24 h-1 bg-border-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-150"
              style={{ width: `${Math.max(25, scrollProgress)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
