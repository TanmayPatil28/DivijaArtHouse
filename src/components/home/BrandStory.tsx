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
                  unoptimized
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
              <span>A LITTLE ABOUT US</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text-main leading-tight tracking-tight">
              Made by hand. Chosen with heart.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
              <p className="text-text-main font-medium">
                Some gifts are beautiful in the moment. Others become part of the story you keep telling.
              </p>
              <p>
                DivijaArtHouse is built around a simple idea: a thoughtful gift should mean something long after the occasion has passed.
              </p>
              <p>
                We love the feeling of giving flowers—the surprise, the smile, the little pause when someone realises you&apos;ve thought of them. We wanted to create a different kind of floral gift: one that could sit on a desk, brighten a shelf, or bring back a memory every time someone looked at it.
              </p>
              <p>
                That&apos;s where crochet florals come in. With yarn, hooks, patience, and an eye for the little details, each design takes shape one stitch at a time. From delicate bouquets to cheerful potted blooms and playful keepsakes, our collection is made for people who believe the smallest gestures can carry the biggest feelings.
              </p>
              <p>
                Whether you&apos;re celebrating someone you love or treating yourself to something lovely, we hope you find a piece that feels just right. Because sometimes, the most meaningful gifts aren&apos;t about how much you spend. They&apos;re about how well you know someone.
              </p>
            </div>

            <div className="pt-1 border-l-2 border-primary/40 pl-4 italic text-sm text-text-main font-medium">
              &ldquo;Little Blooms, Lasting Feelings.&rdquo; — DivijaArtHouse
            </div>

            {/* Ethos Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-text-main">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Thoughtful by design — made to be kept</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Handmade character in every stitch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Personal gifting & keepsake message cards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>No water needed — enjoyed again and again</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
              >
                <span>Discover Our Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
