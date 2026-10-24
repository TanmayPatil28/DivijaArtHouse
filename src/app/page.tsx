import React from 'react';
import { getFeaturedProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getHomepageSections } from '@/lib/homepage-sections';
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

  // Fetch customizable section order and visibility from persistent atelier config
  const sections = getHomepageSections();
  const enabledSections = sections.filter((s) => s.isEnabled);

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero_carousel':
        return <HeroCarouselShowcase key="hero_carousel" />;
      case 'hero':
        return <Hero key="hero" />;
      case 'value_props':
        return <ValueProps key="value_props" />;
      case 'collection_reel':
        return <CollectionReel key="collection_reel" categories={categories} />;
      case 'bestsellers':
        return <BestsellersGrid key="bestsellers" products={featuredProducts} />;
      case 'occasions':
        return <OccasionSection key="occasions" />;
      case 'featured_collection':
        return <FeaturedCollection key="featured_collection" />;
      case 'brand_story':
        return <BrandStory key="brand_story" />;
      case 'testimonials':
        return <Testimonials key="testimonials" />;
      case 'newsletter':
        return <NewsletterSection key="newsletter" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {enabledSections.map((sec) => renderSection(sec.key))}
    </div>
  );
}
