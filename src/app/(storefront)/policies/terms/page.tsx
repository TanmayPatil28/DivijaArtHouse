import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  FileCheck,
  Scale,
  Sparkles,
  IndianRupee,
  ShieldAlert,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | DivijaArtHouse',
  description:
    'Read the terms, conditions, and handmade craftsmanship acknowledgments for purchases on DivijaArtHouse.',
};

const POLICY_NAV = [
  { name: 'Shipping & Delivery', href: '/policies/shipping', active: false },
  { name: 'Returns & Replacements', href: '/policies/returns', active: false },
  { name: 'Privacy Policy', href: '/policies/privacy', active: false },
  { name: 'Terms of Service', href: '/policies/terms', active: true },
];

export default function TermsPolicyPage() {
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
          <span className="text-text-main font-medium">Terms of Service</span>
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
                <p className="font-semibold text-text-main">Questions about these terms?</p>
                <p>Email legal@divijaarthouse.com</p>
              </div>
            </div>
          </aside>

          {/* Policy Content */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-border-subtle shadow-xs space-y-8">
            <div className="space-y-3 border-b border-border-subtle pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-soft text-primary text-xs font-semibold uppercase tracking-wider">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Agreement & Terms</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-main">
                Terms of Service
              </h1>
              <p className="text-xs text-text-muted">
                Last updated: October 2026 &bull; Operates under laws of the Republic of India
              </p>
            </div>

            <p className="text-sm text-text-muted leading-relaxed">
              Welcome to <strong>DivijaArtHouse</strong>. By accessing our website, browsing our handcrafted catalog, or placing an order, you agree to be bound by the following Terms of Service. Please review them carefully.
            </p>

            {/* Section 1 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                1. Handmade Craftsmanship & Botanical Artistic Variations
              </h2>
              <div className="bg-surface-warm rounded-2xl p-5 border border-border-subtle space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-text-main">
                  The Nature of Hand-Crocheted Artwork
                </p>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Every floral arrangement, bouquet, potted plant, and hair accessory sold by DivijaArtHouse is handcrafted individually by independent women artisans using combed milk cotton yarn and wire armatures. Because no industrial machine is used, slight differences in yarn dye lots, petal curvature, stitch tightness, and finished bouquet dimensions (within 1 to 2 cm) are natural characteristics of artisanal work. These differences attest to genuine handmade authenticity and do not constitute defective merchandise.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-primary" />
                2. Pricing, Currencies & Payment Processing
              </h2>
              <p>
                All prices listed on DivijaArtHouse are displayed in <strong>Indian Rupees (INR)</strong> and are inclusive of all applicable statutory Goods and Services Taxes (GST).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  We accept prepaid digital payments via UPI, RuPay, Visa, MasterCard, and Net Banking processed through Razorpay.
                </li>
                <li>
                  Cash on Delivery (COD) is offered for select eligible pin codes across India with zero hidden checkout surcharges.
                </li>
                <li>
                  We reserve the right to revise catalog prices without prior notice; however, completed orders will always be honored at the price confirmed at the moment of checkout.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary" />
                3. Order Acceptance & Right of Cancellation
              </h2>
              <p>
                The receipt of an order confirmation does not signify our final acceptance of your order. DivijaArtHouse reserves the right at any time after receipt of your order to accept or decline it in the event of:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Sudden artisan yarn supply shortages or production incapacity.</li>
                <li>Identified pricing or typographical errors on the catalog.</li>
                <li>Suspected fraudulent activity or unauthorized payment attempts.</li>
                <li>Courier delivery unserviceability to remote or restricted areas.</li>
              </ul>
              <p>
                If an order is cancelled by us after payment authorization, a 100% full refund will be immediately issued to the original payment source.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" />
                4. Intellectual Property & Brand Ownership
              </h2>
              <p>
                All content published on this website — including the trademarked brand name <em>DivijaArtHouse</em>, our tagline <em>&ldquo;Little Blooms, Lasting Feelings&rdquo;</em>, product photographs, styling designs, crochet pattern arrangements, written stories, website code, and graphics — is the proprietary intellectual property of DivijaArtHouse. No content may be reproduced, re-distributed, cloned, or commercially exploited without prior written authorization.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                5. Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms of Service and any transactional agreements entered into with DivijaArtHouse shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts located in Bengaluru (Bangalore), Karnataka, India.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

