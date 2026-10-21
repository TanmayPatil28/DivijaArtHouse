import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  Mail,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — DivijaArtHouse Handcrafted Blooms & Support',
  description:
    'Get in touch with the DivijaArtHouse studio. Connect with us for custom crochet bouquet orders, bulk gifting inquiries, delivery support, or artisan collaborations.',
  openGraph: {
    title: 'Contact DivijaArtHouse | Studio Support & Inquiries',
    description:
      'Have a question about our handcrafted everlasting flowers? Reach out to our Bangalore design studio. We reply within 24 business hours.',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Can I request a custom crochet flower bouquet or specific color scheme?',
    a: 'Absolutely! Our Indian women artisans love bringing custom concepts to life. Send us a message using the form above with your preferred flowers (e.g. lavender, sunflowers, peonies) and desired colors. We will get back to you with timelines and bespoke options.',
  },
  {
    q: 'How long does delivery take across India?',
    a: 'Orders are carefully packaged and dispatched within 24–48 hours. Standard courier transit takes 4–7 business days PAN-India. We provide a live tracking number via email as soon as your parcel ships.',
  },
  {
    q: 'Can I send a personalized greeting card with my gift?',
    a: 'Yes! On every product detail page and during checkout, you can add free custom greeting card text. We handwrite or print your heartfelt message on our signature floral notecards.',
  },
  {
    q: 'Do you accept corporate gifting, wedding favors, or bulk orders?',
    a: 'Yes, we specialize in memorable, sustainable everlasting favors for weddings, baby showers, and corporate milestones. Please select "Bulk, Wedding, or Corporate Gifting" in the form for custom volume pricing.',
  },
];

export default function ContactPage() {
  return (
    <div className="bg-canvas min-h-screen">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-surface-warm border-b border-border-subtle py-3 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs sm:text-sm text-text-muted">
          <Link
            href="/"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-text-main font-medium">Contact & Support</span>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-surface-warm via-canvas to-canvas border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-soft text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>We&apos;re Here to Help</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-main tracking-tight">
            Get in Touch with Our Studio
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            Have a question about your order, want to arrange a bespoke floral
            gift, or just want to know more about our yarn craft? Our team is always
            happy to assist.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Info + Form */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Info Side (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-warm rounded-3xl p-6 sm:p-8 border border-border-subtle space-y-6 shadow-sm">
              <h2 className="text-xl font-display font-bold text-text-main">
                Studio Information
              </h2>

              <div className="space-y-5 text-sm">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center flex-shrink-0 shadow-xs border border-border-subtle">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Email Inquiries
                    </p>
                    <a
                      href="mailto:support@divijaarthouse.com"
                      className="font-semibold text-text-main hover:text-primary transition-colors text-base"
                    >
                      support@divijaarthouse.com
                    </a>
                    <p className="text-xs text-text-muted mt-0.5">
                      Response within 24 business hours
                    </p>
                  </div>
                </div>

                {/* WhatsApp & Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-green-700 flex items-center justify-center flex-shrink-0 shadow-xs border border-border-subtle">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      WhatsApp & Helpline
                    </p>
                    <a
                      href="tel:+919876543210"
                      className="font-semibold text-text-main hover:text-primary transition-colors text-base"
                    >
                      +91 98765 43210
                    </a>
                    <p className="text-xs text-text-muted mt-0.5">
                      Mon–Sat for urgent order updates
                    </p>
                  </div>
                </div>

                {/* Studio Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-amber-700 flex items-center justify-center flex-shrink-0 shadow-xs border border-border-subtle">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Studio Hours
                    </p>
                    <p className="font-semibold text-text-main text-sm sm:text-base">
                      Monday &ndash; Saturday
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      10:00 AM &ndash; 7:00 PM IST (Closed on Sundays & National Holidays)
                    </p>
                  </div>
                </div>

                {/* Studio Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center flex-shrink-0 shadow-xs border border-border-subtle">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Design Studio & Workshop
                    </p>
                    <p className="text-sm font-semibold text-text-main">
                      DivijaArtHouse Studio
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      Handcrafted Bloom Studio, Indiranagar, Bangalore, Karnataka 560038, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Track Order Card */}
            <div className="bg-blush-soft/60 rounded-3xl p-6 border border-primary/20 space-y-3">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Looking to track an existing order?
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                You can view real-time courier status and dispatch milestones anytime on our tracking portal.
              </p>
              <Link
                href="/track-order"
                className="inline-flex items-center text-xs font-bold text-primary hover:underline gap-1 pt-1"
              >
                Go to Order Tracking &rarr;
              </Link>
            </div>
          </div>

          {/* Form Side (Col 7) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Snippet */}
      <section className="py-16 bg-surface-warm border-t border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Common Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-main">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-text-muted">
              Quick answers about our handmade flowers, orders, and shipping.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-border-subtle shadow-xs space-y-2"
              >
                <h3 className="text-base font-bold text-text-main font-display">
                  {faq.q}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-text-muted">
              Have more questions? Review our{' '}
              <Link
                href="/policies/shipping"
                className="text-primary hover:underline font-semibold"
              >
                Shipping Policy
              </Link>{' '}
              and{' '}
              <Link
                href="/policies/returns"
                className="text-primary hover:underline font-semibold"
              >
                Return Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
