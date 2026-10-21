import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function BrandStory() {
  return (
    <section
      aria-label="Our Artisan Story"
      className="py-12 md:py-20 bg-white border-b border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual Side */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[4/5] sm:aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-surface-warm via-white to-blush-soft border border-border-subtle shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center">
              <div className="relative w-full h-full max-h-72 sm:max-h-80 transition-transform duration-500 hover:scale-105">
                <Image
                  src="/images/products/blushing-peony-rose-1.svg"
                  alt="Artisanal Handcrafted Crochet Peony Bloom"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Artisan Note Tag */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-border-subtle shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blush-soft flex items-center justify-center flex-shrink-0 text-primary">
                  <Heart className="w-5 h-5 fill-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-main">
                    100% Hand-Stitched by Indian Artisans
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Empowering women crafters with dignified creative livelihood.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Narrative Side */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The DivijaArtHouse Ethos</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-main leading-tight">
              Crafted with Intention,{' '}
              <span className="italic font-serif text-primary">
                Cherished for a Lifetime
              </span>
            </h2>

            <p className="text-base sm:text-lg font-serif italic text-primary">
              &ldquo;Little Blooms, Lasting Feelings.&rdquo;
            </p>

            <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
              <p>
                DivijaArtHouse was founded on a simple observation: the flowers we
                give to mark our happiest moments usually wilt within days, but the
                sentiments behind them deserve to be preserved forever.
              </p>
              <p>
                Starting from a quiet sunlit worktable with spools of soft combed
                cotton yarn and crochet hooks, we set out to reimagine floral
                gifting in India. Every delicate petal, winding vine, and whimsical
                desk pot is patiently brought to life stitch-by-stitch by skilled
                women artisans.
              </p>
              <p>
                When you share a Divija creation, you are not simply gifting
                flowers — you are gifting hours of human devotion, sustainable
                artistry, and memories that stay vibrant season after season.
              </p>
            </div>

            {/* Ethos Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-text-main">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Zero waste & 100% biodegradable cotton</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Fair-wage artisan community support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Custom gift packaging & handwritten cards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>No wilting, shedding, or seasonal allergy pollen</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
