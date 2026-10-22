'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'custom-orders',
    category: 'Custom Craft',
    question: 'Can I request a custom crochet bouquet or specific color palette?',
    answer: (
      <span>
        Absolutely! Our skilled women artisans in Hadapsar, Pune love bringing custom concepts to life. You can request specific flowers (such as velvet roses, cheerful sunflowers, delicate daisies, or soothing lavender), bespoke wedding palettes, or personalized stem arrangements. Simply choose <strong>&ldquo;Custom Bouquet / Color Request&rdquo;</strong> in the form above or message our studio directly on WhatsApp.
      </span>
    ),
  },
  {
    id: 'delivery-timelines',
    category: 'Pan-India Delivery',
    question: 'How long does handcrafted preparation and delivery take across India?',
    answer: (
      <span>
        Ready-to-ship catalog bouquets and flower pots are dispatched within <strong>24–48 hours</strong>. Custom stem orders require 3–5 days of careful hand-crocheting. Express courier delivery takes <strong>4–7 business days</strong> across all pin codes in India. Live tracking information is sent to your email and phone as soon as your parcel is dispatched.
      </span>
    ),
  },
  {
    id: 'gift-cards',
    category: 'Artisan Gifting',
    question: 'Can I include a complimentary handwritten greeting card with my gift?',
    answer: (
      <span>
        Yes, every arrangement includes a <strong>complimentary premium textured linen notecard</strong>. You can enter your heartfelt message on any product page or in your shopping bag. Our florists handwrite your note in elegant ink and tuck it securely inside the gift box before finishing it with our signature velvet ribbon.
      </span>
    ),
  },
  {
    id: 'bulk-weddings',
    category: 'Corporate & Bulk',
    question: 'Do you accept wedding favors, baby shower gifts, or corporate bulk orders?',
    answer: (
      <span>
        Yes! Handcrafted everlasting florals are a zero-wilting, sustainable keepsake for weddings, corporate gifting, festive Diwali hampers, and baby showers. We provide tiered volume discounts and bespoke packaging. Select <strong>&ldquo;Bulk, Wedding, or Corporate Gifting&rdquo;</strong> above for our dedicated corporate brochure and quotation.
      </span>
    ),
  },
  {
    id: 'flower-care',
    category: 'Care & Longevity',
    question: 'How do I care for my handcrafted crochet flowers?',
    answer: (
      <span>
        Our flowers are crafted from premium 100% combed milk cotton yarn and require <strong>zero watering, zero pruning, and zero sunlight</strong>. If dust gathers over time, simply brush the petals gently with a soft dry makeup brush or use a hair dryer on the cool, low setting for 10 seconds.
      </span>
    ),
  },
  {
    id: 'studio-visits',
    category: 'Pune Atelier',
    question: 'Where is your craft studio located, and can I visit in person?',
    answer: (
      <span>
        Our design studio and master artisan workshop is based in <strong>Hadapsar, Pune, Maharashtra 411028</strong>. While our complete collection is accessible online with pan-India courier delivery, studio visits and order pick-ups are welcome by appointment from Monday to Saturday, 10:00 AM &ndash; 7:00 PM IST.
      </span>
    ),
  },
];

export function ContactFAQAccordion() {
  const [openId, setOpenId] = useState<string | null>('custom-orders');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Accordion Stack */}
      <div className="space-y-3">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={cn(
                'rounded-2xl border transition-all duration-200 overflow-hidden bg-white',
                isOpen
                  ? 'border-gold/60 shadow-md ring-1 ring-gold/20'
                  : 'border-border-subtle hover:border-gold/40 shadow-xs'
              )}
            >
              <button
                type="button"
                id={`faq-trigger-${faq.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${faq.id}`}
                onClick={() => toggleItem(faq.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 transition-colors select-none"
              >
                <div className="space-y-1 pr-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                    {faq.category}
                  </span>
                  <h3 className="font-semibold text-sm sm:text-base text-text-main leading-snug">
                    {faq.question}
                  </h3>
                </div>

                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200',
                    isOpen
                      ? 'bg-primary text-white border-primary rotate-180 shadow-xs'
                      : 'bg-surface-canvas text-text-muted border-border-subtle'
                  )}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div
                  id={`faq-content-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-gold/15 bg-[#FAF6F1]/40 animate-in fade-in-0 duration-150"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions? Concierge Ribbon */}
      <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-[#FAF6F1] via-white to-[#F7ECEE] border border-gold/35 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>Still Have A Question?</span>
          </div>
          <h4 className="font-semibold text-base text-text-main tracking-tight">
            Our Pune studio team is always here for you.
          </h4>
          <p className="text-xs text-text-muted">
            Connect directly on WhatsApp for real-time advice on floral colors, milestone delivery, or custom orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://wa.me/919209284423?text=Hi%20Divija%20Art%20House%2C%20I%20have%20a%20question%20about%20your%20handcrafted%20crochet%20flowers..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1EBE5D] shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-text-main bg-white hover:bg-surface-warm border border-border-subtle shadow-2xs transition-colors"
          >
            <span>View Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
