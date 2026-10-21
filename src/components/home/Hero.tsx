import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShoppingBag, Heart } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-warm via-blush-soft/30 to-white py-12 md:py-20 lg:py-24 border-b border-border-subtle">
      {/* Decorative background glow circles */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[600px] bg-blush-soft/50 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 right-0 -z-10 w-80 h-80 bg-blush/30 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Copy & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Brand Direction Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush-soft border border-blush text-primary text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Handcrafted Cotton Yarn Florals</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-main leading-[1.15] tracking-tight">
              Flowers That Keep Your Moments{' '}
              <span className="text-primary italic font-serif">Blooming</span>
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl font-serif italic text-primary">
              &ldquo;Little Blooms, Lasting Feelings.&rdquo;
            </p>

            {/* Subtitle / Value description */}
            <p className="text-sm sm:text-base md:text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Real flowers wither in days, but genuine feelings shouldn&apos;t.
              Discover handcrafted everlasting crochet bouquets, desk-friendly
              flower pots, and bespoke gift hampers lovingly stitched to preserve
              your warmest memories forever.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop?sort=featured"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-surface-warm border border-border-subtle text-text-main hover:text-primary text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm hover:border-blush active:scale-[0.98]"
              >
                <span>Explore Bestsellers</span>
              </Link>
            </div>

            {/* Trust Mini Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Never withers or fades
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Handcrafted by Indian artisans
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Free shipping over ₹999
              </span>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-square rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-surface-warm via-white to-blush-soft border border-border-subtle shadow-xl flex flex-col items-center justify-center">
              {/* Product Spotlight Image */}
              <div className="relative w-full h-full max-h-72 sm:max-h-80 drop-shadow-md transition-transform duration-500 hover:scale-105">
                <Image
                  src="/images/products/royal-sovereign-jumbo-1.svg"
                  alt="Royal Sovereign Jumbo Handcrafted Crochet Bouquet"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Floating Badge 1: Artisan Note */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border-subtle shadow-sm flex items-center gap-1.5 text-[11px] font-medium text-text-main">
                <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                <span>Pure Cotton Yarn</span>
              </div>

              {/* Floating Badge 2: Everlasting Guarantee */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border-subtle shadow-sm flex items-center gap-1.5 text-[11px] font-medium text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold">Lasts a Lifetime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
