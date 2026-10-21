import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import { parseJson } from '@/lib/utils';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductDetails } from '@/components/product/ProductDetails';
import { RelatedProductsShelf } from '@/components/product/RelatedProductsShelf';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | DivijaArtHouse',
      description: 'The requested handcrafted crochet creation could not be found.',
    };
  }

  const images = parseJson<string[]>(product.images, []);
  const mainImage = images[0] || '/images/products/blushing-peony-rose-1.svg';

  return {
    title: `${product.name} | DivijaArtHouse Handcrafted Everlasting Florals`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | DivijaArtHouse`,
      description: product.description.slice(0, 160),
      images: [
        {
          url: mainImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch product from database
  const product = await getProductBySlug(params.slug);

  // Requirement: Proper Next.js 404 handling via notFound() for missing/invalid slugs
  if (!product) {
    notFound();
  }

  // Fetch related recommendation shelf products
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categoryId,
    product.tags,
    4
  );

  return (
    <div className="w-full bg-canvas min-h-screen pb-16">
      {/* Breadcrumbs Navigation */}
      <div className="border-b border-border-subtle bg-surface-warm/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center space-x-2 text-xs text-text-muted overflow-x-auto whitespace-nowrap scrollbar-none"
          >
            <Link
              href="/"
              className="flex items-center hover:text-primary transition-colors flex-shrink-0"
            >
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-border-subtle flex-shrink-0" />
            <Link
              href="/shop"
              className="hover:text-primary transition-colors flex-shrink-0"
            >
              Shop All
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-border-subtle flex-shrink-0" />
                <Link
                  href={`/collections/${product.category.slug}`}
                  className="hover:text-primary transition-colors flex-shrink-0"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-border-subtle flex-shrink-0" />
            <span className="text-text-main font-semibold truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main PDP Grid: Gallery on left, Details on right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery (5 cols on lg) */}
          <div className="lg:col-span-6 w-full lg:sticky lg:top-24">
            <ProductGallery product={product} />
          </div>

          {/* Right Column: Product Details, Options, & Actions (7 cols on lg) */}
          <div className="lg:col-span-6 w-full">
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Related Products Recommendation Shelf */}
        <RelatedProductsShelf products={relatedProducts} />
      </div>
    </div>
  );
}
