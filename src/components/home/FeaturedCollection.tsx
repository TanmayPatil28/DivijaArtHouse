import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Award, ShieldCheck, Heart } from 'lucide-react';

export function FeaturedCollection() {
  return (
    <section
      aria-label="Featured Collection Spotlight"
      className="py-12 md:py-20 bg-gradient-to-br from-surface-warm via-blush-soft/20 to-surface-banner border-b border-border-subtle overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-border-subtle shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 bg-gradient-to-br from-surface-warm to-blush-soft/50 p-6 sm:p-12 flex items-center justify-center relative min-h-[340px] sm:min-h-[440px]">
              {/* Product Visual */}
              <div className="relative w-full h-72 sm:h-96 drop-shadow-xl transition-transform duration-500 hover:scale-105">
                <img
                  src="/images/products/celestial-twilight-jumbo-1.svg"
                  alt="Celestial Twilight Jumbo Handcrafted Crochet Bouquet"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Artisan Seal Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-gold/40 shadow-sm flex items-center gap-1.5 text-xs font-semibold text-text-main">
                <Award className="w-4 h-4 text-gold" />
                <span>Master Artisan Series</span>
              </div>

              {/* Stem Count Pill */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold border border-gold/40 shadow-md">
                24 Everlasting Stems
              </div>
            </div>

            {/* Editorial Content Column */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>MADE FOR THE BIG MOMENTS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-text-main leading-tight">
                When a little bouquet isn&apos;t enough.
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-text-muted leading-relaxed">
                <p className="text-text-main font-medium">
                  Some moments call for something extra special.
                </p>
                <p>
                  Our jumbo crochet bouquets bring together statement-making size, intricate details, and handcrafted floral textures. Designed to take centre stage, they&apos;re made for milestone celebrations, meaningful surprises, and the people you want to make feel truly seen.
                </p>
              </div>

              {/* Quality Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-text-main">
                    A statement arrangement featuring 24 individual stems.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-text-main">
                    Fine cotton yarn, subject to materials used in the selected design.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-text-main">
                    A keepsake presentation box, where included with the product.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-text-main">
                    An artisan certificate, where included with the product.
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/collections/jumbo-bouquets"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  <span>Explore Jumbo Bouquets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/collections/bouquets"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-surface-warm border border-border-subtle text-text-main hover:text-primary text-sm font-semibold transition-colors shadow-xs hover:border-gold/40"
                >
                  <span>Find Your Perfect Bouquet</span>
                </Link>
              </div>

              <p className="text-xs text-text-muted pt-1">
                A memorable gift, chosen with care and made to be enjoyed long after the celebration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
