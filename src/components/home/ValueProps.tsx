import React from 'react';
import Image from 'next/image';

const VALUE_PROPS = [
  {
    title: 'Made slowly, with care.',
    description:
      'Every crochet flower is shaped stitch by stitch, giving each piece its own texture and character.',
    icon: '/images/badges/handcrafted.svg',
    alt: 'Handcrafted crochet art',
  },
  {
    title: 'For the people who matter.',
    description:
      'From a birthday surprise to an unexpected little thank-you, find a gift that feels personal.',
    icon: '/images/badges/gifting.svg',
    alt: 'Meaningful gifting',
  },
  {
    title: "Ready to make someone's day.",
    description:
      'Choose a thoughtful floral gift, with gift packaging and a personal message option where available.',
    icon: '/images/badges/presentation.svg',
    alt: 'Beautiful gift presentation',
  },
  {
    title: 'Beauty that stays.',
    description:
      "Unlike fresh flowers, crochet blooms don't need water and won't wilt after a few days. Keep them on a desk, bedside table, or shelf as a lasting reminder of a special moment.",
    icon: '/images/badges/everlasting.svg',
    alt: 'Everlasting floral blooms',
  },
];

export function ValueProps() {
  return (
    <section
      aria-label="Brand Value Propositions"
      className="bg-surface-warm border-b border-border-subtle py-10 md:py-14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {VALUE_PROPS.map((prop, idx) => (
            <div
              key={idx}
              className="flex items-start sm:flex-col sm:items-center text-left sm:text-center p-5 rounded-2xl bg-white border border-border-subtle shadow-sm hover:border-blush transition-all duration-200 gap-4"
            >
              {/* Badge Icon */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                <Image
                  src={prop.icon}
                  alt={prop.alt}
                  fill
                  unoptimized={prop.icon.endsWith('.svg')}
                  className="object-contain"
                />
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <h3 className="font-semibold tracking-tight text-base sm:text-lg text-text-main">
                  {prop.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
