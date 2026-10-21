import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  Truck,
  ShieldCheck,
  Package,
  Clock,
  MapPin,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | DivijaArtHouse',
  description:
    'Learn about DivijaArtHouse shipping timelines, free delivery threshold above ₹999, courier partners, and PAN-India delivery across 19,000+ PIN codes.',
};

const POLICY_NAV = [
  { name: 'Shipping & Delivery', href: '/policies/shipping', active: true },
  { name: 'Returns & Replacements', href: '/policies/returns', active: false },
  { name: 'Privacy Policy', href: '/policies/privacy', active: false },
  { name: 'Terms of Service', href: '/policies/terms', active: false },
];

export default function ShippingPolicyPage() {
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
          <span className="text-text-main font-medium">Shipping Policy</span>
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
                <p className="font-semibold text-text-main">Need urgent delivery help?</p>
                <p>Reach out to support@divijaarthouse.com with your order number.</p>
              </div>
            </div>
          </aside>

          {/* Policy Content */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-border-subtle shadow-xs space-y-8">
            <div className="space-y-3 border-b border-border-subtle pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-soft text-primary text-xs font-semibold uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5" />
                <span>PAN-India Delivery</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-main">
                Shipping & Delivery Policy
              </h1>
              <p className="text-xs text-text-muted">
                Last updated: October 2026 &bull; Complies with Consumer Protection (E-Commerce) Rules
              </p>
            </div>

            {/* Quick Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-warm rounded-xl p-4 border border-border-subtle space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>4 &ndash; 7 Business Days</span>
                </div>
                <p className="text-xs text-text-muted">
                  Standard PAN-India doorstep delivery across 19,000+ pin codes.
                </p>
              </div>
              <div className="bg-surface-warm rounded-xl p-4 border border-border-subtle space-y-1">
                <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Free Over ₹999</span>
                </div>
                <p className="text-xs text-text-muted">
                  Orders of ₹999 and above qualify for 100% free standard shipping.
                </p>
              </div>
              <div className="bg-surface-warm rounded-xl p-4 border border-border-subtle space-y-1">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <Package className="w-4 h-4" />
                  <span>Flat ₹99 Below ₹999</span>
                </div>
                <p className="text-xs text-text-muted">
                  Nominal subsidized flat delivery rate on smaller single-stem orders.
                </p>
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                1. Order Processing & Crafting Timelines
              </h2>
              <p>
                Because each DivijaArtHouse floral arrangement is meticulously handcrafted
                from combed milk cotton yarn by our artisan network, each order goes through a
                rigorous pre-dispatch quality inspection.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>In-Stock Handcrafted Items:</strong> Dispatched from our Bangalore
                  studio within <strong>24 to 48 hours</strong> of order confirmation.
                </li>
                <li>
                  <strong>Custom & Personalized Items:</strong> May take an additional 24
                  hours for our craftswomen to weave your custom petal combinations or pen your
                  handwritten greeting notecards.
                </li>
                <li>
                  Orders placed on Sundays or gazetted public holidays are processed on the
                  subsequent working day.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                2. Shipping Rates & Thresholds
              </h2>
              <p>
                We believe in simple, transparent shipping with zero hidden processing charges at
                checkout:
              </p>
              <div className="border border-border-subtle rounded-xl overflow-hidden text-xs sm:text-sm">
                <div className="grid grid-cols-2 bg-surface-warm p-3 font-semibold text-text-main border-b border-border-subtle">
                  <span>Order Value</span>
                  <span>Shipping Fee</span>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-border-subtle">
                  <span>Orders ₹999 and above</span>
                  <span className="text-green-700 font-bold">FREE Shipping</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span>Orders under ₹999</span>
                  <span>₹99 Flat Standard Rate</span>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                3. Trusted Courier Partners & Tracking
              </h2>
              <p>
                We partner exclusively with India&apos;s leading insured express logistics
                providers, including <strong>Blue Dart</strong>, <strong>Delhivery</strong>,{' '}
                <strong>DTDC</strong>, and <strong>Xpressbees</strong>.
              </p>
              <p>
                As soon as your package is dispatched, you will receive an email confirmation
                containing your courier name, tracking number (AWB), and a direct tracking link.
                You can also enter your order number anytime on our{' '}
                <Link href="/track-order" className="text-primary hover:underline font-semibold">
                  Track Order
                </Link>{' '}
                portal to view live milestone updates.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                4. Safe Botanical Packaging Guarantee
              </h2>
              <p>
                Unlike fragile fresh flowers that bruise or dry flowers that crumble into dust,
                our handcrafted milk cotton crochet flowers are naturally resilient. However, to
                ensure bouquets arrive in pristine, bouquet-ready presentation, we pack each
                order in:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Heavy-gauge 5-ply corrugated crush-resistant outer shipping boxes.</li>
                <li>Moisture-resistant translucent Korean floral wrapping paper.</li>
                <li>Biodegradable air cushions or honeycomb craft paper buffers.</li>
                <li>Sealed tamper-evident outer tapes.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                5. Non-Delivery, Address Errors & Delays
              </h2>
              <p>
                Please ensure complete and accurate delivery addresses including house number,
                street name, landmarks, and correct 6-digit PIN codes. In case of unexpected
                weather disturbances, local festival curfews, or remote courier routing delays,
                our support desk will actively liaise with courier hubs to expedite delivery.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
