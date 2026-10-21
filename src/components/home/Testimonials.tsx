import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ArrowRight, Eye, Palette } from 'lucide-react';

const COMMUNITY_PILLARS = [
  {
    title: 'Made with care',
    description:
      'The texture and details of crochet give every bloom a character of its own.',
    icon: Sparkles,
  },
  {
    title: 'Chosen with intention',
    description:
      'A gift that reflects someone’s favourite colours, personality, or a memory you share can feel especially meaningful.',
    icon: Palette,
  },
  {
    title: 'Made to stay on display',
    description:
      'Unlike fresh flowers, crochet blooms can be kept as a decorative reminder of the moment they were given.',
    icon: Eye,
  },
];

export function Testimonials() {
  return (
    <section
      aria-label="Customer Feedback and Gifting Pillars"
      className="py-12 md:py-20 bg-surface-warm/40 border-b border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <Heart className="w-3.5 h-3.5 fill-primary" />
            <span>NOTES FROM OUR COMMUNITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
            The best part is seeing someone smile.
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-2">
            A thoughtful gift becomes even more special when you hear what it meant to the person who received it.
          </p>
          <p className="text-xs text-text-muted/80 mt-1 italic">
            What makes a handmade gift special?
          </p>
        </div>

        {/* Community Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMMUNITY_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-sm flex flex-col justify-between hover:border-blush transition-colors"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blush-soft flex items-center justify-center text-primary mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-text-main mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Find a Gift to Remember</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
