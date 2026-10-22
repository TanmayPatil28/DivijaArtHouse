'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Award, ShieldCheck, Heart, Plus } from 'lucide-react';

const JUMBO_MASTERPIECES = [
  {
    id: 'royal-sovereign',
    shortName: 'The Royal Sovereign',
    name: 'The Royal Sovereign 24-Stem Jumbo Bouquet',
    palette: 'Velvet Wine, Crimson & Gold',
    price: '₹3,499',
    originalPrice: '₹4,499',
    image: '/images/products/royal-sovereign-jumbo-1.svg',
    slug: 'the-royal-sovereign-24-stem-jumbo-bouquet',
    tag: 'Flagship Crown',
    hotspots: [
      {
        id: 1,
        title: '24 Hand-Tied Stems',
        desc: 'Over 36 hours of master crochet forming an opulent 24-stem floral crown.',
        x: '50%',
        y: '28%',
      },
      {
        id: 2,
        title: '100% Fine Combed Cotton',
        desc: 'Artisan stitch definition with velvet-soft tactile petal texture that never wilts.',
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
    palette: 'Midnight Blue, Twilight Cream & Sage',
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
      className="py-16 md:py-24 bg-[#FAF5F0] border-b border-gold/30 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Haute Velvet Wine Atelier Stage Container */}
        <div className="relative rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-[#55111B] via-[#781D2C] to-[#450C15] border border-gold/40 shadow-2xl p-6 sm:p-10 lg:p-14 overflow-hidden text-center">
          {/* Luminous Overhead Radial Spotlight */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(197,154,90,0.22),transparent_75%)] pointer-events-none blur-2xl" 
            aria-hidden="true" 
          />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            {/* Atelier Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-gold/40 text-gold-light text-xs font-semibold uppercase tracking-widest shadow-2xs backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>MADE FOR THE BIG MOMENTS • JUMBO ATELIER</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
              When a little bouquet{' '}
              <span className="font-serif italic font-normal text-gold inline-block">
                isn&apos;t enough.
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-[#FAF5F0]/85 max-w-2xl mx-auto leading-relaxed">
              Some moments call for something extra special. Our jumbo crochet bouquets bring together statement-making size, intricate details, and handcrafted floral textures. Designed to take centre stage for milestone celebrations and meaningful surprises.
            </p>

            {/* Interactive Flagship Masterpiece Switcher */}
            <div className="pt-2 pb-1">
              <div className="inline-flex p-1.5 rounded-full bg-black/30 border border-gold/40 backdrop-blur-md shadow-inner">
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
                      className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 ${
                        isSelected
                          ? 'bg-gold text-[#2E1715] shadow-gold-glow scale-100'
                          : 'text-[#FAF5F0]/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{item.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grand Center Stage Display with Hotspots */}
            <div className="relative max-w-[420px] sm:max-w-[460px] mx-auto aspect-square my-6">
              {/* Pedestal Lighting Frame */}
              <div className="relative w-full h-full rounded-[32px] sm:rounded-[38px] overflow-hidden border border-gold/40 shadow-2xl bg-gradient-to-b from-white/15 via-[#FCF3F5]/10 to-black/20 p-2 backdrop-blur-xs group">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover rounded-[26px] sm:rounded-[32px] transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-gold/40 text-[10px] sm:text-[11px] font-semibold text-gold shadow-sm flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{current.tag}</span>
                </div>

                {/* Floating Price Pill */}
                <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 px-3.5 py-1.5 rounded-full bg-gold text-[#2E1715] text-xs font-bold border border-white/40 shadow-gold-soft flex items-center gap-1.5">
                  <span>{current.price}</span>
                  <span className="text-[10px] line-through opacity-70 font-normal">{current.originalPrice}</span>
                </div>
              </div>

              {/* Glowing Interactive Hotspot Pins */}
              {current.hotspots.map((spot) => {
                const isOpen = activeHotspot === spot.id;

                return (
                  <div
                    key={spot.id}
                    className="absolute z-20"
                    style={{ left: spot.x, top: spot.y }}
                  >
                    {/* Hotspot Pin Button */}
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(isOpen ? null : spot.id)}
                      onMouseEnter={() => setActiveHotspot(spot.id)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      className="relative -translate-x-1/2 -translate-y-1/2 group/pin focus:outline-none"
                      aria-label={spot.title}
                    >
                      {/* Pulsing Outer Aura */}
                      <span className="absolute -inset-1 rounded-full bg-gold/50 animate-ping opacity-75" />

                      {/* Core Pin Icon */}
                      <span className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#2E1715] border-2 border-gold flex items-center justify-center font-bold text-xs sm:text-sm shadow-gold-glow group-hover/pin:scale-115 transition-transform duration-200">
                        <Plus
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${
                            isOpen ? 'rotate-45 text-primary' : 'text-[#2E1715]'
                          }`}
                        />
                      </span>
                    </button>

                    {/* Floating Tooltip Card */}
                    {isOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-56 sm:w-64 p-3 rounded-2xl bg-[#2E1715]/95 backdrop-blur-md border border-gold/50 shadow-2xl text-left pointer-events-none z-30 transition-all duration-200">
                        <div className="flex items-center gap-1.5 text-gold text-[10px] font-semibold uppercase tracking-wider mb-1">
                          <Sparkles className="w-3 h-3 shrink-0" />
                          <span>Artisan Detail</span>
                        </div>
                        <p className="text-white text-xs sm:text-sm font-semibold leading-tight mb-1">
                          {spot.title}
                        </p>
                        <p className="text-[#FAF5F0]/80 text-[11px] leading-relaxed">
                          {spot.desc}
                        </p>
                        {/* Tooltip Arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-2.5 h-2.5 bg-[#2E1715] border-r border-b border-gold/50 rotate-45 -mt-1.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 4 Frosted Quality Badges Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto pt-2">
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-gold/25 backdrop-blur-xs text-xs text-[#FAF5F0]">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium">24 Stems Dome</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-gold/25 backdrop-blur-xs text-xs text-[#FAF5F0]">
                <Heart className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium">Fine Combed Cotton</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-gold/25 backdrop-blur-xs text-xs text-[#FAF5F0]">
                <Award className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium">Presentation Box</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-gold/25 backdrop-blur-xs text-xs text-[#FAF5F0]">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium">Artisan Certificate</span>
              </div>
            </div>

            {/* Dual CTAs with Gold Glow */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
              <Link
                href={`/products/${current.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gold hover:bg-gold-hover text-[#2E1715] text-sm font-semibold tracking-wide transition-all duration-300 shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Acquire {current.shortName}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/collections/jumbo-bouquets"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-gold/40 text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-2xs hover:border-gold hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore All Jumbo Bouquets</span>
              </Link>
            </div>

            {/* Footnote */}
            <p className="text-xs text-[#F7ECEE]/70 pt-2">
              A memorable gift, chosen with care and made to be enjoyed long after the celebration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
