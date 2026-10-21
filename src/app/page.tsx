import React from 'react';
import { getFeaturedProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { Hero } from '@/components/home/Hero';
import { HeroCarouselShowcase } from '@/components/home/HeroCarouselShowcase';
import { ValueProps } from '@/components/home/ValueProps';
import { CollectionReel } from '@/components/home/CollectionReel';
import { BestsellersGrid } from '@/components/home/BestsellersGrid';
import { OccasionSection } from '@/components/home/OccasionSection';
import { FeaturedCollection } from '@/components/home/FeaturedCollection';
import { BrandStory } from '@/components/home/BrandStory';
import { Testimonials } from '@/components/home/Testimonials';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export const revalidate = 60; // Revalidate every minute for ISR

export default async function HomePage() {
  // Fetch data in parallel on the server
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories({ activeOnly: true, includeProductsCount: true }),
  ]);

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* 1. Apple-style Featured Carousel Showcase (very top of hero section) */}
      <HeroCarouselShowcase />

      {/* 2. Editorial Hero section */}
      <Hero />

      {/* 3. Trust / Value props strip */}
      <ValueProps />

      {/* 4. Shop by Collection (category reel with circular thumbnails) */}
      <CollectionReel categories={categories} />

      {/* 5. Bestsellers grid (data-driven product cards) */}
      <BestsellersGrid products={featuredProducts} />

      {/* 6. Shop by Occasion */}
      <OccasionSection />

      {/* 7. Featured Collection (editorial spotlight) */}
      <FeaturedCollection />

      {/* 8. Brand Story */}
      <BrandStory />

      {/* 9. Customer Testimonials */}
      <Testimonials />

      {/* 10. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
}
