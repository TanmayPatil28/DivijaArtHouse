'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Award, ShieldCheck, Heart, Plus } from 'lucide-react';

const JUMBO_MASTERPIECES = [
  {
    id: 'royal-sovereign',
    shortName: 'The Royal Sovereign',
    name: 'The Royal Sovereign 24-Stem Jumbo Bouquet',
    price: '₹3,499',
    originalPrice: '₹4,499',
    image: '/images/products/royal-sovereign-jumbo-1.svg',
    slug: 'the-royal-sovereign-24-stem-jumbo-bouquet',
    tag: 'Flagship Crown',
    hotspots: [
      {
        id: 1,
        title: '24 Hand-Tied Stems',
        desc: 'Over 36 hours of master crochet forming an opulent 24-stem dome.',
        x: '50%',
        y: '28%',
      },
      {
        id: 2,
        title: '100% Fine Combed Cotton',
        desc: 'Artisan stitch definition with velvet-soft tactile petal texture.',
        x: '34%',
        y: '48%',
      },
      {
        id: 3,
        title: 'Keepsake Box & Certificate',
        desc: 'Luxury presentation case with wax-sealed authenticity certificate.',
        x: '62%',
        y: '72%',
      },
    ],
  },
  {
    id: 'celestial-twilight',
    shortName: 'Celestial Twilight',
    name: 'Celestial Twilight 24-Stem Jumbo Bouquet',
    price: '₹3,499',
    originalPrice: '₹4,499',
    image: '/images/products/celestial-twilight-jumbo-1.svg',
    slug: 'celestial-twilight-blossom-jumbo-bouquet',
    tag: 'Masterpiece Edition',
    hotspots: [
      {
        id: 1,
        title: '24 Sculpted Stems',
        desc: 'Multi-layer rosette blooms evoking starry twilight evenings.',
        x: '50%',
        y: '30%',
      },
      {
        id: 2,
        title: 'Tactile Petal Relief',
        desc: 'Handcrafted yarn loops that never wilt, fade, or lose shape.',
        x: '64%',
        y: '46%',
      },
      {
        id: 3,
        title: 'Artisan Master Wrap',
        desc: 'Sculpted kraft wrap tied with a hand-stitched velvet ribbon.',
        x: '38%',
        y: '74%',
      },
    ],
  },
];

export function FeaturedCollection() {
  const [activeId, setActiveId] = useState('royal-sovereign');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const current = JUMBO_MASTERPIECES.find((m) => m.id === activeId) || JUMBO_MASTERPIECES[0];

  return (
    <section
      aria-label="Featured Collection Spotlight"
      className="py-10 md:py-14 bg-[#FAF5F0] border-b border-gold/30 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Horizontal Atelier Suite Container */}
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#55111B] via-[#781D2C] to-[#450C15] border border-gold/40 shadow-2xl p-6 sm:p-8 lg:p-10 overflow-hidden">
          {/* Champagne Ambient Light */}
          <div 
            className="absolute top-0 right-1/4 w-80 h-80 bg-[radial-gradient(circle,rgba(197,154,90,0.18),transparent_70%)] pointer-events-none blur-3xl" 
            aria-hidden="true" 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left Column: Visual Frame with Embedded Switcher & Hotspots (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Embedded Flagship Switcher Bar */}
              <div className="inline-flex p-1 rounded-full bg-black/40 border border-gold/40 backdrop-blur-md mb-3 shadow-inner">
                {JUMBO_MASTERPIECES.map((item) => {
                  const isSelected = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveId(item.id);
                        setActiveHotspot(null);
                      }}
                      className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                        isSelected
                          ? 'bg-gold text-[#2E1715] shadow-gold-glow'
                          : 'text-[#FAF5F0]/80 hover:text-white'
                      }`}
                    >
                      <span>{item.shortName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Compact Pedestal Frame with Hotspot Pins */}
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square">
                <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-gold/40 shadow-xl bg-gradient-to-b from-white/15 via-[#FCF3F5]/10 to-black/20 p-1.5 backdrop-blur-xs group">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Floating Top Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-gold/40 text-[10px] font-semibold text-gold shadow-sm flex items-center gap-1">
                    <Award className="w-3 h-3 text-gold shrink-0" />
                    <span>{current.tag}</span>
                  </div>

                  {/* Floating Price Tag */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-gold text-[#2E1715] text-[11px] font-bold border border-white/40 shadow-gold-soft flex items-center gap-1">
                    <span>{current.price}</span>
                    <span className="text-[9px] line-through opacity-70 font-normal">{current.originalPrice}</span>
                  </div>
                </div>

                {/* Interactive Hotspot Pins */}
                {current.hotspots.map((spot) => {
                  const isOpen = activeHotspot === spot.id;

                  return (
                    <div
                      key={spot.id}
                      className="absolute z-20"
                      style={{ left: spot.x, top: spot.y }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveHotspot(isOpen ? null : spot.id)}
                        onMouseEnter={() => setActiveHotspot(spot.id)}
                        onMouseLeave={() => setActiveHotspot(null)}
                        className="relative -translate-x-1/2 -translate-y-1/2 group/pin focus:outline-none"
                        aria-label={spot.title}
                      >
                        <span className="absolute -inset-1 rounded-full bg-gold/50 animate-ping opacity-75" />
                        <span className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-[#2E1715] border-2 border-gold flex items-center justify-center font-bold text-xs shadow-gold-glow group-hover/pin:scale-110 transition-transform">
                          <Plus
                            className={`w-3 h-3 transition-transform duration-200 ${
                              isOpen ? 'rotate-45 text-primary' : 'text-[#2E1715]'
                            }`}
                          />
                        </span>
                      </button>

                      {/* Floating Tooltip */}
                      {isOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 w-48 sm:w-56 p-2.5 rounded-xl bg-[#2E1715]/95 backdrop-blur-md border border-gold/50 shadow-2xl text-left pointer-events-none z-30 animate-in fade-in zoom-in-95">
                          <div className="flex items-center gap-1 text-gold text-[9px] font-semibold uppercase tracking-wider mb-0.5">
                            <Sparkles className="w-2.5 h-2.5 shrink-0" />
                            <span>Craft Detail</span>
                          </div>
                          <p className="text-white text-xs font-semibold leading-tight mb-0.5">
                            {spot.title}
                          </p>
                          <p className="text-[#FAF5F0]/80 text-[10px] leading-relaxed">
                            {spot.desc}
                          </p>
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-[#2E1715] border-r border-b border-gold/50 rotate-45 -mt-1" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Editorial Copy, Badges & CTAs (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-gold/40 text-gold-light text-xs font-semibold uppercase tracking-widest shadow-2xs backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-gold shrink-0" />
                <span>MADE FOR THE BIG MOMENTS</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
                When a little bouquet{' '}
                <span className="font-serif italic font-normal text-gold inline-block">
                  isn&apos;t enough.
                </span>
              </h2>

              {/* Story Copy */}
              <p className="text-xs sm:text-sm text-[#FAF5F0]/85 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Our jumbo crochet bouquets bring together 24 individual statement-making stems, intricate hand-crochet details, and rich floral textures—made for milestone celebrations and the people you want to make feel truly seen.
              </p>

              {/* 4 Compact Frosted Feature Badges (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2.5 max-w-lg mx-auto lg:mx-0 py-1">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-gold/25 backdrop-blur-xs text-xs text-[#FAF5F0]">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="font-medium text-[11px] sm:text-xs">24 Stems Arrangement</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-gold/25 backdrop-blur-xs text-xs text-[#FAF5F0]">
                  <Heart className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="font-medium text-[11px] sm:text-xs">Fine Combed Cotton</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-gold/25 backdrop-blur-xs text-xs text-[#FAF5F0]">
                  <Award className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="font-medium text-[11px] sm:text-xs">Keepsake Gift Box</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-gold/25 backdrop-blur-xs text-xs text-[#FAF5F0]">
                  <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="font-medium text-[11px] sm:text-xs">Artisan Certificate</span>
                </div>
              </div>

              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href={`/products/${current.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gold hover:bg-gold-hover text-[#2E1715] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Acquire {current.shortName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/collections/jumbo-bouquets"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-gold/40 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:border-gold hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore Jumbo Bouquets</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
