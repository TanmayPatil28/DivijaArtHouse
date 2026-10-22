'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CategoryWithProducts } from '@/types';

interface CollectionReelProps {
  categories: CategoryWithProducts[];
}

export function CollectionReel({ categories }: CollectionReelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

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
      className="relative bg-white border-b border-gold/30 shadow-[0_2px_12px_rgba(46,23,21,0.04)] z-10 py-4 sm:py-5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Floating Left Chevron */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-gold/40 items-center justify-center text-text-main shadow-md transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Floating Right Chevron */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-gold/40 items-center justify-center text-text-main shadow-md transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Horizontally Scrollable Full-Width Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          data-lenis-prevent
          className="flex items-center justify-start md:justify-around lg:justify-between gap-5 sm:gap-6 md:gap-4 overflow-x-auto py-1 scrollbar-none snap-x snap-mandatory scroll-smooth px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex-shrink-0 flex flex-col items-center text-center w-20 sm:w-24 md:w-28 snap-start focus:outline-none"
            >
              {/* Compact Gold-Halo Medallion */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-[84px] md:h-[84px] rounded-full p-1 bg-surface-canvas/90 border border-gold/40 shadow-2xs group-hover:border-gold group-hover:shadow-[0_4px_16px_rgba(197,154,90,0.3)] group-hover:scale-105 transition-all duration-300 ease-out flex items-center justify-center">
                <div className="relative w-full h-full rounded-full overflow-hidden p-1 bg-gradient-to-br from-white via-[#FCF3F5] to-[#F5E3E6]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-110 drop-shadow-2xs"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Title */}
              <span className="mt-2 text-[11px] sm:text-xs font-semibold text-text-main group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                {item.name}
              </span>

              {/* Design Count */}
              {item.count > 0 && (
                <span className="text-[10px] text-text-muted mt-0.5 leading-none">
                  {item.count} {item.count === 1 ? 'item' : 'items'}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
