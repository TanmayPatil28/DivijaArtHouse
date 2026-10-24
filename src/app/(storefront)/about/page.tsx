import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Sparkles,
  ArrowRight,
  Home,
  ChevronRight,
  ShieldCheck,
  Feather,
  Recycle,
  Gift,
  Smile,
  CheckCircle2,
  Clock,
  Layers,
  Scissors,
  PackageCheck,
  Award,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Our Story — Handcrafted Rangoli & Keepsake Decor | DivijaArtHouse',
  description:
    'Discover the heart behind DivijaArtHouse. We craft reusable Kundan OHP rangolis, plush woolen floor mandalas, sculpted pipe cleaner flora, and artisanal home decor—handcrafted with love by women artisans in Pune.',
  openGraph: {
    title: 'Our Story | DivijaArtHouse Handcrafted Rangoli & Keepsake Decor',
    description:
      'Festive traditions crafted to stay forever. Learn how our artisan community in Pune shapes sacred floor art, everlasting pipe cleaner florals, and keepsake home decor.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="bg-canvas min-h-screen">
      {/* Breadcrumb Header */}
      <nav
        aria-label="Breadcrumb"
        className="bg-surface-warm border-b border-border-subtle py-3 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs sm:text-sm text-text-muted">
          <Link
            href="/"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-text-main font-medium">Our Story</span>
        </div>
      </nav>

      {/* Hero Narrative Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-surface-warm via-canvas to-canvas border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Sacred Traditions • Living Art"
            eyebrowSuffix="Our Atelier Journey"
            titleLead="Festive Traditions Crafted,"
            titleAccent="To Stay Forever."
            description="DivijaArtHouse was born out of deep reverence for Indian festive celebrations, sacred poojas, and joyous gatherings. Traditional powder rangolis wash away in minutes, and fresh flowers wither after a day. We asked ourselves: why shouldn't the beauty of your sacred rituals and heartfelt gatherings stay vibrant and alive season after season?"
            align="center"
            headingTag="h1"
            size="xl"
          >
            <p className="text-base sm:text-lg font-serif italic text-primary pt-1">
              &ldquo;Festive traditions crafted to stay forever.&rdquo;
            </p>
          </SectionHeader>
        </div>
      </section>

      {/* Origin Story Grid */}
      <section className="py-16 md:py-24 bg-white border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-tr from-surface-warm via-blush-soft to-white border border-border-subtle shadow-md p-8 flex flex-col items-center justify-center">
                <div className="relative w-full h-72 sm:h-80 transition-transform duration-700 hover:scale-105">
                  <Image
                    src="/images/categories/ohp-rangoli.svg"
                    alt="Handcrafted Kundan OHP Rangoli by DivijaArtHouse"
                    fill
                    unoptimized
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-border-subtle shadow-lg flex items-center gap-3 max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 fill-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-main">
                      100% Handcrafted by Artisans
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Every jewel, pom-pom, and velvet stem is individually shaped by hand.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs backdrop-blur-sm">
                <Feather className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Our Craft Heritage</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text-main leading-tight tracking-tight">
                Slow Artistry in a World of{' '}
                <span className="font-serif italic font-normal text-primary inline-block">
                  Instant Everything.
                </span>
              </h2>

              <div className="space-y-4 text-text-muted text-base leading-relaxed">
                <p>
                  From a small sunlit studio table in Hadapsar, Pune, DivijaArtHouse grew from
                  a personal devotion to Indian folk artistry into a flourishing home-craft
                  collective. We focus exclusively on 4 traditional and contemporary craft lines:
                </p>
                <ul className="space-y-2 pl-4 list-disc text-sm sm:text-base">
                  <li>
                    <strong className="text-text-main">OHP Sheets Rangoli:</strong> Reusable transparent acrylic bases hand-studded with jewel-faceted Kundan stones, pearls, and radiant mirrors for mess-free 2-minute pooja setups.
                  </li>
                  <li>
                    <strong className="text-text-main">Woolen Rangoli:</strong> Plush, washable floor mandalas hand-rolled with vibrant woolen pom-poms—crafted for grand Haldi, Mehendi, and wedding entrances.
                  </li>
                  <li>
                    <strong className="text-text-main">Pipe Cleaner Crafts:</strong> Soft velvet chenille stems sculpted into everlasting floral pots, desk companions, and hair accessories that never wilt.
                  </li>
                  <li>
                    <strong className="text-text-main">Decore Crafts:</strong> Artisanal door torans with sacred brass bells, embellished tealight holders, and home sanctum keepsakes.
                  </li>
                </ul>
                <p>
                  Zero messy synthetic powders to breathe in or clean up. Zero wilted petals to throw away. Just heirloom-quality craft made to be packed away and cherished year after year.
                </p>
              </div>

              {/* Empowering Women Highlight */}
              <div className="bg-surface-warm rounded-2xl p-6 border border-border-subtle space-y-3">
                <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Empowering Indian Women Artisans
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  More than just an art house, Divija is a platform for socio-economic
                  dignity. We partner with skilled women homemakers across Pune, providing
                  flexible, home-based dignified employment, fair living wages, and continuous creative training in authentic Indian handicraft traditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-surface-warm border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Core Pillars"
            titleLead="The Values Handcrafted Into"
            titleAccent="Every Creation."
            description="We hold every piece to an uncompromising standard of conscience, craftsmanship, and aesthetic grace."
            align="center"
            size="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value Card 1 */}
            <div className="bg-white rounded-2xl p-8 border border-border-subtle shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blush-soft text-primary flex items-center justify-center">
                <Heart className="w-6 h-6 fill-primary" />
              </div>
              <h3 className="text-lg font-bold font-sans text-text-main">
                Unhurried Indian Handicraft
              </h3>
              <p className="text-sm text-text-muted leading-relaxed flex-1">
                Zero machine shortcuts, zero cookie-cutter mass production. Every Kundan jewel,
                woolen pom-pom, and chenille petal carries subtle idiosyncrasies that celebrate the authentic human hand that created it.
              </p>
              <div className="pt-2 text-xs font-medium text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>One-of-a-kind uniqueness</span>
              </div>
            </div>

            {/* Value Card 2 */}
            <div className="bg-white rounded-2xl p-8 border border-border-subtle shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-sans text-text-main">
                Reusable, Zero-Waste Floor Art
              </h3>
              <p className="text-sm text-text-muted leading-relaxed flex-1">
                Say goodbye to synthetic dye powders, floor stains, and wasteful single-use decorations. Our rangolis wipe clean and store easily for years of sacred poojas and celebrations.
              </p>
              <div className="pt-2 text-xs font-medium text-green-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                <span>Zero powder mess &amp; reusable for years</span>
              </div>
            </div>

            {/* Value Card 3 */}
            <div className="bg-white rounded-2xl p-8 border border-border-subtle shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-sans text-text-main">
                Thoughtful, Personalized Gifting
              </h3>
              <p className="text-sm text-text-muted leading-relaxed flex-1">
                From Diwali and housewarming gifts to Haldi blessings and self-care desk accents, each parcel arrives in luxury keepsake packaging with personalized handwritten greeting cards.
              </p>
              <div className="pt-2 text-xs font-medium text-amber-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Ready-to-gift festive packaging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Stage Artisan Craft Process */}
      <section className="py-16 md:py-24 bg-white border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Behind the Scenes"
            titleLead="The 4 Stages of an"
            titleAccent="Artisan Creation."
            description="Discover how authentic raw materials transform into heirloom festive floor art and home keepsakes."
            align="center"
            size="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stage 1 */}
            <div className="relative bg-surface-warm/60 rounded-2xl p-6 border border-border-subtle flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm font-sans not-italic tabular-nums">
                  01
                </div>
                <Layers className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="font-bold text-base text-text-main">
                Material Selection &amp; Grading
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">
                We curate high-transparency OHP acrylic sheets, faceted Kundan stones, rich woolen yarn, and soft chenille stems for vivid, enduring quality.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="relative bg-surface-warm/60 rounded-2xl p-6 border border-border-subtle flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm font-sans not-italic tabular-nums">
                  02
                </div>
                <Scissors className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="font-bold text-base text-text-main">
                Precision Hand Embellishment
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">
                Our women artisans patiently hand-set each Kundan stone, roll plush woolen pom-poms, or sculpt velvet chenille stems with meticulous symmetry.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="relative bg-surface-warm/60 rounded-2xl p-6 border border-border-subtle flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm font-sans not-italic tabular-nums">
                  03
                </div>
                <Clock className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="font-bold text-base text-text-main">
                Structural Harmony &amp; Curing
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">
                Every stone bond, toran stitch, and wire stem is inspected, reinforced, and cured to ensure resilient multi-year festive reuse.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="relative bg-surface-warm/60 rounded-2xl p-6 border border-border-subtle flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm font-sans not-italic tabular-nums">
                  04
                </div>
                <PackageCheck className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="font-bold text-base text-text-main">
                Keepsake Presentation
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">
                Finished creations are nestled in sturdy reusable storage cases with protective liners, care instructions, and satin ribbon accents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction Strip */}
      <section className="py-12 bg-surface-banner border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold font-sans not-italic tabular-nums text-primary">
                100%
              </p>
              <p className="text-xs sm:text-sm text-text-muted">Handcrafted in Pune, India</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold font-sans not-italic tabular-nums text-primary">
                4 Crafts
              </p>
              <p className="text-xs sm:text-sm text-text-muted">Rangolis &amp; Keepsake Decor</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold font-sans not-italic tabular-nums text-primary">
                Forever
              </p>
              <p className="text-xs sm:text-sm text-text-muted">Reusable &amp; Zero Mess</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold font-sans not-italic tabular-nums text-primary">
                PAN-India
              </p>
              <p className="text-xs sm:text-sm text-text-muted">Safe Doorstep Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <SectionHeader
            eyebrow="Adorn Your Sacred Space"
            titleLead="Ready to Bring Festive Art"
            titleAccent="into Your Life?"
            description="Whether for your home temple, an upcoming wedding celebration, or a thoughtful handmade keepsake, find the craft that speaks to your heart."
            align="center"
            size="lg"
          />
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-md active:scale-98"
            >
              <span>Explore All Handcrafted Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-surface-warm hover:bg-gray-100 text-text-main text-sm font-semibold border border-border-subtle transition-all"
            >
              <span>Custom Inquiries &amp; Bespoke Orders</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
