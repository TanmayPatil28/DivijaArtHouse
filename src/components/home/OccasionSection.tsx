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
    gradient: 'from-amber-50 to-orange-50 border-amber-200/60 text-amber-900',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'Anniversaries',
    subtitle: 'Celebrate the little things that make your story yours, with blooms made to be kept.',
    cta: 'Shop Anniversary Gifts',
    href: '/shop?occasion=anniversaries',
    icon: Heart,
    gradient: 'from-rose-50 to-pink-50 border-rose-200/60 text-rose-900',
    iconBg: 'bg-rose-100 text-rose-700',
  },
  {
    title: "Valentine's Day",
    subtitle: 'For the person who makes ordinary days feel a little more special.',
    cta: 'Find a Romantic Gift',
    href: '/shop?occasion=valentines-day',
    icon: Flame,
    gradient: 'from-red-50 to-blush-soft border-red-200/60 text-red-900',
    iconBg: 'bg-red-100 text-red-700',
  },
  {
    title: 'Graduations',
    subtitle: 'A thoughtful way to celebrate the hard work, brave beginnings, and exciting chapters ahead.',
    cta: 'Celebrate Their Achievement',
    href: '/shop?occasion=graduation',
    icon: GraduationCap,
    gradient: 'from-blue-50 to-indigo-50 border-blue-200/60 text-blue-900',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Festivals & Celebrations',
    subtitle: 'Bring something thoughtful to the festivities, from Rakhi surprises to Diwali gifting.',
    cta: 'Explore Festive Gifts',
    href: '/shop?occasion=festivals',
    icon: Sparkles,
    gradient: 'from-yellow-50 to-amber-50 border-yellow-200/60 text-yellow-900',
    iconBg: 'bg-yellow-100 text-yellow-700',
  },
  {
    title: 'Just Because',
    subtitle: 'No occasion needed. Just a little reminder that someone is on your mind.',
    cta: 'Send a Little Something',
    href: '/shop?occasion=just-because',
    icon: Smile,
    gradient: 'from-emerald-50 to-teal-50 border-emerald-200/60 text-emerald-900',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
];

export function OccasionSection() {
  return (
    <section
      aria-label="Shop by Occasion"
      className="py-12 md:py-20 bg-white border-b border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <Heart className="w-3.5 h-3.5 fill-primary" />
            <span>FOR THE MOMENTS THAT MATTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
            What are we celebrating?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-2">
            A gift doesn&apos;t have to be grand to mean something. Sometimes, it&apos;s the thought behind it that stays with us.
          </p>
        </div>

        {/* Occasion Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {OCCASIONS.map((occasion, idx) => {
            const Icon = occasion.icon;
            return (
              <Link
                key={idx}
                href={occasion.href}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${occasion.gradient} border transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between`}
              >
                <div>
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${occasion.iconBg}`}
                  >
                    <Icon className="w-6 h-6" />
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
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
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
