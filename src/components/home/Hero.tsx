'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles, Heart, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FBF8F5] via-[#FAF5F0] to-[#FAF5F0] py-12 md:py-20 lg:py-24 border-b border-border-subtle">
      {/* Ambient Silk Atmosphere Glow */}
      <div 
        className="absolute top-10 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(197,154,90,0.12),transparent_70%)] pointer-events-none blur-3xl -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 left-10 w-80 h-80 bg-[radial-gradient(circle,rgba(232,184,188,0.15),transparent_70%)] pointer-events-none blur-3xl -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Atelier Editorial Storytelling & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Atelier Eyebrow Ribbon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Artisanal Rangolis &amp; Keepsake Crafts</span>
              <span className="w-1 h-1 rounded-full bg-gold/70" />
              <span className="text-[11px] text-text-muted font-medium lowercase">pune studio</span>
            </div>

            {/* Editorial Serif & Italic Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-semibold text-text-main leading-[1.12] tracking-tight">
              Festive traditions{' '}
              <span className="font-serif italic font-normal text-primary inline-block">
                crafted to stay forever.
              </span>
            </h1>

            {/* Emotional Lead Copy */}
            <p className="text-base sm:text-lg md:text-xl text-text-main/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Celebrate life&apos;s sacred rituals and joyous gatherings. Explore reusable Kundan OHP rangolis, cozy woolen floor art, sculpted pipe cleaner blooms, and festive decor—handcrafted piece by piece by talented women artisans in Pune.
            </p>

            {/* Occasion Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 border border-border-subtle text-text-main shadow-2xs">
                <span className="text-gold">✦</span> Diwali &amp; Festive Pooja
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 border border-border-subtle text-text-main shadow-2xs">
                <span className="text-gold">✦</span> Weddings &amp; Haldi Decor
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 border border-border-subtle text-text-main shadow-2xs">
                <span className="text-gold">✦</span> Everlasting Home Keepsakes
              </span>
            </div>

            {/* Dual CTAs with Gold Ambient Glow */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore All Crafts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-surface-warm border border-border-subtle text-text-main hover:text-primary text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm hover:border-gold/60 hover:shadow-gold-soft hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <span>Our Artisan Story</span>
              </Link>
            </div>

            {/* Atelier Trust Stamp */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs sm:text-[13px] text-text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium text-text-main">Handcrafted in Pune, India</span>
              </div>
              <span className="text-gold/60">•</span>
              <span>Zero wilting</span>
              <span className="text-gold/60">•</span>
              <span>Gift packaging included</span>
            </div>
          </div>

          {/* Right Column: Layered Atelier Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative mt-4 lg:mt-0">
            {/* Ambient Gold Back-Glow */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-gold/25 via-blush-soft/30 to-primary/15 rounded-[40px] blur-2xl -z-10 pointer-events-none" />

            <div className="relative w-full max-w-[380px] sm:max-w-[430px] aspect-square">
              {/* Flagship Edge-to-Edge Showcase Frame */}
              <div className="relative w-full h-full rounded-[28px] sm:rounded-[36px] overflow-hidden border border-gold/40 shadow-[0_24px_50px_-12px_rgba(46,23,21,0.18)] bg-gradient-to-b from-[#FBF8F5] via-[#F8F1ED]/50 to-[#F2E8E4]/60 group">
                <img
                  src="/images/categories/ohp-rangoli.svg"
                  alt="Handcrafted Kundan OHP Rangoli Art"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />

                {/* Subtle Edge Inset Border */}
                <div className="absolute inset-0 rounded-[28px] sm:rounded-[36px] border border-white/40 pointer-events-none" />
              </div>

              {/* Overlapping Offset Atelier Polaroid (Detail Stitching) */}
              <div className="absolute -bottom-5 -left-4 sm:-bottom-7 sm:-left-6 w-36 sm:w-44 bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-gold/35 rotate-[-4deg] hover:rotate-0 transition-transform duration-300 z-20 group">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-warm border border-border-subtle/60">
                  <img
                    src="/images/categories/woolen-rangoli.svg"
                    alt="Woolen Floor Art Mandala"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="pt-2 px-1 text-center">
                  <p className="text-[11px] font-semibold text-text-main tracking-tight leading-tight">Woolen Floor Art</p>
                  <p className="text-[9px] text-gold uppercase tracking-wider font-medium mt-0.5">Handcrafted Mandala</p>
                </div>
              </div>

              {/* Floating Badge 1: Reusable & Everlasting */}
              <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold/40 shadow-md flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-text-main z-20 hover:scale-105 transition-transform duration-200">
                <Heart className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
                <span>Reusable &amp; Mess-Free</span>
              </div>

              {/* Floating Badge 2: Handcrafted in Pune */}
              <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 bg-primary text-white backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gold/40 shadow-wine-glow flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold z-20 hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>100% Handcrafted • Pune</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
