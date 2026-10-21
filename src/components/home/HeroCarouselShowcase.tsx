"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppleCarousel, CarouselSlide } from "./AppleCarousel";

const SHOWCASE_SLIDES: CarouselSlide[] = [
  {
    id: "royal-sovereign",
    imageUrl: "/images/products/royal-sovereign-jumbo-1.svg",
    imageAlt: "Royal Sovereign Jumbo Handcrafted Bouquet",
    headline: "The Royal Sovereign Bouquet",
    subheadline: "Grand 18-stem masterpiece hand-knitted from 100% combed milk cotton.",
    textPosition: "bottom-left",
    colors: ["#A32D3B", "#4A121A", "#1F0A0E"],
  },
  {
    id: "celestial-twilight",
    imageUrl: "/images/products/celestial-twilight-jumbo-1.svg",
    imageAlt: "Celestial Twilight Jumbo Everlasting Bouquet",
    headline: "Celestial Twilight Collection",
    subheadline: "Deep lavender roses, dusty mauve hydrangeas, and forever eucalyptus.",
    textPosition: "bottom-left",
    colors: ["#48233C", "#261320", "#140A11"],
  },
  {
    id: "eternal-sunshine",
    imageUrl: "/images/products/eternal-sunshine-sunflower-1.svg",
    imageAlt: "Eternal Sunshine Sunflower Bouquet",
    headline: "Eternal Sunshine Bouquet",
    subheadline: "Radiant golden sunflowers that will never fade, wilt, or lose their warmth.",
    textPosition: "bottom-left",
    colors: ["#633A18", "#381E0B", "#170C04"],
  },
  {
    id: "sweet-serenade",
    imageUrl: "/images/products/sweet-serenade-gift-box-1.svg",
    imageAlt: "Sweet Serenade Handcrafted Hamper",
    headline: "Artisanal Keepsake Gift Hampers",
    subheadline: "Thoughtfully assembled with custom keepsake cards and signature floral pots.",
    textPosition: "bottom-left",
    colors: ["#852433", "#4A141D", "#1C080B"],
  },
];

export function HeroCarouselShowcase() {
  return (
    <div className="w-full bg-[#FFFDF9] pt-2 pb-10">
      <AppleCarousel
        slides={SHOWCASE_SLIDES}
        autoPlay={true}
        autoPlayInterval={7000}
        leftControls={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 text-[#A32D3B] shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#A32D3B]" />
              Signature Masterpieces
            </span>
          </div>
        }
        rightControls={
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white bg-[#A32D3B] hover:bg-[#852433] transition-colors shadow-md group"
          >
            <span>Explore All Blooms</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
    </div>
  );
}
