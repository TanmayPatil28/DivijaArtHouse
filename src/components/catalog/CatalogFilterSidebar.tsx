'use client';

import React, { useState } from 'react';
import type { CategoryWithProducts } from '@/types';
import { Check, Filter, RotateCcw } from 'lucide-react';

interface CatalogFilterSidebarProps {
  categories: CategoryWithProducts[];
  selectedCategory?: string;
  minPrice?: number; // in INR
  maxPrice?: number; // in INR
  inStock?: boolean;
  onCategoryChange: (categorySlug: string | undefined) => void;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
  onInStockChange: (inStock: boolean) => void;
  onResetAll: () => void;
  isCategoryLocked?: boolean;
}

const PRICE_PRESETS = [
  { label: 'All Prices', min: undefined, max: undefined },
  { label: 'Under ₹1,000', min: undefined, max: 1000 },
  { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 & Above', min: 2000, max: undefined },
];

export function CatalogFilterSidebar({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  inStock,
  onCategoryChange,
  onPriceChange,
  onInStockChange,
  onResetAll,
  isCategoryLocked = false,
}: CatalogFilterSidebarProps) {
  const [customMin, setCustomMin] = useState<string>(
    minPrice !== undefined ? String(minPrice) : ''
  );
  const [customMax, setCustomMax] = useState<string>(
    maxPrice !== undefined ? String(maxPrice) : ''
  );

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const min = customMin.trim() ? Math.max(0, parseInt(customMin, 10)) : undefined;
    const max = customMax.trim() ? Math.max(0, parseInt(customMax, 10)) : undefined;
    onPriceChange(min, max);
  };

  const handlePresetClick = (presetMin?: number, presetMax?: number) => {
    setCustomMin(presetMin !== undefined ? String(presetMin) : '');
    setCustomMax(presetMax !== undefined ? String(presetMax) : '');
    onPriceChange(presetMin, presetMax);
  };

  const hasActiveFilters =
    (!isCategoryLocked && selectedCategory) ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    inStock;

  return (
    <div className="w-full space-y-6 text-text-main">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h2 className="font-display font-bold text-lg text-text-main">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setCustomMin('');
              setCustomMax('');
              onResetAll();
            }}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Categories Filter (hidden if locked to a collection) */}
      {!isCategoryLocked && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Categories
          </h3>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onCategoryChange(undefined)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                !selectedCategory
                  ? 'bg-primary text-white font-medium shadow-sm'
                  : 'text-text-main hover:bg-surface-warm hover:text-primary'
              }`}
            >
              <span>All Products</span>
              {!selectedCategory && <Check className="w-4 h-4" />}
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const count = cat._count?.products;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(isSelected ? undefined : cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                    isSelected
                      ? 'bg-primary text-white font-medium shadow-sm'
                      : 'text-text-main hover:bg-surface-warm hover:text-primary'
                  }`}
                >
                  <span className="truncate pr-2">{cat.name}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {count !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-surface-warm text-text-muted'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Price Range Filter */}
      <div className="space-y-3 pt-2 border-t border-border-subtle">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Price Range (INR)
        </h3>

        {/* Quick Presets */}
        <div className="flex flex-col gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const isPresetActive =
              preset.min === minPrice && preset.max === maxPrice;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.min, preset.max)}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                  isPresetActive
                    ? 'bg-blush-soft text-primary font-bold border border-blush'
                    : 'text-text-main hover:bg-surface-warm'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Inputs */}
        <form onSubmit={handleApplyCustomPrice} className="space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="filter-min-price"
                className="block text-[11px] font-medium text-text-muted mb-1"
              >
                Min (₹)
              </label>
              <input
                id="filter-min-price"
                type="number"
                min="0"
                step="50"
                placeholder="₹ 0"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border-subtle bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="filter-max-price"
                className="block text-[11px] font-medium text-text-muted mb-1"
              >
                Max (₹)
              </label>
              <input
                id="filter-max-price"
                type="number"
                min="0"
                step="50"
                placeholder="₹ 3,000"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border-subtle bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-1.5 rounded-lg bg-surface-warm hover:bg-primary text-text-main hover:text-white border border-border-subtle hover:border-primary text-xs font-semibold uppercase tracking-wider transition-all"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* 3. Availability Filter (In-Stock Toggle) */}
      <div className="pt-2 border-t border-border-subtle">
        <label
          htmlFor="filter-in-stock"
          className="flex items-center justify-between cursor-pointer py-1 select-none"
        >
          <div>
            <span className="text-sm font-medium text-text-main block">
              In Stock Only
            </span>
            <span className="text-[11px] text-text-muted block">
              Exclude sold-out creations
            </span>
          </div>
          <input
            id="filter-in-stock"
            type="checkbox"
            checked={Boolean(inStock)}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-border-subtle cursor-pointer accent-primary"
          />
        </label>
      </div>
    </div>
  );
}
