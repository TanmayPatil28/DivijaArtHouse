import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { formatINR, formatDate } from '@/lib/utils';
import {
  Package,
  Calendar,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  Truck,
} from 'lucide-react';

export const metadata = {
  title: 'My Orders | DivijaArtHouse',
  description: 'View your DivijaArtHouse order history and tracking receipts.',
};

function getOrderStatusBadge(status: string) {
  switch (status) {
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'SHIPPED':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'PROCESSING':
    case 'CONFIRMED':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'PENDING_COD':
    case 'PENDING':
    default:
      return 'bg-amber-50 text-amber-800 border-amber-200';
  }
}

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case 'PAID':
      return 'bg-emerald-100 text-emerald-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    case 'REFUNDED':
      return 'bg-purple-100 text-purple-800';
    case 'PENDING':
    default:
      return 'bg-amber-100 text-amber-800';
  }
}

export default async function AccountOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin?callbackUrl=/account/orders');
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        { customerEmail: session.user.email || '' },
      ],
    },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-surface-warm/30 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-muted hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Account Overview</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-main">
              Order History
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Track parcel dispatches, status, and receipts for all your handcrafted orders
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 bg-white rounded-full border border-border-subtle text-text-muted w-fit">
            {orders.length} {orders.length === 1 ? 'Order Placed' : 'Orders Placed'}
          </span>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-border-subtle text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blush-soft text-primary mx-auto flex items-center justify-center mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-text-main">
              No Orders Yet
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
              You haven&apos;t placed any orders yet. Discover our handcrafted floral creations and bring everlasting blooms into your home or gift them to loved ones.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium shadow-md transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Blooms</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-border-subtle shadow-xs overflow-hidden transition-all hover:shadow-md"
              >
                {/* Order Card Top Bar */}
                <div className="p-5 sm:p-6 bg-surface-warm/40 border-b border-border-subtle flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                        Order
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-text-main">
                        #{order.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-text-muted" />
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getOrderStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${getPaymentStatusBadge(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-5 sm:p-6 divide-y divide-border-subtle/60">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl bg-surface-warm overflow-hidden border border-border-subtle flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-text-main">
                            {item.productName}
                          </h3>
                          <div className="text-xs text-text-muted mt-0.5 space-x-2">
                            {item.variantName && <span>Variant: {item.variantName}</span>}
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span>{formatINR(item.unitPrice)} each</span>
                          </div>
                          {item.personalizationText && (
                            <p className="text-[11px] text-primary/90 italic mt-1 font-serif">
                              &ldquo;{item.personalizationText}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Line Subtotal */}
                      <div className="text-right">
                        <p className="text-sm font-bold text-text-main">
                          {formatINR(item.lineSubtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer with Total & CTA */}
                <div className="p-5 sm:p-6 bg-surface-warm/20 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {order.trackingNumber && (
                      <div className="flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200">
                        <Truck className="w-3.5 h-3.5" />
                        <span>
                          {order.trackingCourier || 'Courier'}: {order.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-xs text-text-muted">Total Paid / Due</span>
                      <p className="font-display text-lg sm:text-xl font-bold text-primary">
                        {formatINR(order.totalAmount)}
                      </p>
                    </div>

                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-blush-soft text-text-main hover:text-primary border border-border-subtle text-xs sm:text-sm font-medium transition-colors shadow-xs"
                    >
                      <span>View Receipt</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
