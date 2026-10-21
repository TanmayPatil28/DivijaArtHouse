import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, PackageSearch } from 'lucide-react';
import { OrderTracker } from '@/components/tracking/OrderTracker';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Track Your Order | DivijaArtHouse Handcrafted Blooms',
  description:
    'Track the real-time crafting, dispatch, and delivery status of your handcrafted crochet flower order across India.',
  openGraph: {
    title: 'Track Your Order | DivijaArtHouse',
    description:
      'Enter your DAH order number to follow your handcrafted bouquet from yarn stitch to doorstep delivery.',
    type: 'website',
  },
};

interface TrackOrderPageProps {
  searchParams: {
    orderNumber?: string;
  };
}

export default function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const initialOrderNumber = searchParams.orderNumber || '';

  return (
    <div className="bg-canvas min-h-screen pb-16">
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
          <span className="text-text-main font-medium">Track Order</span>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="py-10 md:py-14 bg-gradient-to-b from-surface-warm via-canvas to-canvas border-b border-border-subtle mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-soft text-primary text-xs font-semibold uppercase tracking-wider">
            <PackageSearch className="w-3.5 h-3.5" />
            <span>Real-Time Order Tracking</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-main tracking-tight">
            Follow Your Everlasting Blooms
          </h1>

          <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
            Enter your order number below to check the real-time crafting,
            packaging, and express courier status of your parcel.
          </p>
        </div>
      </section>

      {/* Tracker Component Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OrderTracker initialOrderNumber={initialOrderNumber} />
      </div>
    </div>
  );
}
