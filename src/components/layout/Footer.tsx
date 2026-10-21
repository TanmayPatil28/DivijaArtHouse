'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Mail,
  ArrowRight,
  ShieldCheck,
  Instagram,
  Facebook,
  MessageCircle,
} from 'lucide-react';
import { subscribeNewsletter } from '@/actions/newsletter';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const handleMiniSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus({ type: 'loading', message: '' });
    const formData = new FormData();
    formData.append('email', email);
    formData.append('source', 'footer');

    try {
      const res = await subscribeNewsletter(null, formData);
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Subscription failed. Please try again.',
      });
    }
  };

  return (
    <footer className="bg-footer text-gray-300 border-t border-neutral-800">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand Summary */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-bold tracking-tight text-white hover:text-blush transition-colors">
                DivijaArtHouse
              </span>
            </Link>
            <p className="text-xs font-serif italic text-blush">
              &ldquo;Little Blooms, Lasting Feelings.&rdquo;
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every petal, stem, and charming pot is lovingly hand-crocheted
              using fine cotton yarn. Everlasting floral art designed to preserve
              cherished moments without ever withering.
            </p>
            <div className="pt-2 text-xs text-gray-400 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
              <span>Handcrafted with pride in India</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore Collections
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white transition-colors"
                >
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/bouquets"
                  className="hover:text-white transition-colors"
                >
                  Everlasting Bouquets
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/jumbo-bouquets"
                  className="hover:text-white transition-colors"
                >
                  Jumbo Grand Bouquets
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/flower-pots"
                  className="hover:text-white transition-colors"
                >
                  Desk Flower Pots
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/gift-boxes"
                  className="hover:text-white transition-colors"
                >
                  Curated Gift Boxes
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/hair-accessories"
                  className="hover:text-white transition-colors"
                >
                  Floral Hair Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/character-gifts"
                  className="hover:text-white transition-colors"
                >
                  Amigurumi & Mascot Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  Our Artisan Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-white transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/returns"
                  className="hover:text-white transition-colors"
                >
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Access & Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Stay in Bloom
            </h3>
            <p className="text-sm text-gray-400">
              Receive artisan updates, new crochet bloom drops, and festive
              gifting ideas directly in your inbox.
            </p>

            {/* Newsletter mini form */}
            <form onSubmit={handleMiniSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blush pr-10"
                />
                <button
                  type="submit"
                  disabled={status.type === 'loading'}
                  className="absolute right-1 top-1 bottom-1 px-2.5 rounded-md bg-primary hover:bg-primary-hover text-white transition-colors flex items-center justify-center disabled:opacity-50"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {status.message && (
                <p
                  className={`text-xs ${
                    status.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors"
                  aria-label="DivijaArtHouse Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors"
                  aria-label="Contact via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors"
                  aria-label="DivijaArtHouse Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="mailto:care@divijaarthouse.com"
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors"
                  aria-label="Email Customer Support"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Payment Badges & Copyright Strip */}
      <div className="border-t border-neutral-800 bg-neutral-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} DivijaArtHouse. All rights reserved. Handcrafted with care in India.
          </p>

          {/* Payment method icons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-[11px] text-gray-400 mr-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              100% Secure Checkout:
            </span>

            {/* Razorpay Badge */}
            <div className="h-6 w-20 relative bg-neutral-800 rounded px-1 flex items-center justify-center border border-neutral-700 overflow-hidden" title="Razorpay">
              <Image
                src="/images/badges/razorpay.svg"
                alt="Razorpay"
                fill
                className="object-contain p-0.5"
              />
            </div>

            {/* UPI Badge */}
            <div className="h-6 w-14 relative bg-neutral-800 rounded px-1 flex items-center justify-center border border-neutral-700 overflow-hidden" title="UPI">
              <Image
                src="/images/badges/upi.svg"
                alt="UPI"
                fill
                className="object-contain p-0.5"
              />
            </div>

            {/* COD Badge */}
            <div className="h-6 w-14 relative bg-neutral-800 rounded px-1 flex items-center justify-center border border-neutral-700 overflow-hidden" title="Cash on Delivery">
              <Image
                src="/images/badges/cod.svg"
                alt="Cash on Delivery"
                fill
                className="object-contain p-0.5"
              />
            </div>

            {/* Secure Badge */}
            <div className="h-6 w-16 relative bg-neutral-800 rounded px-1 flex items-center justify-center border border-neutral-700 overflow-hidden" title="SSL Encrypted">
              <Image
                src="/images/badges/secure.svg"
                alt="SSL Encrypted"
                fill
                className="object-contain p-0.5"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
