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
  ArrowRight,
} from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactFAQAccordion } from '@/components/contact/ContactFAQAccordion';
import { ContactQuickTracker } from '@/components/contact/ContactQuickTracker';

export const metadata: Metadata = {
  title: 'Contact Us — DivijaArtHouse Handcrafted Blooms & Concierge',
  description:
    'Get in touch with the DivijaArtHouse studio in Hadapsar, Pune. Connect with our gifting concierge for custom crochet bouquet orders, bulk corporate gifting, and live dispatch updates.',
  openGraph: {
    title: 'Contact DivijaArtHouse | Studio Concierge & Inquiries',
    description:
      'Connect with our Pune floral craft studio for bespoke crochet blooms, wedding favors, and customer support.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Breadcrumb Navigation Bar */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 border-b border-border-subtle"
      >
        <div className="flex items-center gap-2 text-xs text-text-muted">
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
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            eyebrow="We Are Here To Help"
            eyebrowSuffix="Pune Atelier"
            titleLead="Get in touch with"
            titleAccent="our studio."
            description="Have a question about a handcrafted bouquet, bespoke color customization, or an existing order? We'd love to hear from you."
            align="center"
            headingTag="h1"
            size="xl"
          />
        </div>
      </div>

      {/* Main 12-Column Inquiry & Concierge Suite */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Seamless Interactive Contact Form (No double-box!) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Atelier Gifting Concierge & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Atelier Concierge Card */}
            <div className="bg-white rounded-3xl border border-gold/30 p-6 sm:p-8 space-y-6 shadow-md">
              <div className="border-b border-gold/15 pb-4 space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs font-sans not-italic tabular-nums">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Studio Open • 10:00 AM – 7:00 PM IST</span>
                </div>
                <h2 className="font-semibold text-lg sm:text-xl text-text-main tracking-tight">
                  Atelier Gifting Concierge
                </h2>
                <p className="text-xs text-text-muted">
                  Direct connection with our Hadapsar florists &amp; order specialists.
                </p>
              </div>

              {/* 1-Click WhatsApp Concierge Button */}
              <a
                href="https://wa.me/919209284423?text=Hi%20Divija%20Art%20House%2C%20I%20would%20like%20to%20inquire%20about%20a%20handcrafted%20floral%20order..."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1EBE5D] text-white flex items-center justify-between gap-3 shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all group select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-2xs">
                    <MessageCircle className="w-5 h-5 fill-white text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                      <span>Chat on WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-[11px] text-white/90 font-medium mt-0.5">
                      Instant advice on colors &amp; custom orders
                    </p>
                  </div>
                </div>
              </a>

              {/* Channel Details Grid */}
              <div className="space-y-3.5 pt-1">
                {/* Email Channel */}
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-surface-canvas/60 border border-gold/20 hover:border-gold/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center shrink-0 shadow-2xs border border-border-subtle mt-0.5">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      Email Inquiries
                    </p>
                    <a
                      href="mailto:care@divijaarthouse.com"
                      className="font-semibold text-text-main hover:text-primary transition-colors text-xs sm:text-sm truncate block"
                    >
                      care@divijaarthouse.com
                    </a>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Replies typically within 24 business hours
                    </p>
                  </div>
                </div>

                {/* Helpline Phone */}
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-surface-canvas/60 border border-gold/20 hover:border-gold/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center shrink-0 shadow-2xs border border-border-subtle mt-0.5">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      Studio Phone &amp; Helpline
                    </p>
                    <a
                      href="tel:+919209284423"
                      className="font-semibold text-text-main hover:text-primary transition-colors text-xs sm:text-sm font-sans not-italic tabular-nums block"
                    >
                      +91 92092 84423
                    </a>
                    <p className="text-[11px] text-text-muted mt-0.5 font-sans not-italic tabular-nums">
                      Mon–Sat: 10:00 AM – 7:00 PM IST
                    </p>
                  </div>
                </div>

                {/* Workshop Location */}
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-surface-canvas/60 border border-gold/20 hover:border-gold/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center shrink-0 shadow-2xs border border-border-subtle mt-0.5">
                    <MapPin className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      Design Studio &amp; Workshop
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-text-main">
                      Divija Art &amp; Craft Studio
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5 font-sans not-italic tabular-nums leading-relaxed">
                      Hadapsar, Pune, Maharashtra 411028, India
                    </p>
                    <a
                      href="https://maps.google.com/?q=Hadapsar,+Pune,+Maharashtra+411028"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Track Order Card */}
            <div className="bg-[#FAF6F1] rounded-3xl p-6 border border-gold/35 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Looking to track an existing order?</span>
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Enter your DAH order number below to check real-time courier dispatch status and express transit milestones.
              </p>
              <ContactQuickTracker />
              <div className="pt-0.5">
                <Link
                  href="/track-order"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover"
                >
                  <span>Open full tracking portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions Section (Single-Column Interactive Accordion) */}
        <div className="mt-16 md:mt-24 pt-12 border-t border-gold/20">
          <SectionHeader
            eyebrow="Frequent Questions"
            titleLead="Answers Before You"
            titleAccent="Reach Out."
            description="Here are answers to the questions we receive most often about custom bouquets, delivery timelines, and artisan gift wrapping."
            align="center"
            size="lg"
          />

          <ContactFAQAccordion />
        </div>
      </div>
    </div>
  );
}
