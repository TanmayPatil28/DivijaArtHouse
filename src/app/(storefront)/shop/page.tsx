import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { CatalogContainer } from '@/components/catalog/CatalogContainer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop All Handcrafted Crochet Flowers & Gifts | DivijaArtHouse',
  description:
    'Explore our complete collection of everlasting crochet flower bouquets, blooming desk pots, artisanal gift hampers, and handcrafted hair accessories. Designed to bloom forever.',
  openGraph: {
    title: 'Everlasting Crochet Floral Catalog | DivijaArtHouse',
    description:
      'Discover handcrafted crochet bouquets, flower pots, and bespoke gift boxes made with love and lasting feelings.',
    type: 'website',
  },
};

interface ShopPageProps {
  searchParams: {
    category?: string;
    minPrice?: string; // in INR
    maxPrice?: string; // in INR
    inStock?: string;
    sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
    q?: string;
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Parse INR price inputs into integer paise for backend query
  const minPriceINR = searchParams.minPrice
    ? parseInt(searchParams.minPrice, 10)
    : undefined;
  const maxPriceINR = searchParams.maxPrice
    ? parseInt(searchParams.maxPrice, 10)
    : undefined;

  const minPricePaise =
    minPriceINR !== undefined && !isNaN(minPriceINR)
      ? minPriceINR * 100
      : undefined;
  const maxPricePaise =
    maxPriceINR !== undefined && !isNaN(maxPriceINR)
      ? maxPriceINR * 100
      : undefined;

  const inStockBool = searchParams.inStock === 'true';

  // Fetch products and categories in parallel
  const [paginatedData, categories] = await Promise.all([
    getProducts({
      category: searchParams.category,
      minPrice: minPricePaise,
      maxPrice: maxPricePaise,
      inStock: inStockBool,
      sort: searchParams.sort || 'featured',
      q: searchParams.q,
      page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
      limit: 50, // Display all items cleanly
    }),
    getCategories({ activeOnly: true, includeProductsCount: true }),
  ]);

  return (
    <div className="w-full bg-canvas min-h-screen pb-16">
      {/* Breadcrumb Header Bar */}
      <div className="border-b border-border-subtle bg-surface-warm/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center space-x-2 text-xs text-text-muted"
          >
            <Link
              href="/"
              className="flex items-center hover:text-primary transition-colors"
            >
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
            <span className="text-text-main font-semibold">Shop All</span>
            {searchParams.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
                <span className="text-primary font-semibold capitalize">
                  {searchParams.category.replace(/-/g, ' ')}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Catalog Title Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-main">
          Handcrafted Everlasting Bloom Catalog
        </h1>
        <p className="text-sm sm:text-base text-text-muted mt-2 max-w-2xl leading-relaxed">
          Every petal, bud, and stem is individually hand-stitched by skilled artisans using premium milk cotton yarn. Discover everlasting florals designed to preserve your most treasured moments.
        </p>
      </div>

      {/* Interactive Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CatalogContainer
          products={paginatedData.products}
          total={paginatedData.total}
          categories={categories}
          currentParams={{
            category: searchParams.category,
            minPrice: minPriceINR,
            maxPrice: maxPriceINR,
            inStock: inStockBool,
            sort: searchParams.sort || 'featured',
            q: searchParams.q,
          }}
          isCategoryLocked={false}
          basePath="/shop"
        />
      </div>
    </div>
  );
}
