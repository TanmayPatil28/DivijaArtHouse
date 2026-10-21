import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  RotateCcw,
  Video,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & Replacement Policy | DivijaArtHouse',
  description:
    'Read our return, replacement, and cancellation guidelines for handcrafted crochet flowers. Clear, fair policies on transit damage and personalized gifts.',
};

const POLICY_NAV = [
  { name: 'Shipping & Delivery', href: '/policies/shipping', active: false },
  { name: 'Returns & Replacements', href: '/policies/returns', active: true },
  { name: 'Privacy Policy', href: '/policies/privacy', active: false },
  { name: 'Terms of Service', href: '/policies/terms', active: false },
];

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-canvas min-h-screen">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-surface-warm border-b border-border-subtle py-3 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto flex items-center space-x-2 text-xs sm:text-sm text-text-muted">
          <Link
            href="/"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-text-muted">Policies</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-text-main font-medium">Returns & Replacements</span>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Policy Navigation Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface-warm rounded-2xl p-5 border border-border-subtle space-y-2 sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 px-3">
                Legal & Customer Policies
              </h3>
              <nav className="space-y-1">
                {POLICY_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-text-main hover:bg-white/80 hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-border-subtle/80 px-3 space-y-2 text-xs text-text-muted">
                <p className="font-semibold text-text-main">Need to report damaged delivery?</p>
                <p>Email support@divijaarthouse.com with your unboxing video.</p>
              </div>
            </div>
          </aside>

          {/* Policy Content */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-border-subtle shadow-xs space-y-8">
            <div className="space-y-3 border-b border-border-subtle pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-soft text-primary text-xs font-semibold uppercase tracking-wider">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Handcrafted Guarantee</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-main">
                Returns & Replacement Policy
              </h1>
              <p className="text-xs text-text-muted">
                Last updated: October 2026 &bull; Complies with Consumer Protection Act 2019
              </p>
            </div>

            {/* Core Principle Notice */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2 text-amber-900 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Handmade Craftsmanship Notice
              </div>
              <p className="leading-relaxed">
                Every floral piece at DivijaArtHouse is individually crocheted by hand by Indian
                women crafters. As with all genuine handmade art, slight variations in petal
                curl, stitch tension, or exact dimensions (1–2 cm) are natural signatures of
                human work, not defects. We take immense pride in delivering pieces that exceed
                your expectations.
              </p>
            </div>

            {/* Section 1 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                1. Transit Damage & Free Replacement Policy
              </h2>
              <p>
                In the rare event that your package is damaged during courier transit, or if
                you receive an incorrect product, we offer a{' '}
                <strong className="text-text-main">100% Free Replacement</strong>.
              </p>
              <div className="bg-surface-warm rounded-xl p-5 border border-border-subtle space-y-3 text-xs sm:text-sm">
                <p className="font-bold text-text-main flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  Mandatory Unboxing Video Requirement:
                </p>
                <p>
                  To protect both our artisan crafters and you from courier mishandling claims, an
                  <strong> unedited, continuous 360-degree unboxing video</strong> recorded from the
                  moment the outer shipping parcel is cut open until the item is inspected is
                  required.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The outer shipping label and AWB must be clearly visible.</li>
                  <li>The video must show the condition of the outer seal prior to opening.</li>
                  <li>Must be reported within <strong>48 hours</strong> of courier delivery.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                2. Non-Returnable Items
              </h2>
              <p>Due to the bespoke and hygienic nature of our handcrafted gifting collections, the following items are non-returnable and non-exchangeable once delivered in sound condition:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Personalized Orders:</strong> Items accompanied by custom handwritten or printed greeting cards, or bouquets crafted with customized color requests.
                </li>
                <li>
                  <strong>Floral Hair Accessories:</strong> Hairpins, hair clips, and headbands for personal hygiene reasons once unsealed.
                </li>
                <li>
                  <strong>Items Damaged by Improper Handling:</strong> Damage resulting from immersion in water, exposure to fire/perfume sprays, or violent tugging of delicate yarn threads after delivery.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                3. Order Cancellation Policy
              </h2>
              <p>
                We understand that plans can change. You may cancel your order according to the following windows:
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Before Dispatch (Within 12 Hours):</strong> 100% full refund with zero cancellation fees. Contact us immediately at support@divijaarthouse.com with your Order Number (e.g. DAH-2026-XXXXXX).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>After Dispatch:</strong> Once handed over to the courier partner, an order cannot be cancelled in transit. If rejected at doorstep without defect, return freight charges of ₹150 will be deducted from any refund.
                  </span>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                4. Refund Processing & Mode of Payment
              </h2>
              <p>
                For approved cancellations or replacement unavailability:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Prepaid Orders (Razorpay):</strong> Refunds are credited back to the original source account (UPI, credit/debit card, or net banking) within <strong>5–7 business days</strong> as per standard banking cycles.
                </li>
                <li>
                  <strong>Cash on Delivery (COD) Orders:</strong> In case of an approved return of a COD parcel, refunds are processed via NEFT / UPI transfer upon verification of bank details provided by the customer.
                </li>
              </ul>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
