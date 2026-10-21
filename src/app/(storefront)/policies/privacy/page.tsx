import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  Lock,
  Shield,
  EyeOff,
  Database,
  FileText,
  UserCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | DivijaArtHouse',
  description:
    'Learn how DivijaArtHouse protects your privacy, personal data, and transaction security in compliance with the Indian IT Act 2000 and SPDI Rules.',
};

const POLICY_NAV = [
  { name: 'Shipping & Delivery', href: '/policies/shipping', active: false },
  { name: 'Returns & Replacements', href: '/policies/returns', active: false },
  { name: 'Privacy Policy', href: '/policies/privacy', active: true },
  { name: 'Terms of Service', href: '/policies/terms', active: false },
];

export default function PrivacyPolicyPage() {
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
          <span className="text-text-main font-medium">Privacy Policy</span>
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
                <p className="font-semibold text-text-main">Data Privacy Inquiries?</p>
                <p>Contact our Grievance Officer at privacy@divijaarthouse.com</p>
              </div>
            </div>
          </aside>

          {/* Policy Content */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-border-subtle shadow-xs space-y-8">
            <div className="space-y-3 border-b border-border-subtle pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-soft text-primary text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>SPDI Rules & IT Act Compliant</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-main">
                Privacy Policy
              </h1>
              <p className="text-xs text-text-muted">
                Last updated: October 2026 &bull; Complies with Information Technology Act, 2000 & SPDI Rules, 2011
              </p>
            </div>

            <p className="text-sm text-text-muted leading-relaxed">
              At <strong>DivijaArtHouse</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we deeply respect your personal privacy. This Privacy Policy details how we collect, handle, store, and safeguard your personal information when you visit or make a purchase from our website (<strong>divijaarthouse.com</strong>).
            </p>

            {/* Section 1 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                1. Information We Collect
              </h2>
              <p>When you interact with DivijaArtHouse, we may collect the following categories of information:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Contact & Order Details:</strong> Your full name, delivery address, billing address, email address, telephone/mobile number, and optional recipient gift notes.
                </li>
                <li>
                  <strong>Account Credentials:</strong> If you register an account, we store your email address and securely hashed authentication credentials via bcrypt.
                </li>
                <li>
                  <strong>Communication Records:</strong> Queries submitted through our contact form, customer support emails, or order feedback.
                </li>
                <li>
                  <strong>Technical Data:</strong> Browser type, IP address, and cookie identifiers used strictly to power your shopping session and cart state.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-700" />
                2. Zero Storage of Payment Card & Banking Data
              </h2>
              <div className="bg-surface-warm rounded-2xl p-5 border border-border-subtle space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-text-main">
                  Your Financial Security is Absolute
                </p>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  DivijaArtHouse <strong>NEVER collects, processes, or stores your credit card numbers, debit card numbers, CVVs, net-banking passwords, or UPI PINs</strong> on any of our servers. All digital payments are handled through PCI-DSS Level 1 compliant, RBI-authorized payment gateways (Razorpay). All communications are encrypted end-to-end via 256-bit SSL / TLS.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-primary" />
                3. No Sale or Commercial Rental of Your Data
              </h2>
              <p>
                We do not sell, rent, trade, or commercially monetize your personal contact information to any third-party marketing companies, advertisers, or data brokers.
              </p>
              <p>
                Your information is shared strictly with operational partners essential to fulfilling your orders:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Logistics and courier partners (e.g., Delhivery, Blue Dart) for doorstep parcel dispatch.</li>
                <li>Transactional email systems (Nodemailer / SMTP) to transmit your order receipt and tracking updates.</li>
                <li>Payment gateway infrastructure (Razorpay) for authorization of transactions.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                4. Cookies & Local Storage
              </h2>
              <p>
                We utilize essential browser cookies and local storage tokens to remember your shopping cart items across visits, keep you logged into your customer dashboard, and preserve your curated wishlist without requiring re-entry. You can disable cookies in your browser settings at any time, though some shopping functions may become limited.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 text-sm text-text-muted leading-relaxed">
              <h2 className="text-lg font-bold font-sans text-text-main flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                5. Statutory Grievance Redressal Officer
              </h2>
              <p>
                In accordance with the Information Technology Act 2000 and rules made thereunder, the contact details of the Grievance Officer for privacy and data inquiries are:
              </p>
              <div className="bg-surface-warm rounded-xl p-4 border border-border-subtle text-xs sm:text-sm space-y-1">
                <p><strong>Officer:</strong> Grievance Redressal Cell &ndash; DivijaArtHouse</p>
                <p><strong>Address:</strong> Handcrafted Bloom Studio, Indiranagar, Bangalore, Karnataka 560038, India</p>
                <p><strong>Email:</strong> privacy@divijaarthouse.com / support@divijaarthouse.com</p>
                <p><strong>Phone:</strong> +91 98765 43210 (Mon–Fri, 10 AM to 6 PM IST)</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

