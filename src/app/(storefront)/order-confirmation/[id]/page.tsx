import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  CreditCard,
  Banknote,
  Search,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatINR, formatDate } from '@/lib/utils';

interface OrderConfirmationPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps): Promise<Metadata> {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: { orderNumber: true },
  });

  return {
    title: order
      ? `Order ${order.orderNumber} Confirmed | DivijaArtHouse`
      : 'Order Confirmation | DivijaArtHouse',
    description:
      'Thank you for your handcrafted bouquet order with DivijaArtHouse.',
  };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Estimated delivery timeframe: 4 - 7 business days from order creation
  const orderDate = new Date(order.createdAt);
  const minDelivery = new Date(orderDate);
  minDelivery.setDate(minDelivery.getDate() + 4);
  const maxDelivery = new Date(orderDate);
  maxDelivery.setDate(maxDelivery.getDate() + 7);

  const deliveryWindowStr = `${formatDate(minDelivery)} – ${formatDate(maxDelivery)}`;

  // Payment status badge details
  const getPaymentStatusBadge = (status: string, method: string) => {
    if (status === 'PAID') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span>Paid Online</span>
        </span>
      );
    }
    if (method === 'COD') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Banknote className="w-3.5 h-3.5 text-amber-600" />
          <span>Payable upon Delivery (COD)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">
        <Clock className="w-3.5 h-3.5 text-yellow-600" />
        <span>Payment {status}</span>
      </span>
    );
  };

  // Order fulfillment status badge details
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Artisan Crafting & Processing</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            <span>In Transit</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            <span>Delivered</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span>Cancelled</span>
          </span>
        );
      case 'PENDING':
      case 'PENDING_COD':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Order Placed (Pending Dispatch)</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface-warm/30 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Celebration Header Card */}
        <div className="bg-canvas border border-border-subtle rounded-3xl p-6 sm:p-10 text-center shadow-xs relative overflow-hidden">
          {/* Subtle floral celebration backdrop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-blush-soft/50 rounded-b-full filter blur-xl -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Celebration Badge Icon */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-soft-pink border-2 border-blush flex items-center justify-center shadow-xs mb-6">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              <div className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-xs">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>

            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              Order Confirmed & Received
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-4xl text-text-main max-w-lg mb-3">
              Thank you for your order, {order.customerName.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
              Your handcrafted blossoms are being carefully prepared with love by our artisans. An email confirmation has been sent to{' '}
              <strong className="text-text-main font-medium">{order.customerEmail}</strong>.
            </p>

            {/* Quick Metadata Pill Strip */}
            <div className="mt-8 pt-6 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-left">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium block">
                  Order Number
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-primary block truncate">
                  {order.orderNumber}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium block">
                  Order Date
                </span>
                <span className="text-xs sm:text-sm font-medium text-text-main flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  <span>{formatDate(order.createdAt)}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium block">
                  Estimated Delivery
                </span>
                <span className="text-xs sm:text-sm font-medium text-text-main flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-text-muted" />
                  <span>{deliveryWindowStr}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium block">
                  Payment Method
                </span>
                <span className="text-xs sm:text-sm font-medium text-text-main flex items-center gap-1">
                  {order.paymentMethod === 'COD' ? (
                    <>
                      <Banknote className="w-3.5 h-3.5 text-text-muted" />
                      <span>Cash on Delivery</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5 text-text-muted" />
                      <span>Razorpay Online</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Status Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {getOrderStatusBadge(order.orderStatus)}
              {getPaymentStatusBadge(order.paymentStatus, order.paymentMethod)}
            </div>
          </div>
        </div>

        {/* Order Details & Delivery Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Shipping Address Details (1 col) */}
          <div className="bg-canvas border border-border-subtle rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-display font-bold text-base sm:text-lg text-text-main flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Shipping Address</span>
            </h2>
            <div className="text-xs sm:text-sm text-text-main space-y-1.5 leading-relaxed">
              <p className="font-semibold text-text-main">{order.customerName}</p>
              <p className="text-text-muted">{order.shippingAddressLine1}</p>
              {order.shippingAddressLine2 && (
                <p className="text-text-muted">{order.shippingAddressLine2}</p>
              )}
              <p className="text-text-muted">
                {order.city}, {order.state} – {order.pincode}
              </p>
              <p className="text-text-muted font-medium">India</p>
            </div>

            <div className="pt-3 border-t border-border-subtle space-y-1 text-xs text-text-muted">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-text-muted" />
                <span>+91 {order.customerPhone}</span>
              </p>
              <p className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-text-muted" />
                <span>{order.customerEmail}</span>
              </p>
            </div>

            {order.deliveryInstructions && (
              <div className="pt-3 border-t border-border-subtle">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                  Instructions / Gift Note:
                </span>
                <p className="text-xs text-text-main bg-surface-warm p-2.5 rounded-xl border border-border-subtle italic">
                  &ldquo;{order.deliveryInstructions}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Items & Payment Breakdown (2 cols) */}
          <div className="md:col-span-2 bg-canvas border border-border-subtle rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="font-display font-bold text-base sm:text-lg text-text-main flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span>Items in Order ({order.items.length})</span>
              </span>
            </h2>

            {/* Line items list */}
            <div className="divide-y divide-border-subtle space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-xl bg-surface-warm border border-border-subtle overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || '/images/products/blushing-peony-rose-1.svg'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-text-main">
                      {item.productName}
                    </p>
                    {item.variantName && (
                      <p className="text-[11px] text-primary font-medium mt-0.5">
                        Variant: {item.variantName}
                      </p>
                    )}
                    {item.personalizationText && (
                      <p className="text-[11px] text-text-muted italic mt-0.5">
                        Gift Note: &ldquo;{item.personalizationText}&rdquo;
                      </p>
                    )}
                    <p className="text-xs text-text-muted mt-1">
                      Qty: {item.quantity} × {formatINR(item.unitPrice)}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-text-main">
                      {formatINR(item.lineSubtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-border-subtle space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Items Subtotal</span>
                <span className="text-text-main font-semibold">
                  {formatINR(order.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-text-muted">
                <span>Shipping Fee</span>
                {order.shippingFee === 0 ? (
                  <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200 text-xs">
                    FREE
                  </span>
                ) : (
                  <span className="text-text-main font-semibold">
                    {formatINR(order.shippingFee)}
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-border-subtle flex justify-between items-baseline text-base sm:text-lg">
                <span className="font-display font-bold text-text-main">
                  Total Order Amount
                </span>
                <span className="font-display font-bold text-primary text-xl">
                  {formatINR(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white transition-all shadow-sm active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            <span>Track Your Order</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-canvas hover:bg-gray-50 text-text-main border border-border-subtle hover:border-gray-400 transition-all shadow-xs active:scale-[0.98]"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
