import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Sparkles, MapPin, Feather, Gift, Clock } from 'lucide-react';

const CRAFT_PILLARS = [
  {
    number: '01',
    title: 'Stitch by Stitch, Made Slowly',
    desc: 'With yarn, hooks, patience, and an eye for the little details, each floral design is sculpted one stitch at a time. No machines, no shortcuts.',
    icon: Feather,
  },
  {
    number: '02',
    title: 'Personal Gifting from the Heart',
    desc: 'From quiet thank-yous to golden milestone anniversaries, our pieces celebrate the people who make life special with thoughtful keepsake message cards.',
    icon: Gift,
  },
  {
    number: '03',
    title: 'Beauty That Stays Forever',
    desc: 'Unlike fresh flowers, crochet blooms never wilt, need zero water, and stay blooming on bedside tables and desks as lasting reminders of love.',
    icon: Clock,
  },
];

export function BrandStory() {
  return (
    <section
      aria-label="Our Artisan Story"
      className="py-16 md:py-24 bg-white border-b border-gold/30 relative overflow-hidden shadow-[0_4px_24px_-10px_rgba(46,23,21,0.06)]"
    >
      {/* Ambient Champagne Glow */}
      <div 
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(197,154,90,0.07),transparent_70%)] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Layered Atelier Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/5]">
              {/* Arched Architectural Craft Frame */}
              <div className="relative w-full h-full rounded-t-[36px] sm:rounded-t-[44px] rounded-b-2xl overflow-hidden border border-gold/40 shadow-2xl bg-gradient-to-b from-[#FAF5F0] via-white to-[#F7ECEE] group">
                <img
                  src="/images/products/blushing-peony-rose-1.svg"
                  alt="Blushing Peony and Rose Handcrafted Artisan Bouquet"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Inner White Rim Inset */}
                <div className="absolute inset-0 rounded-t-[36px] sm:rounded-t-[44px] rounded-b-2xl border border-white/40 pointer-events-none" />
              </div>

              {/* Floating Top Badge: Pune Studio Atelier */}
              <div className="absolute -top-3.5 left-4 sm:left-6 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-gold/40 shadow-md flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-text-main z-20">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Hadapsar, Pune • Studio Atelier</span>
              </div>

              {/* Overlapping Studio Craft Seal Card at Bottom */}
              <div className="absolute -bottom-6 left-3 right-3 sm:-bottom-7 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-gold/40 shadow-2xl flex items-center gap-3.5 z-20">
                <div className="w-11 h-11 rounded-full bg-blush-soft border border-gold/30 flex items-center justify-center flex-shrink-0 text-primary shadow-xs">
                  <Heart className="w-5 h-5 fill-primary text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-[13px] font-bold text-text-main leading-tight">
                    100% Handcrafted by Women Artisans
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                    Shaping dignified creative livelihoods with authentic crochet heritage in India.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & 3 Craft Story Pillars */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            {/* Atelier Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-canvas border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>A LITTLE ABOUT US • THE DIVIJA STORY</span>
            </div>

            {/* Editorial Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-main leading-[1.14] tracking-tight">
              Made by hand.{' '}
              <span className="font-serif italic font-normal text-primary inline-block">
                Chosen with heart.
              </span>
            </h2>

            {/* Poetic Lead Statement */}
            <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Some gifts are beautiful in the moment. Others become part of the story you keep telling. DivijaArtHouse is built around a simple idea: a thoughtful gift should mean something long after the occasion has passed.
            </p>

            {/* 3 Digestible Craft Story Pillars */}
            <div className="space-y-3 pt-1 text-left">
              {CRAFT_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.number}
                    className="group/pillar p-3 sm:p-3.5 rounded-2xl bg-surface-canvas/70 border border-gold/25 hover:border-gold hover:bg-white hover:shadow-md transition-all duration-300 flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-gold/40 flex items-center justify-center text-primary shrink-0 shadow-2xs group-hover/pillar:scale-105 transition-transform">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                          {pillar.number}
                        </span>
                        <h3 className="font-semibold text-xs sm:text-sm text-text-main group-hover/pillar:text-primary transition-colors">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signature Brand Quote Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blush-soft/50 border border-gold/30 text-xs sm:text-sm text-text-main font-medium italic">
              <span className="text-primary font-serif not-italic">“</span>
              <span>Little Blooms, Lasting Feelings.</span>
              <span className="text-primary font-serif not-italic">”</span>
              <span className="text-gold not-italic">•</span>
              <span className="not-italic text-[11px] font-semibold text-primary uppercase tracking-wider">
                Divija Art House
              </span>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <span>Discover Our Collections</span>
                <ArrowRight className="w-4 h-4 text-gold-light" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
