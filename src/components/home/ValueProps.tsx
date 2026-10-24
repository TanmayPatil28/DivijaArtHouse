import React from 'react';

const VALUE_PROPS = [
  {
    number: '01',
    subtitle: 'HANDCRAFTED ART',
    title: 'Made slowly, with care.',
    description:
      'Every rangoli piece, woolen mandala, and sculpted pipe cleaner stem is shaped by hand with love and dedication.',
    icon: '/images/badges/handcrafted.svg',
    alt: 'Handcrafted artisan crafts',
  },
  {
    number: '02',
    subtitle: 'SACRED & FESTIVE MOMENTS',
    title: 'For joyous celebrations.',
    description:
      'From sacred Diwali poojas and radiant Haldi ceremonies to home living spaces and thoughtful festive gifts.',
    icon: '/images/badges/gifting.svg',
    alt: 'Meaningful festive gifting',
  },
  {
    number: '03',
    subtitle: 'GIFT-READY PRESENTATION',
    title: "Ready for celebrations.",
    description:
      'Secure packaging with reusable storage boxes and personalized message notes for hassle-free gifting.',
    icon: '/images/badges/presentation.svg',
    alt: 'Beautiful festive presentation',
  },
  {
    number: '04',
    subtitle: 'REUSABLE FOREVER',
    title: 'Beauty that stays.',
    description:
      'Zero messy color powder cleanup. Reusable acrylic OHP rangolis, washable woolen floor art, and everlasting decor crafted to last for years.',
    icon: '/images/badges/everlasting.svg',
    alt: 'Reusable everlasting crafts',
  },
];

export function ValueProps() {
  return (
    <section
      aria-label="Brand Value Propositions"
      className="relative bg-gradient-to-r from-[#5A1420] via-[#781D2C] to-[#5A1420] border-y border-gold/30 shadow-md overflow-hidden"
    >
      {/* Subtle Velvet Sheen & Champagne Ambient Glow */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(197,154,90,0.14),transparent_75%)] pointer-events-none" 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Horizontal Strip: 2x2 grid on mobile/tablet, sleek 4-column row on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-gold/15 lg:divide-y-0">
          {VALUE_PROPS.map((prop, idx) => {
            // Apply right border on odd mobile items (first column) and on items 1-3 on desktop
            const isLeftColMobile = idx % 2 === 0;
            const isNotLastDesktop = idx < 3;

            return (
              <div
                key={idx}
                className={`group flex flex-col items-center text-center py-6 px-3 sm:py-8 sm:px-6 transition-all duration-300 ${
                  isLeftColMobile ? 'border-r border-gold/15' : ''
                } ${isNotLastDesktop ? 'lg:border-r lg:border-gold/20' : 'lg:border-r-0'}`}
              >
                {/* Champagne Gold & Velvet Wine Medallion with Hover Glow */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 flex-shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] group-hover:drop-shadow-[0_0_16px_rgba(197,154,90,0.45)]">
                  <img
                    src={prop.icon}
                    alt={prop.alt}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Atelier Micro Subtitle */}
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase text-gold/90 mb-1">
                  {prop.subtitle}
                </span>

                {/* Main Headline */}
                <h3 className="font-semibold tracking-tight text-[14px] sm:text-base text-white mb-1.5 leading-snug group-hover:text-gold-light transition-colors duration-200">
                  {prop.title}
                </h3>

                {/* Descriptive Copy */}
                <p className="text-[11px] sm:text-xs text-[#F7ECEE]/80 leading-relaxed max-w-[240px] mx-auto">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
