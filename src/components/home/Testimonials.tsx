import React from 'react';
import { Star, Heart, MessageSquareQuote, ShieldAlert } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'I ordered the Blushing Peony bouquet for my mother’s 50th birthday. Two months later, it still sits prominently on her desk looking brand new. The texture of the cotton yarn is stunning.',
    author: 'Ananya S.',
    location: 'Bengaluru, Karnataka',
    product: 'Blushing Peony & Rose Bouquet',
    rating: 5,
  },
  {
    quote:
      'Finding thoughtful gifts that don’t end up in the dustbin after two days is so hard. Everlasting crochet flowers are such a creative, sustainable gift. The packaging arrived completely safe.',
    author: 'Kavita R.',
    location: 'Hyderabad, Telangana',
    product: 'Sweet Serenade Gift Box',
    rating: 5,
  },
  {
    quote:
      'The Barnaby Bear with Sunflower was the most wholesome anniversary surprise for my partner. Hand-stitched with so much care and attention to detail. 10/10 craftsmanship!',
    author: 'Rohan M.',
    location: 'Pune, Maharashtra',
    product: 'Barnaby The Bear Amigurumi',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section
      aria-label="Customer Testimonials"
      className="py-12 md:py-20 bg-surface-warm/40 border-b border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <Heart className="w-3.5 h-3.5 fill-primary" />
            <span>Community Impressions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-main">
            Loved by Thoughtful Gifters
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-2">
            Hear what early bloom recipients and handmade craft lovers say about our everlasting flowers.
          </p>

          {/* Transparent Notice */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border-subtle text-[11px] text-text-muted">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>
              Honest impressions placeholder — verified purchase reviews will be displayed as customer orders are fulfilled.
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-border-subtle shadow-sm flex flex-col justify-between hover:border-blush transition-colors"
            >
              <div>
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <MessageSquareQuote className="w-6 h-6 text-blush -mt-2 mb-1" />
                  <p className="text-sm text-text-main leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Author Info */}
              <div className="border-t border-border-subtle pt-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-text-main">{t.author}</p>
                  <p className="text-text-muted text-[11px]">{t.location}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-warm text-primary border border-border-subtle">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
