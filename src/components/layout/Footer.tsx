'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Instagram,
  PackageSearch,
} from 'lucide-react';

interface FooterProps {
  identity?: {
    storeName?: string;
    tagline?: string;
    supportEmail?: string;
    supportPhone?: string;
    whatsappNumber?: string;
    location?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    pinterestUrl?: string;
  };
}

export function Footer({ identity }: FooterProps = {}) {
  const currentYear = new Date().getFullYear();
  const phone = identity?.supportPhone || '+91 92092 84423';
  const email = identity?.supportEmail || 'care@divijaarthouse.com';
  const location = identity?.location || 'Hadapsar, Pune, Maharashtra 411028, India';
  const whatsapp = identity?.whatsappNumber || '+91 92092 84423';
  const cleanWaNumber = whatsapp.replace(/[^\d]/g, '');
  const instagram = identity?.instagramUrl || 'https://instagram.com/divijaarthouse';

  return (
    <footer className="bg-footer text-gray-300 border-t border-gold/25 relative overflow-hidden">
      {/* Subtle Atelier Ambient Glow */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(197,154,90,0.06),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 w-80 h-80 bg-[radial-gradient(circle,rgba(120,29,44,0.08),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main 4-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Atelier Heritage & Brand Anchor (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-semibold tracking-tight text-white group-hover:text-gold transition-colors">
                  Divija Art House
                </span>
                <Heart className="w-4 h-4 text-primary fill-primary flex-shrink-0 animate-pulse" />
              </div>
            </Link>

            <p className="font-serif italic text-xs tracking-wider text-gold font-medium">
              Festive traditions crafted to stay forever.
            </p>

            <p className="text-sm text-gray-400 leading-relaxed pr-2">
              Artisanal Kundan OHP rangolis, plush woolen floor art, sculpted pipe cleaner florals, and keepsake decor. Handcrafted piece by piece by talented women artisans in Pune.
            </p>

            {/* Artisan Pride Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-gold/20 text-[11px] text-[#E8D5B7]">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>100% Handcrafted by Women Artisans</span>
            </div>

            {/* Direct Studio Location & Phone */}
            <div className="pt-2 space-y-2 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="hover:text-gold transition-colors font-medium text-gray-300 font-sans not-italic tabular-nums"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Boutique Catalogue (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
              <span>Artisan Catalogue</span>
              <span className="h-px flex-1 bg-gold/20"></span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/collections/ohp-sheets-rangoli"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/40"></span>
                  OHP Sheets Rangoli
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/30 text-blush border border-primary/40 font-medium ml-1">
                    Signature
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/woolen-rangoli"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/40"></span>
                  Woolen Rangoli
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/pipe-cleaner-crafts"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/40"></span>
                  Pipe Cleaner Crafts
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/decore-crafts"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/40"></span>
                  Decore Crafts
                </Link>
              </li>
              <li className="pt-1.5">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-white transition-colors uppercase tracking-wider"
                >
                  <span>Explore All 4 Crafts</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Care & Assurance (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
              <span>Client Care</span>
              <span className="h-px flex-1 bg-gold/20"></span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  <PackageSearch className="w-3.5 h-3.5 text-gold/80" />
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  Our Atelier Story
                </Link>
              </li>
              <li>
                <Link
                  href="/about#care"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  Rangoli &amp; Craft Care
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  Shipping & Dispatch
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/returns"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  Returns & Guarantee
                </Link>
              </li>
              <li>
                <Link
                  href="/contact?subject=bespoke-corporate-gifting"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  Bespoke & Bulk Gifting
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gray-300"
                >
                  Contact Atelier
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Elevated Concierge & WhatsApp Assistance Card (Span 3) */}
          <div className="lg:col-span-3">
            <div className="bg-[#2E1A19]/90 border border-gold/35 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group">
              {/* Corner Gold Ambient Accent */}
              <div
                className="absolute -top-10 -right-10 w-24 h-24 bg-gold/15 rounded-full blur-xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Status Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Gifting Concierge
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Replies in ~15m
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Need a bespoke bouquet, custom colorway, or express Pune dispatch? Chat directly with our head artisan.
              </p>

              {/* 1-Click WhatsApp Button */}
              <a
                href={`https://wa.me/${cleanWaNumber}?text=Hi%20Divija%20Art%20House%2C%20I%20would%20like%20to%20inquire%20about%20a%20handcrafted%20bouquet`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs tracking-wide shadow-md transition-all duration-200 active:scale-95 group/wa"
                aria-label={`Chat with Head Artisan on WhatsApp (${whatsapp})`}
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366] group-hover/wa:scale-110 transition-transform" />
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
              </a>

              {/* Operating Hours */}
              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-3 pt-3 border-t border-gold/15">
                <Clock className="w-3 h-3 text-gold/80 flex-shrink-0" />
                <span>Mon – Sat: 10:00 AM – 8:00 PM IST</span>
              </div>

              {/* Direct Social Channels */}
              <div className="mt-3 pt-3 border-t border-gold/15 flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-400">
                  Follow Our Craft:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-primary border border-white/10 text-gray-300 hover:text-white transition-all"
                    aria-label="Divija Art House Instagram"
                    title="Instagram"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${cleanWaNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-[#25D366] border border-white/10 text-gray-300 hover:text-white transition-all"
                    aria-label="Direct WhatsApp Message"
                    title="WhatsApp Helpline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-gold border border-white/10 text-gray-300 hover:text-neutral-900 transition-all"
                    aria-label="Email Studio Care"
                    title={`Email ${email}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Consolidated Luxury Sub-Footer Bar */}
      <div className="border-t border-gold/15 bg-[#160B0A] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
            
            {/* Left: Studio Copyright & Artisan Origin */}
            <div className="text-xs text-gray-400 order-3 lg:order-1">
              <span>© {currentYear} Divija Art House. All rights reserved. Handcrafted with heart in Hadapsar, Pune.</span>
            </div>

            {/* Center: Quiet Inline Legal Policies */}
            <nav
              aria-label="Legal & Policies"
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400 order-1 lg:order-2"
            >
              <Link
                href="/policies/privacy"
                className="hover:text-gold transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600 text-[10px]" aria-hidden="true">•</span>
              <Link
                href="/policies/terms"
                className="hover:text-gold transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-gray-600 text-[10px]" aria-hidden="true">•</span>
              <Link
                href="/policies/shipping"
                className="hover:text-gold transition-colors"
              >
                Shipping & Delivery
              </Link>
              <span className="text-gray-600 text-[10px]" aria-hidden="true">•</span>
              <Link
                href="/policies/returns"
                className="hover:text-gold transition-colors"
              >
                Returns & Refunds
              </Link>
            </nav>

            {/* Right: Refined Payment Trust Seals */}
            <div className="flex flex-wrap items-center justify-center gap-2 order-2 lg:order-3">
              <span className="text-[11px] text-gray-400 mr-1 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>100% Secure Checkout:</span>
              </span>

              {/* Razorpay Badge */}
              <div
                className="h-6 w-20 relative bg-neutral-900/90 rounded px-1.5 flex items-center justify-center border border-white/10 shadow-sm overflow-hidden"
                title="Razorpay Secure"
              >
                <Image
                  src="/images/badges/razorpay.svg"
                  alt="Razorpay"
                  fill
                  unoptimized
                  className="object-contain p-0.5"
                />
              </div>

              {/* UPI Badge */}
              <div
                className="h-6 w-14 relative bg-neutral-900/90 rounded px-1.5 flex items-center justify-center border border-white/10 shadow-sm overflow-hidden"
                title="UPI (Google Pay, PhonePe, Paytm)"
              >
                <Image
                  src="/images/badges/upi.svg"
                  alt="UPI"
                  fill
                  unoptimized
                  className="object-contain p-0.5"
                />
              </div>

              {/* COD Badge */}
              <div
                className="h-6 w-14 relative bg-neutral-900/90 rounded px-1.5 flex items-center justify-center border border-white/10 shadow-sm overflow-hidden"
                title="Cash on Delivery Available"
              >
                <Image
                  src="/images/badges/cod.svg"
                  alt="Cash on Delivery"
                  fill
                  unoptimized
                  className="object-contain p-0.5"
                />
              </div>

              {/* Secure SSL Badge */}
              <div
                className="h-6 w-16 relative bg-neutral-900/90 rounded px-1.5 flex items-center justify-center border border-white/10 shadow-sm overflow-hidden"
                title="256-Bit SSL Encrypted"
              >
                <Image
                  src="/images/badges/secure.svg"
                  alt="256-Bit SSL Encrypted"
                  fill
                  unoptimized
                  className="object-contain p-0.5"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
