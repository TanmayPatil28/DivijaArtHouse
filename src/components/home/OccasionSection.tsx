import React from 'react';
import Link from 'next/link';
import {
  Cake,
  Heart,
  Flame,
  GraduationCap,
  Sparkles,
  Smile,
  ArrowRight,
} from 'lucide-react';

const FEATURED_OCCASIONS = [
  {
    tag: 'Sacred Festive Rituals',
    title: 'Diwali & Pooja Sanctum',
    subtitle: 'Adorn home mandirs, entrances, and sacred poojas with reusable Kundan OHP rangolis and festive tealights.',
    cta: 'Shop Diwali & Pooja Decor',
    href: '/collections/ohp-sheets-rangoli',
    image: '/images/categories/ohp-rangoli.svg',
    alt: 'Kundan OHP Sheets Rangoli for Diwali and Pooja',
    icon: Sparkles,
  },
  {
    tag: 'Grand Wedding Art',
    title: 'Haldi, Mehendi & Sangeet',
    subtitle: 'Vibrant yellow and red woolen floor mandalas hand-rolled for pre-wedding rituals and bridal entrances.',
    cta: 'Shop Wedding Rangoli',
    href: '/collections/woolen-rangoli',
    image: '/images/categories/woolen-rangoli.svg',
    alt: 'Plush Woolen Rangoli for Haldi and Wedding Ceremonies',
    icon: Heart,
  },
];

const COMPANION_OCCASIONS = [
  {
    title: 'Griha Pravesh & Mandir',
    subtitle: 'Artisanal door torans with brass bells and mirror embellishments to bless every entrance.',
    cta: 'Explore Door Torans',
    href: '/collections/decore-crafts',
    image: '/images/categories/decore-crafts.svg',
    alt: 'Festive Door Torans and Mandir Decor',
    icon: Flame,
  },
  {
    title: 'Desk & Living Spaces',
    subtitle: 'Hand-sculpted pipe cleaner flower pots and everlasting tulip stems for cheer that never fades.',
    cta: 'Explore Desk Florals',
    href: '/collections/pipe-cleaner-crafts',
    image: '/images/categories/pipe-cleaner.svg',
    alt: 'Pipe Cleaner Sculpted Desk Pots and Florals',
    icon: Smile,
  },
  {
    title: 'Reusable Floor Art',
    subtitle: 'Zero color-powder mess and instant 2-minute setup for daily or festive pooja spaces.',
    cta: 'Shop Reusable Rangolis',
    href: '/collections/ohp-sheets-rangoli',
    image: '/images/categories/ohp-rangoli.svg',
    alt: 'Reusable Acrylic OHP Rangoli Designs',
    icon: Sparkles,
  },
  {
    title: 'Festive Keepsake Gifting',
    subtitle: 'Thoughtful artisanal gifts handcrafted by women artisans in Pune with customized blessings.',
    cta: 'Explore Gift Crafts',
    href: '/shop',
    image: '/images/categories/decore-crafts.svg',
    alt: 'Artisanal Festive Decor and Keepsake Crafts',
    icon: Cake,
  },
];

export function OccasionSection() {
  return (
    <section
      aria-label="Shop by Occasion"
      className="py-16 md:py-24 bg-white border-b border-gold/30 relative overflow-hidden shadow-[0_4px_24px_-10px_rgba(46,23,21,0.06)]"
    >
      {/* Ambient Silk Atmosphere Glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(197,154,90,0.06),transparent_70%)] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-canvas border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs mb-2.5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>CRAFTED FOR SACRED &amp; JOYOUS MOMENTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
            What are we{' '}
            <span className="font-serif italic font-normal text-primary">
              celebrating?
            </span>
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-2 leading-relaxed">
            From auspicious poojas and radiant Haldi ceremonies to housewarmings and serene living spaces, explore authentic handmade crafts.
          </p>
        </div>

        {/* Asymmetric Curated Bento Grid */}
        <div className="space-y-4 sm:space-y-6">
          {/* Row 1: Featured Hero Occasions (2 Columns on Desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {FEATURED_OCCASIONS.map((occasion, idx) => {
              const Icon = occasion.icon;
              return (
                <Link
                  key={idx}
                  href={occasion.href}
                  className="group relative p-5 sm:p-7 rounded-[28px] bg-gradient-to-br from-[#FAF5F0] via-white to-[#F7ECEE]/40 border border-gold/35 shadow-sm hover:border-gold hover:shadow-[0_16px_36px_-12px_rgba(120,29,44,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 overflow-hidden"
                >
                  {/* Left Column: Editorial Copy & CTA */}
                  <div className="flex-1 text-center sm:text-left flex flex-col justify-between h-full space-y-3 z-10">
                    <div>
                      {/* Occasion Eyebrow Tag */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-gold/40 text-[10px] sm:text-[11px] font-semibold text-primary uppercase tracking-wider mb-2 shadow-2xs">
                        <Icon className="w-3 h-3 text-gold shrink-0" />
                        <span>{occasion.tag}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold tracking-tight text-xl sm:text-2xl text-text-main group-hover:text-primary transition-colors leading-snug">
                        {occasion.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-xs sm:text-sm text-text-muted mt-1.5 leading-relaxed max-w-sm">
                        {occasion.subtitle}
                      </p>
                    </div>

                    {/* CTA Pill */}
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold tracking-wide shadow-xs group-hover:bg-primary-hover group-hover:shadow-wine-glow transition-all duration-300">
                        <span>{occasion.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-gold-light" />
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Arched Editorial Floral Window */}
                  <div className="w-36 sm:w-44 md:w-48 aspect-[4/5] rounded-t-[36px] rounded-b-2xl overflow-hidden border border-gold/40 shadow-md bg-gradient-to-b from-white via-[#FCF3F5] to-[#F5E3E6] flex-shrink-0 relative group-hover:border-gold transition-colors">
                    <img
                      src={occasion.image}
                      alt={occasion.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Row 2: Balanced Companion Occasions (4 Columns on Desktop, 2x2 on Mobile/Tablet) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {COMPANION_OCCASIONS.map((occasion, idx) => {
              const Icon = occasion.icon;
              return (
                <Link
                  key={idx}
                  href={occasion.href}
                  className="group relative p-3 sm:p-4 rounded-2xl bg-surface-canvas/80 border border-gold/25 hover:border-gold hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Arched Floral Preview Window */}
                    <div className="w-full aspect-[4/3] rounded-t-xl rounded-b-lg overflow-hidden border border-gold/30 bg-gradient-to-b from-white to-[#F7ECEE]/40 mb-3 relative">
                      <img
                        src={occasion.image}
                        alt={occasion.alt}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Icon & Title Row */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                      <h3 className="font-semibold tracking-tight text-sm sm:text-base text-text-main group-hover:text-primary transition-colors line-clamp-1">
                        {occasion.title}
                      </h3>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed line-clamp-2">
                      {occasion.subtitle}
                    </p>
                  </div>

                  {/* Micro Prompt */}
                  <div className="mt-3 pt-2 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-semibold text-primary group-hover:text-primary-hover transition-colors">
                    <span className="truncate">{occasion.cta}</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 text-gold shrink-0 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
