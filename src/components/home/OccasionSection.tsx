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

const OCCASIONS = [
  {
    title: 'Birthdays',
    subtitle: 'For another year of growth, laughter, and becoming more of who they are.',
    cta: 'Find a Birthday Gift',
    href: '/shop?occasion=birthdays',
    icon: Cake,
  },
  {
    title: 'Anniversaries',
    subtitle: 'Celebrate the little things that make your story yours, with blooms made to be kept.',
    cta: 'Shop Anniversary Gifts',
    href: '/shop?occasion=anniversaries',
    icon: Heart,
  },
  {
    title: "Valentine's Day",
    subtitle: 'For the person who makes ordinary days feel a little more special.',
    cta: 'Find a Romantic Gift',
    href: '/shop?occasion=valentines-day',
    icon: Flame,
  },
  {
    title: 'Graduations',
    subtitle: 'A thoughtful way to celebrate the hard work, brave beginnings, and exciting chapters ahead.',
    cta: 'Celebrate Their Achievement',
    href: '/shop?occasion=graduation',
    icon: GraduationCap,
  },
  {
    title: 'Festivals & Celebrations',
    subtitle: 'Bring something thoughtful to the festivities, from Rakhi surprises to Diwali gifting.',
    cta: 'Explore Festive Gifts',
    href: '/shop?occasion=festivals',
    icon: Sparkles,
  },
  {
    title: 'Just Because',
    subtitle: 'No occasion needed. Just a little reminder that someone is on your mind.',
    cta: 'Send a Little Something',
    href: '/shop?occasion=just-because',
    icon: Smile,
  },
];

export function OccasionSection() {
  return (
    <section
      aria-label="Shop by Occasion"
      className="py-12 md:py-20 bg-canvas border-b border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>FOR THE MOMENTS THAT MATTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
            What are we celebrating?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-2 leading-relaxed">
            A gift doesn&apos;t have to be grand to mean something. Sometimes, it&apos;s the thought behind it that stays with us.
          </p>
        </div>

        {/* Occasion Cards Grid with Unified Velvet Wine & Gold Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {OCCASIONS.map((occasion, idx) => {
            const Icon = occasion.icon;
            return (
              <Link
                key={idx}
                href={occasion.href}
                className="group relative p-6 rounded-2xl bg-white border border-border-subtle transition-all duration-300 hover:border-gold/60 hover:shadow-gold-soft hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Unified Signature Medallion */}
                  <div className="w-12 h-12 rounded-2xl bg-blush-soft border border-gold/40 flex items-center justify-center mb-4 text-primary group-hover:scale-105 transition-transform shadow-xs">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold tracking-tight text-lg sm:text-xl text-text-main group-hover:text-primary transition-colors mb-1.5">
                    {occasion.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {occasion.subtitle}
                  </p>
                </div>

                {/* Link Prompt */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary-hover transition-colors">
                  <span>{occasion.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
