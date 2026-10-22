import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Award, ShieldCheck, Heart } from 'lucide-react';

export function FeaturedCollection() {
  return (
    <section
      aria-label="Featured Collection Spotlight"
      className="py-16 md:py-24 bg-[#FAF5F0] border-b border-gold/30 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Deep Velvet Wine Atelier Container */}
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#5E1420] via-[#781D2C] to-[#4E0E18] border border-gold/40 shadow-2xl p-6 sm:p-10 lg:p-14 overflow-hidden">
          {/* Champagne Gold Ambient Light Elements */}
          <div 
            className="absolute -top-24 -right-24 w-96 h-96 bg-[radial-gradient(circle,rgba(197,154,90,0.22),transparent_70%)] pointer-events-none blur-3xl" 
            aria-hidden="true" 
          />
          <div 
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-[radial-gradient(circle,rgba(197,154,90,0.15),transparent_70%)] pointer-events-none blur-3xl" 
            aria-hidden="true" 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            {/* Visual Column: Layered Spotlight with Detail Stamp */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square">
                {/* Flagship Edge-to-Edge Frame */}
                <div className="relative w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-gold/40 shadow-2xl bg-gradient-to-b from-[#FAF5F0] via-white to-[#F7ECEE] group">
                  <img
                    src="/images/products/celestial-twilight-jumbo-1.svg"
                    alt="Celestial Twilight Jumbo Handcrafted Crochet Bouquet"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Inner Contour Inset */}
                  <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] border border-white/40 pointer-events-none" />
                </div>

                {/* Overlapping Detail Polaroid (Artisan Inspection) */}
                <div className="absolute -bottom-5 -left-3 sm:-bottom-6 sm:-left-5 w-32 sm:w-40 bg-white p-2 rounded-2xl shadow-2xl border border-gold/40 rotate-[-5deg] hover:rotate-0 transition-transform duration-300 z-20 group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-warm border border-border-subtle/60">
                    <img
                      src="/images/products/celestial-twilight-jumbo-2.svg"
                      alt="Artisan stitch inspection"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="pt-1.5 px-1 text-center">
                    <p className="text-[10px] sm:text-[11px] font-semibold text-text-main tracking-tight leading-tight">Artisan Inspection</p>
                    <p className="text-[9px] text-gold uppercase tracking-wider font-medium mt-0.5">Stem Stitch Detail</p>
                  </div>
                </div>

                {/* Floating Master Artisan Badge */}
                <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-gold/40 shadow-lg flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-text-main z-20 hover:scale-105 transition-transform">
                  <Award className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Master Artisan Series</span>
                </div>

                {/* Floating Stem Count Pill */}
                <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 px-3.5 py-1.5 rounded-full bg-gold text-[#2E1715] text-[11px] sm:text-xs font-bold border border-white/40 shadow-gold-soft z-20 hover:scale-105 transition-transform">
                  24 Everlasting Stems
                </div>
              </div>
            </div>

            {/* Editorial Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-gold/40 text-gold-light text-xs font-semibold uppercase tracking-widest shadow-2xs backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>MADE FOR THE BIG MOMENTS</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
                When a little bouquet{' '}
                <span className="font-serif italic font-normal text-gold inline-block">
                  isn&apos;t enough.
                </span>
              </h2>

              {/* Subtext */}
              <div className="space-y-2 text-sm sm:text-base text-[#FAF5F0]/85 leading-relaxed max-w-xl mx-auto lg:mx-0">
                <p className="text-white font-medium text-base sm:text-lg">
                  Some moments call for something extra special.
                </p>
                <p className="text-xs sm:text-sm text-[#F7ECEE]/80">
                  Our jumbo crochet bouquets bring together statement-making size, intricate details, and handcrafted floral textures. Designed to take centre stage, they&apos;re made for milestone celebrations, meaningful surprises, and the people you want to make feel truly seen.
                </p>
              </div>

              {/* 4 Frosted Feature Badges (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-gold/25 backdrop-blur-xs text-left">
                  <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-[#FAF5F0] leading-snug">
                    A statement arrangement featuring 24 individual stems.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-gold/25 backdrop-blur-xs text-left">
                  <Heart className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-[#FAF5F0] leading-snug">
                    Fine cotton yarn, subject to materials used in the selected design.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-gold/25 backdrop-blur-xs text-left">
                  <Award className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-[#FAF5F0] leading-snug">
                    A keepsake presentation box, where included with the product.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-gold/25 backdrop-blur-xs text-left">
                  <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-[#FAF5F0] leading-snug">
                    An artisan certificate, where included with the product.
                  </span>
                </div>
              </div>

              {/* Dual CTAs with Gold Radiance */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
                <Link
                  href="/collections/jumbo-bouquets"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gold hover:bg-gold-hover text-[#2E1715] text-sm font-semibold tracking-wide transition-all duration-300 shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore Jumbo Bouquets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/collections/bouquets"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-gold/40 text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-2xs hover:border-gold hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Find Your Perfect Bouquet</span>
                </Link>
              </div>

              {/* Footnote */}
              <p className="text-xs text-[#F7ECEE]/70 pt-1">
                A memorable gift, chosen with care and made to be enjoyed long after the celebration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
