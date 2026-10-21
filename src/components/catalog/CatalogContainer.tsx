'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import type { ProductWithCategory, CategoryWithProducts } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { CatalogFilterSidebar } from './CatalogFilterSidebar';
import { CatalogToolbar } from './CatalogToolbar';
import { ActiveFilterChips } from './ActiveFilterChips';
import { CatalogEmptyState } from './CatalogEmptyState';

interface CatalogContainerProps {
  products: ProductWithCategory[];
  total: number;
  categories: CategoryWithProducts[];
  currentParams: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
    q?: string;
  };
  isCategoryLocked?: boolean;
  basePath?: string;
}

export function CatalogContainer({
  products,
  total,
  categories,
  currentParams,
  isCategoryLocked = false,
  basePath = '/shop',
}: CatalogContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Helper to build URL query string and sync route
  const updateUrl = (updates: Partial<typeof currentParams>) => {
    const nextParams = { ...currentParams, ...updates };
    const query = new URLSearchParams();

    if (!isCategoryLocked && nextParams.category) {
      query.set('category', nextParams.category);
    }
    if (nextParams.minPrice !== undefined && !isNaN(nextParams.minPrice)) {
      query.set('minPrice', String(nextParams.minPrice));
    }
    if (nextParams.maxPrice !== undefined && !isNaN(nextParams.maxPrice)) {
      query.set('maxPrice', String(nextParams.maxPrice));
    }
    if (nextParams.inStock) {
      query.set('inStock', 'true');
    }
    if (nextParams.sort && nextParams.sort !== 'featured') {
      query.set('sort', nextParams.sort);
    }
    if (nextParams.q && nextParams.q.trim()) {
      query.set('q', nextParams.q.trim());
    }

    const queryString = query.toString();
    const targetUrl = queryString ? `${basePath}?${queryString}` : basePath;

    startTransition(() => {
      router.replace(targetUrl, { scroll: false });
    });
  };

  // Handlers for filter controls
  const handleCategoryChange = (categorySlug: string | undefined) => {
    updateUrl({ category: categorySlug });
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    updateUrl({ minPrice: min, maxPrice: max });
  };

  const handleInStockChange = (inStock: boolean) => {
    updateUrl({ inStock: inStock ? true : undefined });
  };

  const handleSortChange = (
    sort: 'featured' | 'price_asc' | 'price_desc' | 'newest'
  ) => {
    updateUrl({ sort });
  };

  const handleSearchChange = (q: string) => {
    updateUrl({ q });
  };

  const handleClearAll = () => {
    updateUrl({
      category: isCategoryLocked ? currentParams.category : undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      q: undefined,
      sort: 'featured',
    });
  };

  // Compute active filters count
  let activeFilterCount = 0;
  if (!isCategoryLocked && currentParams.category) activeFilterCount++;
  if (currentParams.minPrice !== undefined || currentParams.maxPrice !== undefined)
    activeFilterCount++;
  if (currentParams.inStock) activeFilterCount++;
  if (currentParams.q && currentParams.q.trim()) activeFilterCount++;

  const hasAnyFilters = activeFilterCount > 0;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 bg-white p-6 rounded-2xl border border-border-subtle shadow-xs sticky top-24">
          <CatalogFilterSidebar
            categories={categories}
            selectedCategory={currentParams.category}
            minPrice={currentParams.minPrice}
            maxPrice={currentParams.maxPrice}
            inStock={currentParams.inStock}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onInStockChange={handleInStockChange}
            onResetAll={handleClearAll}
            isCategoryLocked={isCategoryLocked}
          />
        </aside>

        {/* Main Product Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Catalog Toolbar */}
          <CatalogToolbar
            totalCount={total}
            searchQuery={currentParams.q || ''}
            onSearchChange={handleSearchChange}
            sortValue={currentParams.sort || 'featured'}
            onSortChange={handleSortChange}
            onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {/* Active Filter Chips */}
          <ActiveFilterChips
            categories={categories}
            selectedCategory={currentParams.category}
            minPrice={currentParams.minPrice}
            maxPrice={currentParams.maxPrice}
            inStock={currentParams.inStock}
            searchQuery={currentParams.q}
            onRemoveCategory={() => handleCategoryChange(undefined)}
            onRemovePrice={() => handlePriceChange(undefined, undefined)}
            onRemoveInStock={() => handleInStockChange(false)}
            onRemoveSearch={() => handleSearchChange('')}
            onClearAll={handleClearAll}
            isCategoryLocked={isCategoryLocked}
          />

          {/* Product Grid or Empty State with Pending Opacity */}
          <div
            className={`transition-opacity duration-200 mt-4 ${
              isPending ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={idx < 4}
                  />
                ))}
              </div>
            ) : (
              <CatalogEmptyState
                onClearFilters={handleClearAll}
                hasFilters={hasAnyFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-Out Drawer */}
      {isMobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter catalog products" data-lenis-prevent
          className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            className="w-full max-w-xs sm:max-w-sm bg-white h-full ml-auto shadow-2xl flex flex-col overflow-hidden animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-warm">
              <span className="font-semibold tracking-tight text-lg text-text-main">
                Filters & Refinements
              </span>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-full text-text-muted hover:text-text-main hover:bg-white"
                aria-label="Close filters drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6" data-lenis-prevent>
              <CatalogFilterSidebar
                categories={categories}
                selectedCategory={currentParams.category}
                minPrice={currentParams.minPrice}
                maxPrice={currentParams.maxPrice}
                inStock={currentParams.inStock}
                onCategoryChange={(cat) => {
                  handleCategoryChange(cat);
                }}
                onPriceChange={(min, max) => {
                  handlePriceChange(min, max);
                }}
                onInStockChange={(stock) => {
                  handleInStockChange(stock);
                }}
                onResetAll={handleClearAll}
                isCategoryLocked={isCategoryLocked}
              />
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-border-subtle bg-white flex gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-full border border-border-subtle text-xs font-semibold uppercase tracking-wider text-text-main hover:bg-surface-warm transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                View ({total})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
