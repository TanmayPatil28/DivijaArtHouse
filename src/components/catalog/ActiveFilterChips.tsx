'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import type { CategoryWithProducts } from '@/types';

interface ActiveFilterChipsProps {
  categories: CategoryWithProducts[];
  selectedCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchQuery?: string;
  onRemoveCategory: () => void;
  onRemovePrice: () => void;
  onRemoveInStock: () => void;
  onRemoveSearch: () => void;
  onClearAll: () => void;
  isCategoryLocked?: boolean;
}

export function ActiveFilterChips({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  inStock,
  searchQuery,
  onRemoveCategory,
  onRemovePrice,
  onRemoveInStock,
  onRemoveSearch,
  onClearAll,
  isCategoryLocked = false,
}: ActiveFilterChipsProps) {
  const chips: Array<{
    id: string;
    label: string;
    onRemove: () => void;
  }> = [];

  // Search chip
  if (searchQuery && searchQuery.trim()) {
    chips.push({
      id: 'search',
      label: `Search: "${searchQuery}"`,
      onRemove: onRemoveSearch,
    });
  }

  // Category chip (only if not locked to collection page)
  if (!isCategoryLocked && selectedCategory) {
    const categoryName =
      categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory;
    chips.push({
      id: 'category',
      label: `Category: ${categoryName}`,
      onRemove: onRemoveCategory,
    });
  }

  // Price chip
  if (minPrice !== undefined || maxPrice !== undefined) {
    let priceLabel = 'Price: ';
    if (minPrice !== undefined && maxPrice !== undefined) {
      priceLabel += `₹${minPrice} - ₹${maxPrice}`;
    } else if (minPrice !== undefined) {
      priceLabel += `Over ₹${minPrice}`;
    } else if (maxPrice !== undefined) {
      priceLabel += `Under ₹${maxPrice}`;
    }
    chips.push({
      id: 'price',
      label: priceLabel,
      onRemove: onRemovePrice,
    });
  }

  // In-stock chip
  if (inStock) {
    chips.push({
      id: 'inStock',
      label: 'In Stock Only',
      onRemove: onRemoveInStock,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blush-soft text-primary border border-blush shadow-xs animate-fade-in"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="p-0.5 rounded-full hover:bg-primary hover:text-white transition-colors"
            aria-label={`Remove filter: ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-primary transition-colors ml-1 px-2 py-1"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear all</span>
      </button>
    </div>
  );
}
