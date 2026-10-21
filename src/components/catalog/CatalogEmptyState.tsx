'use client';

import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface CatalogEmptyStateProps {
  onClearFilters: () => void;
  hasFilters: boolean;
}

export function CatalogEmptyState({
  onClearFilters,
  hasFilters,
}: CatalogEmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center bg-surface-warm/60 rounded-3xl border border-dashed border-border-subtle my-6 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-blush-soft flex items-center justify-center text-primary mb-4 shadow-sm">
        <Sparkles className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="font-display font-bold text-xl sm:text-2xl text-text-main mb-2">
        No Blooms Found Matching Your Criteria
      </h3>

      <p className="text-sm text-text-muted max-w-md mb-6 leading-relaxed">
        {hasFilters
          ? 'We couldn’t find any handcrafted floral creations matching your current filter selection. Try adjusting your search or clearing filters to see all available blossoms.'
          : 'Our artisan floral garden is currently being replenished. Please check back shortly for new handcrafted collections.'}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All Filters</span>
        </button>
      )}
    </div>
  );
}
