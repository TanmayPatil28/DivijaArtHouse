'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CatalogToolbarProps {
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortValue: 'featured' | 'price_asc' | 'price_desc' | 'newest';
  onSortChange: (sort: 'featured' | 'price_asc' | 'price_desc' | 'newest') => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
] as const;

export function CatalogToolbar({
  totalCount,
  searchQuery,
  onSearchChange,
  sortValue,
  onSortChange,
  onOpenMobileFilters,
  activeFilterCount,
}: CatalogToolbarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Sync when prop changes externally (e.g. chip removed)
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Debounced search trigger (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localQuery, searchQuery, onSearchChange]);

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
      {/* Left: Total products count & Mobile Filter Toggle */}
      <div className="flex items-center justify-between md:justify-start gap-3">
        <p className="text-sm text-text-muted">
          Showing{' '}
          <span className="font-semibold text-text-main">{totalCount}</span>{' '}
          {totalCount === 1 ? 'creation' : 'creations'}
        </p>

        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle bg-white hover:bg-surface-warm text-xs font-semibold uppercase tracking-wider text-text-main shadow-xs transition-colors"
          aria-label="Open filter sidebar"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Right: Debounced Search & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input with Debounce */}
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search flowers, pots, gifts..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-full border border-border-subtle bg-white text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            aria-label="Search catalog products"
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-text-muted hover:text-text-main"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="relative flex-shrink-0">
          <label htmlFor="catalog-sort" className="sr-only">
            Sort products
          </label>
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            <select
              id="catalog-sort"
              value={sortValue}
              onChange={(e) =>
                onSortChange(
                  e.target.value as 'featured' | 'price_asc' | 'price_desc' | 'newest'
                )
              }
              className="w-full sm:w-auto appearance-none pl-8 pr-8 py-2 text-xs font-medium rounded-full border border-border-subtle bg-white text-text-main hover:bg-surface-warm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
