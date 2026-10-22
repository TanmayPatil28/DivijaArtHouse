"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppleCarousel, CarouselSlide } from "./AppleCarousel";

const SHOWCASE_SLIDES: CarouselSlide[] = [
  {
    id: "special-offer-gift-box",
    imageUrl: "/images/carousel/special-offer-gift-box.png",
    imageAlt: "Special Offer Handcrafted Keepsake Gift Box and Luxury Crochet Bouquet",
    colors: ["#781D2C", "#381817", "#1F0A0E"],
  },
  {
    id: "handcrafted-moments",
    imageUrl: "/images/carousel/handcrafted-moments.png",
    imageAlt: "Handcrafted Crochet Floral Keepsakes and Warm Artisanal Moments",
    colors: ["#4A1D24", "#2D1418", "#140A0C"],
  },
  {
    id: "royal-crimson-keepsake",
    imageUrl: "/images/carousel/royal-crimson-keepsake.png",
    imageAlt: "Signature Royal Crimson Keepsake Box and Forever Crochet Blooms",
    colors: ["#631622", "#380D15", "#190509"],
  },
];

export function HeroCarouselShowcase() {
  return (
    <div className="w-full bg-canvas pt-4 pb-8 sm:pb-10 border-b border-border-subtle">
      <AppleCarousel
        slides={SHOWCASE_SLIDES}
        autoPlay={true}
        autoPlayInterval={6500}
        leftControls={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/95 text-primary border border-gold/40 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Limited Edition Hampers
            </span>
          </div>
        }
        rightControls={
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-all duration-300 shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <span>Claim Your Hamper</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
    </div>
  );
}
