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
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Our Story — Handcrafted Everlasting Blooms | DivijaArtHouse',
  description:
    'Discover the heart behind DivijaArtHouse. We craft everlasting crochet flowers using premium milk cotton yarn, empowering talented Indian women artisans while keeping your cherished memories in full bloom.',
  openGraph: {
    title: 'Our Story | DivijaArtHouse Handcrafted Everlasting Blooms',
    description:
      'Little Blooms, Lasting Feelings. Learn how our artisan community weaves love, patience, and botanical poetry into every single crochet petal.',
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
            eyebrow="The Heart Behind the Yarn"
            eyebrowSuffix="Our Atelier Journey"
            titleLead="Flowers That Never Wilt,"
            titleAccent="Feelings That Never Fade."
            description="DivijaArtHouse was born out of a tender reverence for life's quiet, profound moments. We watched fresh floral bouquets brighten a room for three short days, only to wither and be discarded. We asked ourselves: why shouldn't the token of your love, gratitude, or milestone stay as vibrant and alive as the feeling behind it?"
            align="center"
            headingTag="h1"
            size="xl"
          >
            <p className="text-base sm:text-lg font-serif italic text-primary pt-1">
              &ldquo;Little Blooms, Lasting Feelings.&rdquo;
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
                    src="/images/products/blushing-peony-rose-1.svg"
                    alt="Handcrafted Everlasting Crochet Bloom by DivijaArtHouse"
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
                      100% Hand-Stitched by Artisans
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Every single petal takes between 45 to 90 minutes of patient craft.
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
                  From a small sunlit studio table strewn with skeins of combed milk-cotton
                  yarn and polished bamboo crochet hooks, DivijaArtHouse grew from a personal
                  passion project into a dedicated craft community across India.
                </p>
                <p>
                  Unlike factory-made plastic replicas or mass-stamped artificial silk, crochet
                  is an ancient handcraft that no modern industrial machine can replicate. Each
                  loop, slip-stitch, and delicate petal curve requires genuine human touch,
                  rhythmic breath, and undivided attention.
                </p>
                <p>
                  We consciously chose <strong>5-ply combed milk cotton yarn</strong> for our
                  creations. It offers an incomparably velvety, tactile softness, rich color
                  saturation that resists sun fading, and gentle hypoallergenic qualities so
                  even friends with seasonal pollen allergies can embrace bouquets with joy.
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
                  dignity. We partner with skilled women homemakers and traditional knitters
                  across semi-urban Indian communities, providing flexible, home-based dignified
                  employment, fair living wages, and continuous creative training.
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
            titleLead="The Values Stitched Into"
            titleAccent="Every Stem."
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
                Handcrafted with Unhurried Love
              </h3>
              <p className="text-sm text-text-muted leading-relaxed flex-1">
                Zero machine shortcuts, zero cookie-cutter mass production. Every petal
                carries subtle, beautiful idiosyncrasies that celebrate the authentic human
                hand that crocheted it.
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
                Sustainable, Everlasting Blooms
              </h3>
              <p className="text-sm text-text-muted leading-relaxed flex-1">
                Say goodbye to water waste, chemical pesticides, refrigerated flight transit,
                and landfill flower waste. Our botanical creations last indefinitely on desks,
                bedside tables, and mantlepieces.
              </p>
              <div className="pt-2 text-xs font-medium text-green-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                <span>Zero wilting & zero water upkeep</span>
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
                From birthdays and graduations to anniversaries and self-love desk companions,
                each parcel arrives with aesthetic gift wrapping, protective tissue, and
                personalized handwritten greeting notes.
              </p>
              <div className="pt-2 text-xs font-medium text-amber-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Ready-to-gift luxury packaging</span>
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
            titleLead="The 4 Stages of a"
            titleAccent="Handcrafted Bloom."
            description="Discover how a humble spool of yarn transforms into an heirloom botanical sculpture."
            align="center"
            size="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stage 1 */}
            <div className="relative bg-surface-warm/60 rounded-2xl p-6 border border-border-subtle flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                  01
                </div>
                <Layers className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="font-bold text-base text-text-main">
                Yarn Selection & Harmony
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">
                We hand-curate premium 5-ply milk cotton skeins, checking for silky texture,
                resilience, and complementary pastel and botanical color palettes.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="relative bg-surface-warm/60 rounded-2xl p-6 border border-border-subtle flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                  02
                </div>
                <Scissors className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="font-bold text-base text-text-main">
                Hand-Crocheting Petals
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">
                Our women artisans patiently execute precise single, half-double, and treble
                crochet stitches to create realistic ruffled petal contours and delicate calyxes.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="relative bg-surface-warm/60 rounded-2xl p-6 border border-border-subtle flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                  03
                </div>
                <Clock className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="font-bold text-base text-text-main">
                Stem & Leaf Botanical Assembly
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">
                Flexible florist wire is enveloped in textured emerald yarn, securing lifelike
                foliage, buds, and full blossoms with seamless structural strength.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="relative bg-surface-warm/60 rounded-2xl p-6 border border-border-subtle flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                  04
                </div>
                <PackageCheck className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="font-bold text-base text-text-main">
                Aesthetic Gift Presentation
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed flex-1">
                Finished arrangements are wrapped in matte translucent Korean wrappers, tied with
                luxurious satin ribbons, and nestled in protective shipping cartons.
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
              <p className="text-2xl sm:text-3xl font-bold font-sans text-primary">
                100%
              </p>
              <p className="text-xs sm:text-sm text-text-muted">Handcrafted in India</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold font-sans text-primary">
                5-Ply
              </p>
              <p className="text-xs sm:text-sm text-text-muted">Combed Milk Cotton Yarn</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold font-sans text-primary">
                Forever
              </p>
              <p className="text-xs sm:text-sm text-text-muted">No Wilting or Water Needed</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold font-sans text-primary">
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
            eyebrow="Send A Little Something"
            titleLead="Ready to Bring Lasting Blooms"
            titleAccent="into Your Life?"
            description="Whether for someone you treasure or a charming accent for your own space, find the arrangement that speaks to your heart."
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
              <span>Custom Inquiries & Bespoke Orders</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
