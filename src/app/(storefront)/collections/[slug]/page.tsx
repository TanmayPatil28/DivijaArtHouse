import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Home, Sparkles } from 'lucide-react';
import { getCategoryBySlug, getCategories } from '@/lib/categories';
import { getProducts } from '@/lib/products';
import { CatalogContainer } from '@/components/catalog/CatalogContainer';

export const dynamic = 'force-dynamic';

interface CollectionPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    minPrice?: string; // in INR
    maxPrice?: string; // in INR
    inStock?: string;
    sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
    q?: string;
    page?: string;
  };
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Collection Not Found | DivijaArtHouse',
      description: 'The requested handcrafted floral collection could not be found.',
    };
  }

  return {
    title: `${category.name} | DivijaArtHouse Handcrafted Everlasting Florals`,
    description:
      category.description ||
      `Explore our artisan collection of handcrafted crochet ${category.name.toLowerCase()} designed to bloom forever.`,
    openGraph: {
      title: `${category.name} - Everlasting Handcrafted Florals | DivijaArtHouse`,
      description:
        category.description ||
        `Explore handcrafted crochet ${category.name.toLowerCase()} at DivijaArtHouse.`,
      images: category.image ? [{ url: category.image }] : undefined,
      type: 'website',
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  // Fetch category first
  const category = await getCategoryBySlug(params.slug);

  // Requirement: 404 notFound() if category slug does not exist
  if (!category) {
    notFound();
  }

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

  // Fetch products pre-filtered for this category and all categories for metadata
  const [paginatedData, allCategories] = await Promise.all([
    getProducts({
      category: category.slug,
      minPrice: minPricePaise,
      maxPrice: maxPricePaise,
      inStock: inStockBool,
      sort: searchParams.sort || 'featured',
      q: searchParams.q,
      page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
      limit: 50,
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
            <Link
              href="/shop"
              className="hover:text-primary transition-colors"
            >
              Shop All
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-border-subtle" />
            <span className="text-primary font-semibold">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Hero Banner */}
      <div className="bg-gradient-to-r from-surface-warm via-blush-soft/40 to-surface-warm border-b border-border-subtle py-10 sm:py-14 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {category.image && (
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white border-2 border-blush shadow-md flex-shrink-0 p-3">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  priority
                  className="object-contain p-2"
                />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 text-primary border border-blush shadow-2xs">
                <Sparkles className="w-3 h-3" />
                <span>Handcrafted Collection</span>
              </div>
              <h1 className="font-semibold text-3xl sm:text-4xl tracking-tight text-text-main">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pre-filtered Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CatalogContainer
          products={paginatedData.products}
          total={paginatedData.total}
          categories={allCategories}
          currentParams={{
            category: category.slug,
            minPrice: minPriceINR,
            maxPrice: maxPriceINR,
            inStock: inStockBool,
            sort: searchParams.sort || 'featured',
            q: searchParams.q,
          }}
          isCategoryLocked={true}
          basePath={`/collections/${category.slug}`}
        />
      </div>
    </div>
  );
}

