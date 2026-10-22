import React from 'react';
import Link from 'next/link';
import { Star, Heart, CheckCircle2, ArrowRight, Sparkles, Quote } from 'lucide-react';

const COMMUNITY_TESTIMONIALS = [
  {
    name: 'Ananya S.',
    location: 'Pune, Maharashtra',
    headline: 'She cried happy tears on our anniversary.',
    quote:
      'Ordered the Blushing Peony bouquet for our first anniversary. Fresh flowers wilt in three days, but this is sitting beautifully on her bedside table a year later. The stitch detail in person is truly breathtaking.',
    giftName: 'Blushing Peony & Rose Bouquet',
    giftHref: '/products/blushing-peony-rose-handcrafted-bouquet',
    giftImage: '/images/products/blushing-peony-rose-1.svg',
    occasion: '1st Wedding Anniversary',
  },
  {
    name: 'Rohan M.',
    location: 'Mumbai, Maharashtra',
    headline: 'The sweetest birthday surprise ever.',
    quote:
      'Sent Barnaby the Bear with Sunflower to my sister in Bangalore for her birthday. The packaging was so thoughtful and arrived in pristine condition. She keeps him right beside her laptop on her work desk!',
    giftName: 'Barnaby the Bear with Sunflower',
    giftHref: '/products/barnaby-the-bear-crochet-sunflower-gift',
    giftImage: '/images/products/barnaby-bear-amigurumi-1.svg',
    occasion: "Sister's Birthday",
  },
  {
    name: 'Priya K.',
    location: 'Bengaluru, Karnataka',
    headline: 'A monumental, jaw-dropping work of art.',
    quote:
      'The Royal Sovereign Jumbo is an absolute masterpiece. The luxury keepsake box, the wax-sealed certificate, and the sheer weight of 24 stems—everyone at the party was amazed that it was sculpted entirely by hand.',
    giftName: 'The Royal Sovereign 24-Stem Jumbo',
    giftHref: '/products/the-royal-sovereign-24-stem-jumbo-bouquet',
    giftImage: '/images/products/royal-sovereign-jumbo-1.svg',
    occasion: 'Milestone Celebration',
  },
];

export function Testimonials() {
  return (
    <section
      aria-label="Customer Feedback and Community Stories"
      className="py-16 md:py-24 bg-[#FAF5F0] border-b border-gold/30 relative overflow-hidden"
    >
      {/* Ambient Radial Radiance */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(197,154,90,0.08),transparent_70%)] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs mb-2.5 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 fill-primary text-primary shrink-0" />
            <span>NOTES FROM OUR COMMUNITY • VERIFIED GIFTER STORIES</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text-main leading-tight">
            The best part is{' '}
            <span className="font-serif italic font-normal text-primary inline-block">
              seeing someone smile.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-text-muted mt-2.5 leading-relaxed">
            A thoughtful gift becomes even more special when you hear what it meant to the person who received it.
          </p>

          {/* Community Trust Bar */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-white/90 border border-gold/40 shadow-2xs text-xs font-medium text-text-main">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-gold text-gold" />
              ))}
            </div>
            <span className="font-semibold text-primary font-sans not-italic tabular-nums">4.9 / 5 Average Rating</span>
            <span className="text-gold">•</span>
            <span className="text-text-muted font-sans not-italic tabular-nums">1,200+ Handcrafted Blooms Delivered Across India</span>
          </div>
        </div>

        {/* 3 Verified Gifter Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {COMMUNITY_TESTIMONIALS.map((review, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl sm:rounded-3xl border border-gold/35 p-6 sm:p-7 shadow-sm hover:border-gold hover:shadow-[0_16px_36px_-12px_rgba(120,29,44,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Star Rating & Verified Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-semibold text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Gifter</span>
                  </span>
                </div>

                {/* Review Headline */}
                <h3 className="font-semibold text-base sm:text-lg text-text-main group-hover:text-primary transition-colors leading-snug mb-2">
                  &ldquo;{review.headline}&rdquo;
                </h3>

                {/* Review Body */}
                <p className="text-xs sm:text-[13px] text-text-muted leading-relaxed mb-5">
                  {review.quote}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-border-subtle/70 space-y-3">
                {/* Gifter Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-text-main leading-tight">
                      {review.name}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {review.location}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-gold tracking-wider uppercase bg-surface-canvas px-2.5 py-1 rounded-full border border-gold/30">
                    {review.occasion}
                  </span>
                </div>

                {/* Gifted Product Chip */}
                <Link
                  href={review.giftHref}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-canvas/80 hover:bg-blush-soft/50 border border-gold/25 hover:border-gold/50 transition-colors group/gift"
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-border-subtle shrink-0">
                    <img
                      src={review.giftImage}
                      alt={review.giftName}
                      className="w-full h-full object-cover group-hover/gift:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-gold uppercase tracking-wider font-semibold">Gifted Creation</p>
                    <p className="text-xs font-semibold text-text-main group-hover/gift:text-primary transition-colors truncate">
                      {review.giftName}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gold group-hover/gift:translate-x-0.5 transition-transform shrink-0 mr-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Row */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            <span>Find a Gift to Remember</span>
            <ArrowRight className="w-4 h-4 text-gold-light" />
          </Link>
          <Link
            href="/shop?sort=featured"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-surface-warm border border-gold/40 text-text-main hover:text-primary text-sm font-semibold transition-all duration-300 shadow-2xs hover:border-gold hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore All Favourites</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
