import React from 'react';
import Image from 'next/image';

const VALUE_PROPS = [
  {
    title: 'Thoughtfully Handcrafted',
    description:
      'Every petal and stitch is lovingly crocheted by skilled Indian artisans using 100% fine cotton yarn.',
    icon: '/images/badges/handcrafted.svg',
    alt: 'Handcrafted crochet art',
  },
  {
    title: 'Made for Meaningful Gifting',
    description:
      'Perfect for birthdays, anniversaries, graduations, and heartfelt “thinking of you” surprises.',
    icon: '/images/badges/gifting.svg',
    alt: 'Meaningful gifting',
  },
  {
    title: 'Beautifully Presented',
    description:
      'Arrives in elegant gift-ready packaging with custom handwritten message cards upon request.',
    icon: '/images/badges/presentation.svg',
    alt: 'Beautiful gift presentation',
  },
  {
    title: 'Blooms That Last',
    description:
      'Everlasting floral beauty that never wilts, fades, or requires water — preserving moments forever.',
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
                  className="object-contain"
                />
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-text-main">
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
