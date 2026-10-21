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
    colors: ["#A32D3B", "#3B1017", "#1A080C"],
  },
  {
    id: "handcrafted-moments",
    imageUrl: "/images/carousel/handcrafted-moments.png",
    imageAlt: "Handcrafted Crochet Floral Keepsakes and Warm Artisanal Moments",
    colors: ["#4A2328", "#2D1518", "#140A0C"],
  },
  {
    id: "royal-crimson-keepsake",
    imageUrl: "/images/carousel/royal-crimson-keepsake.png",
    imageAlt: "Signature Royal Crimson Keepsake Box and Forever Crochet Blooms",
    colors: ["#6B1724", "#3D0D15", "#190509"],
  },
];

export function HeroCarouselShowcase() {
  return (
    <div className="w-full bg-[#FFFDF9] pt-2 pb-10">
      <AppleCarousel
        slides={SHOWCASE_SLIDES}
        autoPlay={true}
        autoPlayInterval={6500}
        leftControls={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 text-[#A32D3B] shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#A32D3B]" />
              Limited Edition Hampers
            </span>
          </div>
        }
        rightControls={
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white bg-[#A32D3B] hover:bg-[#852433] transition-colors shadow-md group"
          >
            <span>Claim Your Hamper</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
    </div>
  );
}
