'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Loader2,
  Package,
  Sparkles,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MapPin,
  Calendar,
  CreditCard,
  XCircle,
  ArrowRight,
  Copy,
  Check,
  HelpCircle,
  Clock,
  ShieldCheck,
  HeartHandshake,
  MessageCircle,
  X,
  RefreshCw,
  SearchX,
} from 'lucide-react';
import { trackOrder, type SanitizedOrderTracking } from '@/actions/tracking';
import { formatINR, formatDate } from '@/lib/utils';

interface OrderTrackerProps {
  initialOrderNumber?: string;
}

// 5 Artisanal Milestones for Handcrafted Rangolis & Keepsake Crafts
const STEPS = [
  {
    step: 1,
    title: 'Order Placed',
    stageLabel: 'Studio Confirmed',
    description: 'Order registered & verified in our atelier system',
    icon: Package,
  },
  {
    step: 2,
    title: 'Order Confirmed',
    stageLabel: 'Artisan Allocated',
    description: 'Craft materials selected & artisan workshop queue prioritized',
    icon: CheckCircle2,
  },
  {
    step: 3,
    title: 'Crafting in Atelier',
    stageLabel: 'Hand-Crafting',
    description: 'Handcrafted with devotion, inspected & cured to perfection',
    icon: Sparkles,
  },
  {
    step: 4,
    title: 'Dispatched & In Transit',
    stageLabel: 'Courier Handover',
    description: 'Nestled in reinforced keepsake box with live AWB tracking',
    icon: Truck,
  },
  {
    step: 5,
    title: 'Delivered with Care',
    stageLabel: 'Doorstep Arrival',
    description: 'Safely handed over to delight the recipient',
    icon: HeartHandshake,
  },
];

// Helper to generate direct official courier tracking URL
function getCourierTrackingUrl(courier: string | null, awb: string | null): string {
  if (!awb) return '#';
  const cleanAwb = encodeURIComponent(awb.trim());
  const c = (courier || '').toLowerCase();

  if (c.includes('delhivery')) {
    return `https://www.delhivery.com/track/package/${cleanAwb}`;
  }
  if (c.includes('bluedart') || c.includes('blue dart')) {
    return `https://www.bluedart.com/tracking?trackNumber=${cleanAwb}`;
  }
  if (c.includes('dtdc')) {
    return `https://www.dtdc.in/tracking/tracking_results.asp?pinType=AWB&strQuery=${cleanAwb}`;
  }
  if (c.includes('xpressbees')) {
    return `https://www.xpressbees.com/track?awb=${cleanAwb}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(`${courier || 'courier'} tracking ${awb}`)}`;
}

export function OrderTracker({ initialOrderNumber = '' }: OrderTrackerProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState<SanitizedOrderTracking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedField, setCopiedField] = useState<'order' | 'awb' | null>(null);

  const performLookup = (num: string) => {
    const trimmed = num.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter your order number (e.g. DAH-2026-1001).');
      setOrder(null);
      return;
    }

    setSearchedTerm(trimmed);
    startTransition(async () => {
      setError(null);
      setHasSearched(true);
      const res = await trackOrder(trimmed);
      if (res.success && res.order) {
        setOrder(res.order);
        setError(null);
      } else {
        setOrder(null);
        setError(res.error || `No order found matching "${trimmed}".`);
      }
    });
  };

  useEffect(() => {
    if (initialOrderNumber) {
      performLookup(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(orderNumber);
  };

  const handleCopy = (text: string, field: 'order' | 'awb') => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleReset = () => {
    setOrder(null);
    setError(null);
    setHasSearched(false);
    setOrderNumber('');
    setSearchedTerm('');
  };

  return (
    <div className="space-y-10">
      {/* 1. LUXURY ATELIER TRACKING CONSOLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gold/40 shadow-sm max-w-3xl mx-auto relative overflow-hidden">
        {/* Soft decorative background glows */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold-light text-gold-hover border border-gold/30">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Atelier Parcel Console</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-text-main tracking-tight">
              Track Your Handcrafted Order
            </h2>
            <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto">
              Follow real-time artisan crafting, quality inspection, and express courier transit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gold">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    id="orderNumberInput"
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. DAH-2026-942089"
                    className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl border border-border-subtle bg-canvas text-sm sm:text-base text-text-main font-mono font-bold tracking-wider placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all uppercase"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {orderNumber && (
                    <button
                      type="button"
                      onClick={() => setOrderNumber('')}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-main transition-colors"
                      aria-label="Clear order number"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md hover:shadow-wine-glow active:scale-[0.98] disabled:opacity-60 transition-all sm:w-auto"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Locating Parcel...</span>
                    </>
                  ) : (
                    <>
                      <span>Track Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Demo Sample Pill & Guidance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-text-muted">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-text-subtle">Quick test:</span>
                <button
                  type="button"
                  onClick={() => {
                    setOrderNumber('DAH-SAMPLE');
                    performLookup('DAH-SAMPLE');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-light hover:bg-gold/20 text-gold-hover font-mono text-[11px] font-bold border border-gold/40 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>DAH-SAMPLE</span>
                </button>
              </div>
              <span className="text-[11px] text-text-subtle sm:text-right">
                Format: <strong className="font-mono text-text-main">DAH-YYYY-XXXXXX</strong> &bull; Zero login needed
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* 2. GENTLE CONCIERGE ERROR / NOT FOUND STATE */}
      {error && (
        <div className="max-w-3xl mx-auto bg-surface-warm border border-gold/40 rounded-3xl p-6 sm:p-8 text-text-main shadow-xs space-y-6 animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-light border border-gold/30 text-gold-hover flex items-center justify-center shrink-0">
              <SearchX className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-text-main">
                We Couldn&apos;t Locate Order &ldquo;{searchedTerm || orderNumber}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {error}
              </p>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-5 border border-border-subtle space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Helpful Tips to Find Your Parcel:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-text-muted leading-normal">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Check Prefix:</strong> All DivijaArtHouse order numbers start with <code className="font-mono bg-canvas px-1.5 py-0.5 rounded text-text-main font-bold">DAH-</code> (e.g., <span className="font-mono font-semibold">DAH-2026-942089</span>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Check WhatsApp &amp; SMS:</strong> We dispatched an instant receipt with your order number to your phone immediately upon checkout.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Recent Payment?</strong> If you completed checkout in the last 60 seconds, your order might still be finalizing in our atelier system.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setOrderNumber('DAH-SAMPLE');
                performLookup('DAH-SAMPLE');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-hover hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview sample tracking instead</span>
            </button>

            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hi DivijaArtHouse Concierge, I need assistance tracking my order: ${searchedTerm || orderNumber || 'DAH-XXXX'}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask Atelier Concierge on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* 3. ORDER RESULT VIEW (WHEN ORDER IS FOUND) */}
      {order && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* A. Header Overview Card */}
          <div className="bg-surface-warm rounded-3xl p-6 sm:p-8 border border-gold/40 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle/80 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold-hover flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold" />
                    <span>Live Atelier Tracking</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold font-mono text-text-main tracking-wider">
                    {order.orderNumber}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.orderNumber, 'order')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-border-subtle hover:border-gold/60 text-text-muted hover:text-text-main transition-colors"
                    title="Copy Order Number"
                  >
                    {copiedField === 'order' ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-green-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-text-muted">
                  <span className="flex items-center gap-1.5 font-sans not-italic tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    <span>Placed on {formatDate(order.createdAt)}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>Delivering to {order.shippingCity}, {order.shippingState}</span>
                  </span>
                </div>
              </div>

              {/* Status Badge & Reset Button */}
              <div className="flex flex-col md:items-end gap-2.5">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase shadow-2xs ${
                    order.isCancelled
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : order.currentStep === 5
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : order.currentStep === 4
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gold-light text-text-main border border-gold/40'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <span>{order.orderStatus.replace(/_/g, ' ')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted font-sans not-italic tabular-nums">
                    Estimated Arrival: <strong className="text-text-main">{order.estimatedDelivery}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline ml-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Track Another</span>
                  </button>
                </div>
              </div>
            </div>

            {/* B. Artisanal Milestone Stepper */}
            {order.isCancelled ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                  <XCircle className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-red-900 text-lg">
                  This Order Has Been Cancelled
                </h3>
                <p className="text-xs sm:text-sm text-red-700 max-w-md mx-auto">
                  If you requested a refund, it will be credited to your original payment method within 5–7 business days.
                </p>
              </div>
            ) : (
              <div className="py-8">
                {/* Desktop Horizontal Stepper */}
                <div className="relative hidden md:block">
                  {/* Background Progress Rail */}
                  <div className="absolute top-5 left-8 right-8 h-1 bg-border-subtle -z-0">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-primary transition-all duration-700 rounded-full"
                      style={{
                        width: `${((Math.max(1, order.currentStep) - 1) / (STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-5 relative z-10">
                    {STEPS.map((s) => {
                      const isComplete = order.currentStep > s.step;
                      const isCurrent = order.currentStep === s.step;
                      const Icon = s.icon;

                      return (
                        <div key={s.step} className="flex flex-col items-center text-center px-2">
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                              isCurrent
                                ? 'bg-primary text-white shadow-wine-glow ring-4 ring-gold/40 ring-offset-2 ring-offset-surface-warm scale-105'
                                : isComplete
                                ? 'bg-gold text-white shadow-xs'
                                : 'bg-white border-2 border-border-subtle text-gray-400'
                            }`}
                          >
                            {isComplete ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>

                          <div className="mt-3 space-y-0.5">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider block ${
                                isCurrent
                                  ? 'text-gold-hover'
                                  : isComplete
                                  ? 'text-primary'
                                  : 'text-gray-400'
                              }`}
                            >
                              {s.stageLabel}
                            </span>
                            <p
                              className={`text-xs font-bold leading-snug ${
                                isCurrent
                                  ? 'text-primary'
                                  : isComplete
                                  ? 'text-text-main'
                                  : 'text-gray-400'
                              }`}
                            >
                              {s.title}
                            </p>
                            <p className="text-[11px] text-text-muted leading-tight max-w-[130px] mx-auto">
                              {s.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Vertical Stepper */}
                <div className="md:hidden space-y-6 pl-2">
                  {STEPS.map((s, idx) => {
                    const isComplete = order.currentStep > s.step;
                    const isCurrent = order.currentStep === s.step;
                    const Icon = s.icon;
                    const isLast = idx === STEPS.length - 1;

                    return (
                      <div key={s.step} className="flex items-start gap-4 relative">
                        {!isLast && (
                          <div
                            className={`absolute left-4 top-9 bottom-0 w-0.5 ${
                              order.currentStep > s.step ? 'bg-gold' : 'bg-border-subtle'
                            }`}
                          />
                        )}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                            isCurrent
                              ? 'bg-primary text-white ring-4 ring-gold/30 shadow-wine-glow'
                              : isComplete
                              ? 'bg-gold text-white shadow-xs'
                              : 'bg-white border border-border-subtle text-gray-400'
                          }`}
                        >
                          {isComplete ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="space-y-0.5 pt-0.5 flex-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isCurrent ? 'text-gold-hover' : 'text-text-muted'
                            }`}
                          >
                            {s.stageLabel}
                          </span>
                          <p
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-primary'
                                : isComplete
                                ? 'text-text-main'
                                : 'text-gray-400'
                            }`}
                          >
                            {s.title}
                          </p>
                          <p className="text-[11px] text-text-muted leading-relaxed">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* C. Live Courier AWB Hub (When Dispatched / In Transit) */}
            {order.trackingNumber && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Courier Partner &amp; AWB Dispatch
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Insured Bloom Box Transit</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-bold text-text-main text-base sm:text-lg">
                      {order.trackingCourier || 'Express Courier'}
                    </p>
                    <span className="text-gray-300">&bull;</span>
                    <span className="font-mono font-bold text-primary tracking-wider text-base">
                      {order.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(order.trackingNumber || '', 'awb')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted hover:text-text-main"
                      title="Copy AWB Tracking Number"
                    >
                      {copiedField === 'awb' ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <a
                  href={getCourierTrackingUrl(order.trackingCourier, order.trackingNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs hover:shadow-wine-glow transition-all w-full sm:w-auto shrink-0"
                >
                  <span>Track on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* D. Items in Order & Financial Summary Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items Column (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-xs space-y-6">
              <h3 className="text-base font-serif font-bold text-text-main tracking-tight flex items-center justify-between">
                <span>Items in This Bouquet Order</span>
                <span className="text-xs font-sans not-italic tabular-nums text-text-muted font-normal">
                  {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                </span>
              </h3>

              <div className="divide-y divide-border-subtle">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl bg-surface-warm border border-border-subtle overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          unoptimized={item.image.endsWith('.svg')}
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/40">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="font-semibold text-sm text-text-main hover:text-primary transition-colors truncate block"
                      >
                        {item.productName}
                      </Link>
                      {item.variantName && (
                        <p className="text-xs text-text-muted">
                          Palette: {item.variantName}
                        </p>
                      )}
                      {item.personalizationText && (
                        <p className="text-[11px] text-primary italic truncate">
                          &ldquo;{item.personalizationText}&rdquo;
                        </p>
                      )}
                      <p className="text-xs text-text-muted font-sans not-italic tabular-nums">
                        Qty: <span className="font-semibold">{item.quantity}</span> &times; <span className="font-semibold">{formatINR(item.unitPrice)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm sm:text-base text-text-main font-sans not-italic tabular-nums">
                        {formatINR(item.lineSubtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary Column (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-xs space-y-6 h-fit">
              <h3 className="text-base font-serif font-bold text-text-main tracking-tight">
                Order Payment Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-text-muted font-sans not-italic tabular-nums">
                  <span>Subtotal</span>
                  <span className="font-medium text-text-main">{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-muted font-sans not-italic tabular-nums">
                  <span>Packaging &amp; Express Shipping</span>
                  <span>
                    {order.shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatINR(order.shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-border-subtle flex justify-between font-bold text-base text-text-main font-sans not-italic tabular-nums">
                  <span>Total Amount Paid</span>
                  <span className="text-primary font-extrabold text-lg">{formatINR(order.totalAmount)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Payment Method:</span>
                  <span className="font-semibold text-text-main">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid (Razorpay)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Payment Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="pt-4 border-t border-border-subtle space-y-1 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Shipping Destination
                </span>
                <p className="font-semibold text-text-main">
                  {order.shippingCity}, {order.shippingState}
                </p>
              </div>

              {/* Concierge Link */}
              <div className="pt-3 border-t border-border-subtle">
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hi DivijaArtHouse, I want to update gate instructions or inquire about my order: ${order.orderNumber}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gold-light hover:bg-gold/20 text-gold-hover text-xs font-semibold border border-gold/30 transition-colors w-full"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Delivery Notes? Chat Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRE-SEARCH REASSURANCE SUITE (SHOWN BEFORE SEARCH OR BELOW SEARCH) */}
      {!order && !hasSearched && (
        <div className="space-y-10 pt-4">
          {/* A. 3 Elevated Craft Milestone Cards */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border-subtle hover:border-gold/50 shadow-xs hover:shadow-gold-soft transition-all text-center space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gold-light group-hover:bg-gold/20 text-gold-hover flex items-center justify-center mx-auto transition-colors border border-gold/30">
                <Search className="w-5 h-5 text-gold" />
              </div>
              <h4 className="font-serif font-bold text-base text-text-main">
                Instant Atelier Lookup
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Check live craft progress and express courier dispatch without requiring any password or account login.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border-subtle hover:border-gold/50 shadow-xs hover:shadow-gold-soft transition-all text-center space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gold-light group-hover:bg-gold/20 text-gold-hover flex items-center justify-center mx-auto transition-colors border border-gold/30">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <h4 className="font-serif font-bold text-base text-text-main">
                Handcrafted Milestones
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Follow your everlasting floral bouquet from raw wool yarn selection through master crochet knitting and petal steaming.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border-subtle hover:border-gold/50 shadow-xs hover:shadow-gold-soft transition-all text-center space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gold-light group-hover:bg-gold/20 text-gold-hover flex items-center justify-center mx-auto transition-colors border border-gold/30">
                <ShieldCheck className="w-5 h-5 text-gold" />
              </div>
              <h4 className="font-serif font-bold text-base text-text-main">
                Bloom Box Protection
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Every bouquet travels nestled in our reinforced crush-tested bloom box with moisture barrier protection.
              </p>
            </div>
          </div>

          {/* B. Pan-India Courier Partner Trust Strip */}
          <div className="max-w-4xl mx-auto bg-surface-warm rounded-3xl p-6 sm:p-8 border border-border-subtle space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-hover">
                Pan-India Express Logistics
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-text-main">
                Partnered with India&apos;s Most Trusted Courier Networks
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                Insured express door-to-door delivery across 19,000+ PIN codes with live SMS dispatch alerts.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white rounded-2xl p-4 border border-border-subtle/80 flex flex-col items-center justify-center text-center shadow-2xs">
                <span className="font-sans font-extrabold text-sm text-text-main tracking-tight">
                  BlueDart
                </span>
                <span className="text-[10px] text-text-muted font-medium mt-0.5">
                  Air Priority Express
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-border-subtle/80 flex flex-col items-center justify-center text-center shadow-2xs">
                <span className="font-sans font-extrabold text-sm text-text-main tracking-tight">
                  Delhivery
                </span>
                <span className="text-[10px] text-text-muted font-medium mt-0.5">
                  Direct Surface &amp; Air
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-border-subtle/80 flex flex-col items-center justify-center text-center shadow-2xs">
                <span className="font-sans font-extrabold text-sm text-text-main tracking-tight">
                  DTDC Express
                </span>
                <span className="text-[10px] text-text-muted font-medium mt-0.5">
                  Pan-India Transit
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-border-subtle/80 flex flex-col items-center justify-center text-center shadow-2xs">
                <span className="font-sans font-extrabold text-sm text-text-main tracking-tight">
                  India Post
                </span>
                <span className="text-[10px] text-text-muted font-medium mt-0.5">
                  Speed Post Connectivity
                </span>
              </div>
            </div>
          </div>

          {/* C. "Where to Find Your Order Number" Helper Tip */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-border-subtle space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>1. WhatsApp &amp; SMS Receipt</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Check your WhatsApp or SMS inbox for messages from <strong className="text-text-main">DivijaArtHouse</strong> sent immediately following your order confirmation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-border-subtle space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-gold" />
                <span>2. Email Confirmation Receipt</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Look for an email with subject line <span className="font-mono text-text-main font-semibold">&ldquo;Order Confirmed: DAH-2026-XXXX&rdquo;</span> sent to your checkout email.
              </p>
            </div>
          </div>

          {/* D. Live Atelier Concierge Assistance Bar */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-surface-warm via-gold-light/40 to-surface-warm rounded-3xl p-6 sm:p-8 border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-hover">
                Need Help with Your Delivery?
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-text-main">
                Talk to our Atelier Concierge on WhatsApp
              </h3>
              <p className="text-xs text-text-muted max-w-md">
                Can&apos;t find your receipt, need to update gate instructions, or want to add a handwritten gift note before dispatch?
              </p>
            </div>

            <a
              href="https://wa.me/919876543210?text=Hi%20DivijaArtHouse%20Concierge,%20I%20have%20a%20question%20regarding%20tracking%20and%20delivery."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-emerald-600/30 transition-all shrink-0 active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
