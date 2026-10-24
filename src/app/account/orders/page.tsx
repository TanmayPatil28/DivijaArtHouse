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
  MessageCircle,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CopyOrderNumber } from '@/components/account/CopyOrderNumber';
import { ReorderButton } from '@/components/account/ReorderButton';
import { OrderProgressBar } from '@/components/account/OrderProgressBar';

export const metadata = {
  title: 'My Orders | DivijaArtHouse Handcrafted Blooms',
  description: 'View your DivijaArtHouse order history, live parcel tracking, and receipts.',
};

function getOrderStatusBadge(status: string) {
  switch (status) {
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    case 'SHIPPED':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'PROCESSING':
      return 'bg-gold-light text-gold-hover border-gold/40';
    case 'CONFIRMED':
      return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'CANCELLED':
      return 'bg-red-50 text-red-800 border-red-200';
    case 'PENDING_COD':
    case 'PENDING':
    default:
      return 'bg-amber-50 text-amber-800 border-amber-200';
  }
}

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case 'PAID':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'FAILED':
      return 'bg-red-50 text-red-700 border border-red-200';
    case 'REFUNDED':
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'PENDING':
    default:
      return 'bg-amber-50 text-amber-700 border border-amber-200';
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
    <div className="min-h-screen bg-canvas py-8 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb / Back Link */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-muted">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 font-medium text-text-muted hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>Account Overview</span>
          </Link>
          <span>/</span>
          <span className="text-text-main font-semibold">Order History</span>
        </nav>

        {/* Editorial Section Header */}
        <div className="pb-4 border-b border-border-subtle">
          <SectionHeader
            eyebrow="Atelier Order History"
            eyebrowIcon={<Package className="w-3.5 h-3.5 text-gold shrink-0" />}
            eyebrowSuffix="Everlasting Blooms"
            titleLead="Your Handcrafted"
            titleAccent="Orders & Dispatches."
            description="Track real-time crafting and express courier transit, reorder favorite arrangements with 1 click, or connect directly with our Atelier Concierge."
            align="left"
            headingTag="h1"
            size="lg"
          />
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-gold/30 text-center shadow-xs max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gold-light text-gold-hover mx-auto flex items-center justify-center border border-gold/30">
              <Package className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-main">
              No Orders in Your Atelier History
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              You haven&apos;t placed any orders yet. Explore our handcrafted crochet blooms and bring everlasting floral poetry into your home or surprise someone special.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-wine-glow transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Bloom Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-8">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Showing {orders.length} order{orders.length > 1 ? 's' : ''}</span>
              <span className="font-sans not-italic tabular-nums">All prices in INR (&#8377;)</span>
            </div>

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-border-subtle hover:border-gold/40 shadow-xs hover:shadow-gold-soft transition-all overflow-hidden"
              >
                {/* Top Bar */}
                <div className="p-5 sm:p-6 bg-surface-warm/50 border-b border-border-subtle/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] text-text-muted uppercase tracking-wider font-bold">
                        Order
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-text-main">
                        #{order.orderNumber}
                      </span>
                      <CopyOrderNumber orderNumber={order.orderNumber} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                      <span className="flex items-center gap-1 font-sans not-italic tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>Placed {formatDate(order.createdAt)}</span>
                      </span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-text-subtle shrink-0" />
                        <span>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid Online'}</span>
                      </span>
                      {order.city && (
                        <>
                          <span className="text-gray-300">&bull;</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                            <span>{order.city}, {order.state}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${getOrderStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${getPaymentStatusBadge(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="px-5 sm:px-6 pt-5 pb-2 border-b border-border-subtle/40">
                  <OrderProgressBar status={order.orderStatus} />
                </div>

                {/* Active Courier Dispatch Alert (if available) */}
                {order.trackingNumber && (
                  <div className="mx-5 sm:mx-6 mt-4 p-3.5 rounded-2xl bg-gold-light/40 border border-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gold shrink-0" />
                      <span>
                        Dispatched via <strong className="text-text-main">{order.trackingCourier || 'Express Courier'}</strong> &bull; AWB: <code className="font-mono font-bold text-primary">{order.trackingNumber}</code>
                      </span>
                    </div>
                    <Link
                      href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline shrink-0"
                    >
                      <span>Live Parcel Tracking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Items List */}
                <div className="p-5 sm:p-6 divide-y divide-border-subtle/60">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative w-16 h-16 rounded-2xl bg-surface-warm overflow-hidden border border-border-subtle shrink-0">
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
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.productSlug}`}
                            className="text-sm font-semibold text-text-main hover:text-primary transition-colors truncate block"
                          >
                            {item.productName}
                          </Link>
                          <div className="text-xs text-text-muted mt-0.5 space-x-2 font-sans not-italic tabular-nums">
                            {item.variantName && <span>Palette: {item.variantName}</span>}
                            <span>Qty: <strong className="text-text-main">{item.quantity}</strong></span>
                            <span>&bull;</span>
                            <span>{formatINR(item.unitPrice)} each</span>
                          </div>
                          {item.personalizationText && (
                            <p className="text-[11px] text-primary/90 mt-1 italic truncate">
                              &ldquo;{item.personalizationText}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Line Subtotal */}
                      <div className="text-right shrink-0">
                        <p className="text-sm sm:text-base font-bold text-text-main font-sans not-italic tabular-nums">
                          {formatINR(item.lineSubtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer with Total & Strategic CTAs */}
                <div className="p-5 sm:p-6 bg-surface-warm/30 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                        Total Amount Paid
                      </span>
                      <p className="font-sans not-italic tabular-nums text-lg sm:text-xl font-extrabold text-primary">
                        {formatINR(order.totalAmount)}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(
                        `Hi DivijaArtHouse Concierge, I have a question regarding my order: #${order.orderNumber}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-emerald-700 transition-colors"
                      title="Need help with this order? Chat with concierge"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Concierge Help</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* 1-Click Track Order */}
                    <Link
                      href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs hover:shadow-wine-glow transition-all active:scale-[0.98]"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Parcel</span>
                    </Link>

                    {/* 1-Click Reorder Button */}
                    <ReorderButton items={order.items} />

                    {/* View Formal Order Confirmation Receipt */}
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white hover:bg-surface-warm text-text-main hover:text-primary border border-border-subtle text-xs font-semibold transition-colors shadow-2xs"
                    >
                      <span>Receipt</span>
                      <ExternalLink className="w-3 h-3 text-text-subtle" />
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
