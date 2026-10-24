"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Heart, Award } from "lucide-react";
import { AppleCarousel, CarouselSlide } from "./AppleCarousel";

const SHOWCASE_SLIDES: CarouselSlide[] = [
  {
    id: "festive-ohp-rangoli",
    imageUrl: "/images/carousel/special-offer-gift-box.png",
    imageAlt: "Handcrafted Reusable Kundan OHP Rangoli by DivijaArtHouse",
    colors: ["#781D2C", "#381817", "#1F0A0E"],
    content: (
      <div className="absolute inset-0 z-10 flex items-center">
        {/* Left Directional Luxury Scrim */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#1A0E0D]/95 via-[#1A0E0D]/85 via-50% to-transparent md:w-[75%] lg:w-[62%] pointer-events-none" 
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-black/30 md:bg-transparent pointer-events-none" 
          aria-hidden="true"
        />

        {/* Content Box */}
        <div className="relative z-20 max-w-xl lg:max-w-2xl px-6 sm:px-10 md:px-12 lg:px-16 py-8 flex flex-col justify-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-gold/15 text-gold border border-gold/40 backdrop-blur-md w-fit mb-3 sm:mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Reusable Festive Art</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-white tracking-tight leading-[1.15] mb-2 sm:mb-3">
            The Art of{' '}
            <span className="font-serif italic font-normal text-gold">
              Kundan Rangolis.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-gray-200/95 leading-relaxed max-w-lg mb-4 sm:mb-5">
            Hand-studded Kundan gems, radiant mirrors, and pearls set on transparent OHP acrylic sheets. Set up sacred pooja floor art in under 2 minutes—zero mess, reusable for years.
          </p>

          {/* Value Offer Tag */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#E8D5B7] font-medium mb-5 sm:mb-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span>Pan-India Safe Delivery • Reusable Box Packaging Included</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/collections/ohp-sheets-rangoli"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group/btn"
            >
              <span>Explore OHP Rangolis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Explore All Crafts</span>
            </Link>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "woolen-floor-art",
    imageUrl: "/images/carousel/handcrafted-moments.png",
    imageAlt: "Artisanal Handcrafted Woolen Rangoli Floor Art",
    colors: ["#4A1D24", "#2D1418", "#140A0C"],
    content: (
      <div className="absolute inset-0 z-10 flex items-center">
        {/* Left Directional Luxury Scrim */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#1A0E0D]/95 via-[#1A0E0D]/85 via-50% to-transparent md:w-[75%] lg:w-[62%] pointer-events-none" 
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-black/30 md:bg-transparent pointer-events-none" 
          aria-hidden="true"
        />

        {/* Content Box */}
        <div className="relative z-20 max-w-xl lg:max-w-2xl px-6 sm:px-10 md:px-12 lg:px-16 py-8 flex flex-col justify-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-gold/15 text-gold border border-gold/40 backdrop-blur-md w-fit mb-3 sm:mb-4 shadow-sm">
            <Heart className="w-3.5 h-3.5 text-gold fill-gold/20" />
            <span>Weddings &amp; Festive Pooja</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-white tracking-tight leading-[1.15] mb-2 sm:mb-3">
            Hand-Rolled Woolen{' '}
            <span className="font-serif italic font-normal text-gold">
              Floor Mandalas.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-gray-200/95 leading-relaxed max-w-lg mb-4 sm:mb-5">
            Plush pom-pom and crochet woolen floor art made for Haldi, Mehendi, Diwali, and grand celebrations. Soft, washable, and shaped with love by women artisans in Pune.
          </p>

          {/* Value Offer Tag */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#E8D5B7] font-medium mb-5 sm:mb-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span>100% Handcrafted • Washable &amp; Reusable</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/collections/woolen-rangoli"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group/btn"
            >
              <span>Explore Woolen Rangoli</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Our Artisan Story</span>
            </Link>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "pipe-cleaner-decor",
    imageUrl: "/images/carousel/royal-crimson-keepsake.png",
    imageAlt: "Sculpted Pipe Cleaner Crafts and Handcrafted Festive Decor",
    colors: ["#631622", "#380D15", "#190509"],
    content: (
      <div className="absolute inset-0 z-10 flex items-center">
        {/* Left Directional Luxury Scrim */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#1A0E0D]/95 via-[#1A0E0D]/85 via-50% to-transparent md:w-[75%] lg:w-[62%] pointer-events-none" 
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-black/30 md:bg-transparent pointer-events-none" 
          aria-hidden="true"
        />

        {/* Content Box */}
        <div className="relative z-20 max-w-xl lg:max-w-2xl px-6 sm:px-10 md:px-12 lg:px-16 py-8 flex flex-col justify-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-gold/15 text-gold border border-gold/40 backdrop-blur-md w-fit mb-3 sm:mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5 text-gold" />
            <span>Sculpted Florals &amp; Home Decor</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-white tracking-tight leading-[1.15] mb-2 sm:mb-3">
            Everlasting Pipe Cleaner{' '}
            <span className="font-serif italic font-normal text-gold">
              Florals &amp; Decor Crafts.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-gray-200/95 leading-relaxed max-w-lg mb-4 sm:mb-5">
            Velvet chenille stems sculpted into timeless botanical blossoms, handcrafted door torans, and festive home keepsakes that never wilt or fade.
          </p>

          {/* Value Offer Tag */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#E8D5B7] font-medium mb-5 sm:mb-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span>Everlasting Keepsakes • Handcrafted with Devotion</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/collections/pipe-cleaner-crafts"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group/btn"
            >
              <span>Explore Pipe Cleaner Crafts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/collections/decore-crafts"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Explore Decore Crafts</span>
            </Link>
          </div>
        </div>
      </div>
    ),
  },
];

export function HeroCarouselShowcase() {
  return (
    <div className="w-full bg-canvas pt-3 sm:pt-4 pb-6 sm:pb-8 border-b border-border-subtle">
      <AppleCarousel
        slides={SHOWCASE_SLIDES}
        autoPlay={true}
        autoPlayInterval={6500}
      />
    </div>
  );
}
