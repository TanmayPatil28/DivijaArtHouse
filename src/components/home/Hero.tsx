'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Sparkles, Heart } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-warm-surface via-canvas to-canvas py-12 md:py-20 lg:py-24 border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Copy & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Brand Direction Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush-soft border border-blush text-primary text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HANDCRAFTED CROCHET FLORALS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-semibold text-text-main leading-[1.12] tracking-tight">
              Some feelings deserve to stay.
            </h1>

            {/* Value description paragraphs */}
            <div className="space-y-3 text-sm sm:text-base md:text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              <p>
                Fresh flowers are beautiful. But sometimes, you wish the moment they represent could last a little longer.
              </p>
              <p>
                Meet our handcrafted crochet flowers, thoughtful little keepsakes, and gift-ready creations—made to celebrate the people who make life special.
              </p>
              <p className="text-text-main font-medium">
                For birthdays, anniversaries, quiet thank-yous, and all the little moments that deserve to be remembered.
              </p>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Find Your Flowers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-surface-warm border border-border-subtle text-text-main hover:text-primary text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm hover:border-blush active:scale-[0.98]"
              >
                <span>Explore Our Story</span>
              </Link>
            </div>

            {/* Supporting Line */}
            <p className="pt-2 text-xs sm:text-sm text-text-muted font-normal">
              Handcrafted with care in India. Made to be kept, displayed, and cherished.
            </p>
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
                  unoptimized
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
