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
    'Get in touch with the DivijaArtHouse studio in Hadapsar, Pune. Connect with us for custom crochet bouquet orders, bulk gifting inquiries, delivery support, or artisan collaborations.',
  openGraph: {
    title: 'Contact DivijaArtHouse | Studio Support & Inquiries',
    description:
      'Have a question about our handcrafted everlasting flowers? Reach out to our Pune craft studio. We reply within 24 business hours.',
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
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-main font-medium">Contact Us</span>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-surface-warm via-canvas to-canvas border-b border-border-subtle py-12 md:py-16 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-gold/40 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>WE ARE HERE TO HELP</span>
          </div>
          <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight">
            Get in Touch With Our Studio
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
            Have a question about a handcrafted bouquet, bespoke color customization, or an existing order? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-border-subtle p-6 sm:p-10 shadow-sm">
            <div className="mb-6">
              <h2 className="font-semibold text-xl sm:text-2xl text-text-main tracking-tight">
                Send Us a Note
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Fill in the details below and our artisan studio team will reply within 24 business hours.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* Right Column: Studio Information & Direct Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-warm rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6">
              <h2 className="font-semibold text-lg text-text-main tracking-tight border-b border-border-subtle pb-3">
                Studio Channels
              </h2>

              <div className="space-y-5">
                {/* Email Channel */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center flex-shrink-0 shadow-xs border border-border-subtle">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Email Inquiries
                    </p>
                    <a
                      href="mailto:care@divijaarthouse.com"
                      className="font-semibold text-text-main hover:text-primary transition-colors text-base"
                    >
                      care@divijaarthouse.com
                    </a>
                    <p className="text-xs text-text-muted mt-0.5">
                      Replies typically within 24 business hours
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
                      href="https://wa.me/919209284423"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-text-main hover:text-primary transition-colors text-base"
                    >
                      +91 92092 84423
                    </a>
                    <p className="text-xs text-text-muted mt-0.5">
                      Mon–Sat for custom orders & urgent updates
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
                      10:00 AM &ndash; 7:00 PM IST (Closed on Sundays)
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
                      Divija Art & Craft Studio
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      Hadapsar, Pune, Maharashtra 411028, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Track Order Card */}
            <div className="bg-blush-soft/60 rounded-3xl p-6 border border-gold/40 space-y-3">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Looking to track an existing order?
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                You can view real-time courier status and dispatch milestones anytime on our tracking portal.
              </p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover"
              >
                <span>Go to Tracking Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions Section */}
        <div className="mt-16 md:mt-24 pt-12 border-t border-border-subtle">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <HelpCircle className="w-3.5 h-3.5 text-gold" />
              <span>FREQUENT QUESTIONS</span>
            </div>
            <h2 className="font-semibold text-2xl sm:text-3xl text-text-main tracking-tight">
              Before You Reach Out
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Here are answers to the questions we receive most often about ordering, custom stems, and deliveries across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-xs hover:border-gold/40 transition-colors space-y-2"
              >
                <h3 className="font-semibold text-sm sm:text-base text-text-main">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
