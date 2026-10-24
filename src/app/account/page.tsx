import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { formatDate, formatINR } from '@/lib/utils';
import { handleSignOut } from '@/actions/auth';
import {
  User,
  ShoppingBag,
  Heart,
  ShieldAlert,
  ArrowRight,
  LogOut,
  Calendar,
  Mail,
  Phone,
  Sparkles,
  Package,
  Truck,
  MapPin,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { OrderProgressBar } from '@/components/account/OrderProgressBar';
import { CopyOrderNumber } from '@/components/account/CopyOrderNumber';

export const metadata = {
  title: 'My Account | DivijaArtHouse Handcrafted Blooms',
  description: 'Manage your DivijaArtHouse atelier profile, recent orders, and delivery addresses.',
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin?callbackUrl=/account');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
    },
  });

  if (!user) {
    redirect('/signin');
  }

  // Calculate user account metrics
  const ordersCount = await prisma.order.count({
    where: {
      OR: [{ userId: user.id }, { customerEmail: user.email }],
    },
  });

  const wishlistCount = await prisma.wishlistItem.count({
    where: { userId: user.id },
  });

  // Fetch most recent order for Spotlight Card
  const recentOrder = await prisma.order.findFirst({
    where: {
      OR: [{ userId: user.id }, { customerEmail: user.email }],
    },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const defaultAddress = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];

  const userInitials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'DA';

  return (
    <div className="min-h-screen bg-canvas py-8 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. LUXURY ATELIER MEMBER WELCOME HEADER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gold/40 shadow-xs relative overflow-hidden">
          {/* Ambient background glows */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Monogram Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-gold-light via-blush-soft to-white text-primary text-xl sm:text-2xl font-serif font-bold tracking-tight flex items-center justify-center border border-gold/40 shadow-xs shrink-0">
                {userInitials}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-text-main">
                    {user.name || 'Valued Patron'}
                  </h1>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      user.role === 'ADMIN'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-gold-light text-gold-hover border border-gold/30'
                    }`}
                  >
                    {user.role === 'ADMIN' ? 'Atelier Admin' : 'Atelier Member'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-text-muted flex items-center gap-1.5 font-sans not-italic tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Atelier Member since {formatDate(user.createdAt)}</span>
                </p>
              </div>
            </div>

            {/* Sign Out Action */}
            <form action={handleSignOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-red-700 bg-surface-warm hover:bg-red-50 border border-border-subtle transition-colors shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* 2. REFINED STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Orders Stat */}
          <div className="bg-white p-6 rounded-3xl border border-border-subtle hover:border-gold/40 shadow-xs hover:shadow-gold-soft transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Total Orders
                </p>
                <p className="font-sans not-italic tabular-nums text-3xl font-extrabold text-text-main mt-1">
                  {ordersCount}
                </p>
              </div>
              <div className="p-3 bg-gold-light rounded-2xl text-gold-hover border border-gold/30">
                <ShoppingBag className="w-5 h-5 text-gold" />
              </div>
            </div>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors"
            >
              <span>View order history</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Wishlist Stat */}
          <div className="bg-white p-6 rounded-3xl border border-border-subtle hover:border-gold/40 shadow-xs hover:shadow-gold-soft transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Saved Blooms
                </p>
                <p className="font-sans not-italic tabular-nums text-3xl font-extrabold text-text-main mt-1">
                  {wishlistCount}
                </p>
              </div>
              <div className="p-3 bg-blush-soft rounded-2xl text-primary border border-blush">
                <Heart className="w-5 h-5 fill-primary/20 text-primary" />
              </div>
            </div>
            <Link
              href="/wishlist"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors"
            >
              <span>View saved wishlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Patron Status */}
          <div className="bg-white p-6 rounded-3xl border border-border-subtle hover:border-gold/40 shadow-xs hover:shadow-gold-soft transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Atelier Privilege
                </p>
                <p className="font-serif text-lg font-bold text-text-main mt-1">
                  Everlasting Patron
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700 border border-emerald-200">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-text-muted leading-tight">
              Complimentary gift card &amp; floral cushioning on every dispatch.
            </p>
          </div>
        </div>

        {/* 3. RECENT ORDER SPOTLIGHT (OR SHOP INVITATION IF NO ORDERS) */}
        {recentOrder ? (
          <div className="bg-white rounded-3xl border border-gold/40 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle/80 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-hover flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>Recent Order Spotlight</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-bold font-mono text-text-main">
                    #{recentOrder.orderNumber}
                  </h3>
                  <CopyOrderNumber orderNumber={recentOrder.orderNumber} />
                </div>
                <p className="text-xs text-text-muted font-sans not-italic tabular-nums">
                  Placed on {formatDate(recentOrder.createdAt)} &bull; Total: <strong className="text-primary font-bold">{formatINR(recentOrder.totalAmount)}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  href={`/track-order?orderNumber=${encodeURIComponent(recentOrder.orderNumber)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs hover:shadow-wine-glow transition-all active:scale-[0.98]"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Parcel Live</span>
                </Link>
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-warm hover:bg-border-subtle/50 text-text-main text-xs font-semibold border border-border-subtle transition-colors"
                >
                  <span>All Orders ({ordersCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Live Progress Bar */}
            <OrderProgressBar status={recentOrder.orderStatus} />

            {/* Preview of Items in Recent Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {recentOrder.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-surface-warm/50 border border-border-subtle/60 flex items-center gap-3"
                >
                  <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden border border-border-subtle shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        unoptimized={item.image.endsWith('.svg')}
                        className="object-contain p-0.5"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/40">
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-main truncate">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-text-muted font-sans not-italic tabular-nums">
                      Qty: {item.quantity} &times; {formatINR(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gold/30 p-8 sm:p-10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-hover">
                Handcrafted Blooms
              </span>
              <h3 className="font-serif font-bold text-xl text-text-main">
                Begin Your Everlasting Flower Story
              </h3>
              <p className="text-xs sm:text-sm text-text-muted max-w-md">
                Every stem is lovingly crocheted by women artisans with premium milk cotton yarn. Discover everlasting joy.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-wine-glow transition-all shrink-0 active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Blooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* 4. ADDRESS BOOK & CONCIERGE ASSISTANCE (TWO COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Quick Navigation & Admin Gate (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-serif text-lg font-bold text-text-main">
              Atelier Member Hub
            </h2>

            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="group flex items-center justify-between p-5 rounded-3xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/70 transition-all shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-amber-200 text-amber-900">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-950 group-hover:text-primary transition-colors">
                      Atelier Admin Dashboard
                    </h3>
                    <p className="text-xs text-amber-800/80">
                      Manage product catalog, order dispatches, and AWB logistics
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-800 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            <Link
              href="/account/orders"
              className="group flex items-center justify-between p-5 rounded-3xl bg-white border border-border-subtle hover:border-gold/50 hover:bg-surface-warm/30 transition-all shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gold-light text-gold-hover border border-gold/30">
                  <Package className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">
                    Order History &amp; Reorders
                  </h3>
                  <p className="text-xs text-text-muted">
                    Track dispatches, reorder favorite bouquets, and review invoices
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/track-order"
              className="group flex items-center justify-between p-5 rounded-3xl bg-white border border-border-subtle hover:border-gold/50 hover:bg-surface-warm/30 transition-all shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blush-soft text-primary border border-blush">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">
                    Live Courier Tracker
                  </h3>
                  <p className="text-xs text-text-muted">
                    Instant lookup with AWB and delivery partner status
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/wishlist"
              className="group flex items-center justify-between p-5 rounded-3xl bg-white border border-border-subtle hover:border-gold/50 hover:bg-surface-warm/30 transition-all shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gold-light text-gold-hover border border-gold/30">
                  <Heart className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">
                    Saved Floral Wishlist
                  </h3>
                  <p className="text-xs text-text-muted">
                    Curate and transfer saved blooms into your shopping bag
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Column: Contact & Delivery Address (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-serif text-lg font-bold text-text-main">
              Delivery &amp; Concierge
            </h2>

            {/* Profile Info */}
            <div className="bg-white rounded-3xl p-6 border border-border-subtle shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Account Name
                  </p>
                  <p className="text-sm font-semibold text-text-main mt-0.5">
                    {user.name || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-text-main mt-0.5 break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {defaultAddress ? (
                <div className="pt-3 border-t border-border-subtle space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>Primary Delivery Address</span>
                  </div>
                  <p className="text-xs text-text-main font-medium leading-relaxed pt-1">
                    {defaultAddress.addressLine1}
                    {defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''}
                    <br />
                    {defaultAddress.city}, {defaultAddress.state} &ndash; <strong className="font-sans not-italic tabular-nums">{defaultAddress.pincode}</strong>
                  </p>
                </div>
              ) : (
                <div className="pt-3 border-t border-border-subtle text-xs text-text-muted">
                  <span>No saved address on file yet. Address is automatically remembered during checkout.</span>
                </div>
              )}

              {/* 1-Click WhatsApp VIP Concierge */}
              <div className="pt-4 border-t border-border-subtle">
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hi DivijaArtHouse Concierge, my name is ${user.name || 'Member'}. I would like to inquire about my account/orders.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Atelier Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
