"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Heart, Award } from "lucide-react";
import { AppleCarousel, CarouselSlide } from "./AppleCarousel";

const SHOWCASE_SLIDES: CarouselSlide[] = [
  {
    id: "special-offer-gift-box",
    imageUrl: "/images/carousel/special-offer-gift-box.png",
    imageAlt: "Special Offer Handcrafted Keepsake Gift Box and Luxury Crochet Bouquet",
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
            <span>Limited Edition Hampers</span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-white tracking-tight leading-[1.15] mb-2 sm:mb-3">
            The Art of Thoughtful Gifting
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-gray-200/95 leading-relaxed max-w-lg mb-4 sm:mb-5">
            Handcrafted crochet floral keepsakes, artisan aroma candles, and personalized message cards presented in luxury velvet-ribboned gift boxes.
          </p>

          {/* Value Offer Tag */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#E8D5B7] font-medium mb-5 sm:mb-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span>Complimentary Pan-India Gift Wrapping &amp; Custom Handwritten Letter</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/collections/gift-boxes"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group/btn"
            >
              <span>Claim Your Hamper</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Explore All Boxes</span>
            </Link>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "handcrafted-moments",
    imageUrl: "/images/carousel/handcrafted-moments.png",
    imageAlt: "Handcrafted Crochet Floral Keepsakes and Warm Artisanal Moments",
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
            <span>100% Artisan Handcrafted</span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-white tracking-tight leading-[1.15] mb-2 sm:mb-3">
            Forever Blooms for Cherished Moments
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-gray-200/95 leading-relaxed max-w-lg mb-4 sm:mb-5">
            Lovingly hand-crocheted stitch-by-stitch by skilled women artisans in Hadapsar, Pune. Botanical floral gifts that will never wilt or fade away.
          </p>

          {/* Value Offer Tag */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#E8D5B7] font-medium mb-5 sm:mb-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span>100% Organic Cotton Yarn • Everlasting Keepsakes</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/collections/bouquets"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group/btn"
            >
              <span>Explore Bouquets</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Our Atelier Story</span>
            </Link>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "royal-crimson-keepsake",
    imageUrl: "/images/carousel/royal-crimson-keepsake.png",
    imageAlt: "Signature Royal Crimson Keepsake Box and Forever Crochet Blooms",
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
            <span>Atelier Signature Collection</span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-white tracking-tight leading-[1.15] mb-2 sm:mb-3">
            The Royal Sovereign Keepsake
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-gray-200/95 leading-relaxed max-w-lg mb-4 sm:mb-5">
            Velvet scarlet crochet roses adorned with fairy-lit accents and timeless keepsake domes. Our most coveted anniversary floral creation.
          </p>

          {/* Value Offer Tag */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#E8D5B7] font-medium mb-5 sm:mb-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span>Limited Atelier Batch • Pre-Order for Special Milestones</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/collections/jumbo-bouquets"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group/btn"
            >
              <span>Discover Signature Box</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Bespoke Inquiries</span>
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
