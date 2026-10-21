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
} from 'lucide-react';
import { trackOrder, type SanitizedOrderTracking } from '@/actions/tracking';
import { formatINR, formatDate } from '@/lib/utils';

interface OrderTrackerProps {
  initialOrderNumber?: string;
}

const STEPS = [
  {
    step: 1,
    title: 'Order Placed',
    description: 'Order confirmed and registered in studio',
    icon: Package,
  },
  {
    step: 2,
    title: 'Crafting & Processing',
    description: 'Artisan yarn knitting & botanical assembly',
    icon: Sparkles,
  },
  {
    step: 3,
    title: 'Dispatched & In Transit',
    description: 'Handed over to express logistics partner',
    icon: Truck,
  },
  {
    step: 4,
    title: 'Delivered',
    description: 'Safely delivered at your doorstep',
    icon: CheckCircle2,
  },
];

export function OrderTracker({ initialOrderNumber = '' }: OrderTrackerProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState<SanitizedOrderTracking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performLookup = (num: string) => {
    if (!num.trim()) {
      setError('Please enter a valid order number.');
      setOrder(null);
      return;
    }

    startTransition(async () => {
      setError(null);
      setHasSearched(true);
      const res = await trackOrder(num);
      if (res.success && res.order) {
        setOrder(res.order);
        setError(null);
      } else {
        setOrder(null);
        setError(res.error || 'Order not found.');
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

  return (
    <div className="space-y-8">
      {/* Search Input Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-sm max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="orderNumberInput"
            className="block text-xs font-bold uppercase tracking-wider text-text-muted"
          >
            Enter Your Order Number
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="orderNumberInput"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. DAH-2026-1001"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border-subtle bg-canvas text-sm sm:text-base text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md active:scale-[0.99] disabled:opacity-60 transition-all sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <span>Track Order</span>
              )}
            </button>
          </div>
          <p className="text-xs text-text-muted">
            Tip: Your order number can be found in the subject line of your order confirmation email or receipt.
          </p>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Order Not Found</h3>
              <p className="text-xs sm:text-sm text-red-700 mt-1 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-red-200/60 flex items-center justify-between text-xs text-red-900">
            <span>Need help locating your order?</span>
            <Link
              href="/contact"
              className="font-semibold text-primary hover:underline"
            >
              Contact Support &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Result State */}
      {order && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Header Summary Card */}
          <div className="bg-surface-warm rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle/80 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Order Tracking
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-mono text-text-main mt-1">
                  {order.orderNumber}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    Placed on {formatDate(order.createdAt)}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    Delivering to {order.shippingCity}, {order.shippingState}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-start md:items-end gap-1.5">
                <div
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                    order.isCancelled
                      ? 'bg-red-100 text-red-800'
                      : order.currentStep === 4
                      ? 'bg-green-100 text-green-800'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>{order.orderStatus.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-xs text-text-muted">
                  Estimated Delivery:{' '}
                  <strong className="text-text-main">{order.estimatedDelivery}</strong>
                </p>
              </div>
            </div>

            {/* Stepper Component */}
            {order.isCancelled ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-red-900 text-base">This Order Has Been Cancelled</h3>
                <p className="text-xs sm:text-sm text-red-700 max-w-md mx-auto">
                  If you requested a refund, it will be credited to your original payment method within 5–7 business days.
                </p>
              </div>
            ) : (
              <div className="py-8">
                {/* Desktop Stepper */}
                <div className="relative hidden md:block">
                  {/* Stepper Progress Bar */}
                  <div className="absolute top-5 left-10 right-10 h-1 bg-border-subtle -z-0">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${((order.currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-4 relative z-10">
                    {STEPS.map((s) => {
                      const isComplete = order.currentStep >= s.step;
                      const isCurrent = order.currentStep === s.step;
                      const Icon = s.icon;

                      return (
                        <div key={s.step} className="flex flex-col items-center text-center px-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isComplete
                                ? 'bg-primary text-white shadow-sm ring-4 ring-blush-soft'
                                : 'bg-canvas border-2 border-border-subtle text-gray-400'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <p
                            className={`mt-3 text-xs font-bold ${
                              isCurrent
                                ? 'text-primary'
                                : isComplete
                                ? 'text-text-main'
                                : 'text-gray-400'
                            }`}
                          >
                            {s.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-text-muted leading-tight max-w-[140px]">
                            {s.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Stepper (Vertical Timeline) */}
                <div className="md:hidden space-y-6 pl-2">
                  {STEPS.map((s, idx) => {
                    const isComplete = order.currentStep >= s.step;
                    const isCurrent = order.currentStep === s.step;
                    const Icon = s.icon;
                    const isLast = idx === STEPS.length - 1;

                    return (
                      <div key={s.step} className="flex items-start gap-4 relative">
                        {!isLast && (
                          <div
                            className={`absolute left-4 top-8 bottom-0 w-0.5 ${
                              order.currentStep > s.step ? 'bg-primary' : 'bg-border-subtle'
                            }`}
                          />
                        )}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            isComplete
                              ? 'bg-primary text-white shadow-xs'
                              : 'bg-canvas border border-border-subtle text-gray-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 pt-0.5 flex-1">
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
                          <p className="text-[11px] text-text-muted">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Courier Tracking Dispatch Details */}
            {order.trackingNumber && (
              <div className="bg-white rounded-2xl p-5 border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Courier Partner & Tracking (AWB)
                  </p>
                  <p className="font-bold text-text-main text-sm sm:text-base">
                    {order.trackingCourier || 'Express Courier'} &bull;{' '}
                    <span className="font-mono text-primary font-semibold">
                      {order.trackingNumber}
                    </span>
                  </p>
                </div>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    `${order.trackingCourier || 'courier'} tracking ${order.trackingNumber}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors w-fit"
                >
                  <span>Track with Courier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Items & Payment Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items Column (8) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-xs space-y-6">
              <h3 className="text-base font-semibold text-text-main tracking-tight flex items-center justify-between">
                <span>Items in This Order</span>
                <span className="text-xs font-sans text-text-muted font-normal">
                  {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                </span>
              </h3>

              <div className="divide-y divide-border-subtle">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl bg-surface-warm border border-border-subtle overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
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
                          Variant: {item.variantName}
                        </p>
                      )}
                      {item.personalizationText && (
                        <p className="text-[11px] text-primary italic truncate">
                          &ldquo;{item.personalizationText}&rdquo;
                        </p>
                      )}
                      <p className="text-xs text-text-muted">
                        Qty: {item.quantity} &times; {formatINR(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-text-main">
                        {formatINR(item.lineSubtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary Column (4) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-xs space-y-6 h-fit">
              <h3 className="text-base font-semibold text-text-main tracking-tight">
                Payment Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span>{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Shipping</span>
                  <span>
                    {order.shippingFee === 0 ? (
                      <span className="text-green-700 font-semibold">FREE</span>
                    ) : (
                      formatINR(order.shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-border-subtle flex justify-between font-bold text-base text-text-main">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatINR(order.totalAmount)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Payment Method:</span>
                  <span className="font-semibold text-text-main">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Prepaid (Razorpay)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Payment Status:</span>
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === 'PAID'
                        ? 'text-green-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty State Info */}
      {!order && !hasSearched && (
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="bg-surface-warm rounded-2xl p-6 border border-border-subtle text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blush-soft text-primary flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-text-main">Instant Lookup</h4>
            <p className="text-xs text-text-muted">
              Check live status in real time with zero account login needed.
            </p>
          </div>
          <div className="bg-surface-warm rounded-2xl p-6 border border-border-subtle text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blush-soft text-primary flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-text-main">Craft Milestones</h4>
            <p className="text-xs text-text-muted">
              Follow every step from yarn selection to doorstep bouquet delivery.
            </p>
          </div>
          <div className="bg-surface-warm rounded-2xl p-6 border border-border-subtle text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blush-soft text-primary flex items-center justify-center mx-auto">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-text-main">Courier Tracking</h4>
            <p className="text-xs text-text-muted">
              Access partner AWB details as soon as packages are dispatched.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
