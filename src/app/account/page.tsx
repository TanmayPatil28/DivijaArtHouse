import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
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
} from 'lucide-react';

export const metadata = {
  title: 'My Account | DivijaArtHouse',
  description: 'Manage your DivijaArtHouse customer profile and view order history.',
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

  const defaultAddress = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];

  return (
    <div className="min-h-screen bg-surface-warm/30 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border-subtle mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blush-soft text-primary text-2xl sm:text-3xl font-semibold tracking-tight flex items-center justify-center border border-blush shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-main">
                  {user.name || 'Dear Customer'}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    user.role === 'ADMIN'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-blush text-primary border border-blush-soft'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Member since {formatDate(user.createdAt)}</span>
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <form action={handleSignOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-text-muted hover:text-red-700 bg-surface-warm hover:bg-red-50 border border-border-subtle transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Total Orders
                </p>
                <p className="font-sans text-3xl font-bold text-text-main mt-1">
                  {ordersCount}
                </p>
              </div>
              <div className="p-3 bg-blush-soft rounded-2xl text-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <Link
              href="/account/orders"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              <span>View order history</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Wishlist Items
                </p>
                <p className="font-sans text-3xl font-bold text-text-main mt-1">
                  {wishlistCount}
                </p>
              </div>
              <div className="p-3 bg-blush-soft rounded-2xl text-primary">
                <Heart className="w-6 h-6" />
              </div>
            </div>
            <Link
              href="/wishlist"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              <span>View your wishlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Account Status
                </p>
                <p className="font-sans text-2xl font-bold text-emerald-700 mt-1">
                  Verified
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-4 text-xs text-text-muted">
              Full access to orders & wishlist
            </p>
          </div>
        </div>

        {/* Action Hub & Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Action Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-sans text-xl font-bold text-text-main">
              Account Hub
            </h2>

            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="group flex items-center justify-between p-5 rounded-2xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/70 transition-all shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-200 text-amber-900">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-amber-950 group-hover:text-primary transition-colors">
                      Admin Dashboard
                    </h3>
                    <p className="text-xs text-amber-800/80">
                      Access store management, products CRUD, inventory, and order fulfillment
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-800 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            <Link
              href="/account/orders"
              className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-border-subtle hover:border-primary/40 hover:bg-surface-warm/40 transition-all shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blush-soft text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-main group-hover:text-primary transition-colors">
                    Order History
                  </h3>
                  <p className="text-xs text-text-muted">
                    Track current parcels, download receipts, and review past deliveries
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop"
              className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-border-subtle hover:border-primary/40 hover:bg-surface-warm/40 transition-all shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blush-soft text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-main group-hover:text-primary transition-colors">
                    Continue Shopping
                  </h3>
                  <p className="text-xs text-text-muted">
                    Discover new handcrafted crochet bouquets, flower pots, and gift hampers
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Profile Details Sidebar */}
          <div className="space-y-4">
            <h2 className="font-sans text-xl font-bold text-text-main">
              Contact Details
            </h2>

            <div className="bg-white rounded-2xl p-6 border border-border-subtle shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Name
                  </p>
                  <p className="text-sm font-medium text-text-main mt-0.5">
                    {user.name || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Email
                  </p>
                  <p className="text-sm font-medium text-text-main mt-0.5 break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-text-main mt-0.5">
                    {user.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {defaultAddress && (
                <div className="pt-3 border-t border-border-subtle">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Primary Address
                  </p>
                  <p className="text-xs text-text-main font-medium leading-relaxed">
                    {defaultAddress.addressLine1}
                    {defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''}
                    <br />
                    {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
