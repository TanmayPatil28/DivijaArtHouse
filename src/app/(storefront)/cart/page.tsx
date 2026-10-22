'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Gift,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { FreeShippingBar } from '@/components/cart/FreeShippingBar';

const FALLBACK_IMAGE = '/images/products/blushing-peony-rose-1.svg';

export default function CartPage() {
  const { items, summary, updateQuantity, removeItem, clearCart, isHydrated } =
    useCart();
  const router = useRouter();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-canvas py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-3">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-main font-medium">Shopping Bag</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-subtle">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs mb-2 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Atelier Gifting Bag</span>
              </div>
              <h1 className="font-semibold text-3xl sm:text-4xl tracking-tight text-text-main">
                Your Everlasting{' '}
                <span className="font-serif italic font-normal text-primary">
                  Floral Bag.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-text-muted mt-1.5">
                Carefully hand-crocheted everlasting blossoms, wrapped with love.
              </p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="self-start sm:self-auto text-xs text-text-muted hover:text-red-600 transition-colors underline"
              >
                Clear Bag
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
            <div className="relative w-24 h-24 rounded-full bg-blush-soft/80 border border-blush flex items-center justify-center shadow-inner mb-6">
              <ShoppingBag className="w-12 h-12 text-primary" />
              <div className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-xs">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>

            <h2 className="font-semibold text-2xl text-text-main tracking-tight mb-2">
              Your floral bag is{' '}
              <span className="font-serif italic font-normal text-primary">
                currently empty.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
              Explore our handcrafted bouquets and everlasting floral gifts designed to keep your moments blooming forever.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Explore Blooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Cart Content: Line Items (Left) + Order Summary (Right) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left 7/12: Line Items */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <FreeShippingBar
                subtotal={summary.subtotal}
                remainingForFreeShipping={summary.remainingForFreeShipping}
              />

              <div className="bg-white rounded-2xl border border-border-subtle divide-y divide-border-subtle p-4 sm:p-6 shadow-xs">
                {items.map((item) => {
                  const lineTotal = item.unitPrice * (item.quantity || 1);
                  const maxStock = item.stock;
                  const isAtMin = item.quantity <= 1;
                  const isAtMax =
                    maxStock !== undefined &&
                    maxStock !== null &&
                    item.quantity >= maxStock;

                  return (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/products/${item.slug}`}
                          className="relative w-20 h-20 rounded-xl bg-surface-warm border border-border-subtle overflow-hidden flex-shrink-0"
                        >
                          <Image
                            src={item.image || FALLBACK_IMAGE}
                            alt={item.name}
                            fill
                            unoptimized={typeof item.image === 'string' && item.image.endsWith('.svg')}
                            sizes="80px"
                            className="object-contain p-1.5"
                          />
                        </Link>

                        <div className="space-y-1">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-medium text-sm sm:text-base tracking-tight text-text-main hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>

                          {item.variantName && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-warm text-text-muted border border-border-subtle">
                              Style: {item.variantName}
                            </span>
                          )}

                          {item.personalization && (
                            <div className="flex items-center gap-1 text-[11px] text-text-muted bg-blush-soft/40 px-2 py-0.5 rounded">
                              <Gift className="w-3 h-3 text-primary flex-shrink-0" />
                              <span className="line-clamp-1 italic">
                                &ldquo;{item.personalization}&rdquo;
                              </span>
                            </div>
                          )}

                          <div className="text-xs text-text-muted sm:hidden font-sans not-italic tabular-nums">
                            {formatINR(item.unitPrice)} each
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle/50">
                        {/* Stepper */}
                        <div className="flex items-center border border-border-subtle rounded-lg bg-white overflow-hidden shadow-2xs h-8">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={isAtMin}
                            className="w-7 h-full flex items-center justify-center text-text-main hover:bg-surface-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm select-none"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-semibold font-sans not-italic tabular-nums select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={isAtMax}
                            className="w-7 h-full flex items-center justify-center text-text-main hover:bg-surface-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm select-none"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[80px]">
                          <div className="font-bold text-sm sm:text-base text-text-main font-sans not-italic tabular-nums">
                            {formatINR(lineTotal)}
                          </div>
                          <div className="hidden sm:block text-[11px] text-text-muted font-sans not-italic tabular-nums">
                            {formatINR(item.unitPrice)} each
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-text-muted hover:text-red-600 transition-colors rounded-lg hover:bg-surface-warm"
                          aria-label={`Remove ${item.name} from bag`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping Handcrafted Blooms</span>
              </Link>
            </div>

            {/* Right 5/12: Order Summary Card */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white rounded-2xl border border-border-subtle p-6 space-y-5 sticky top-28 shadow-sm">
                <h2 className="font-semibold text-lg text-text-main tracking-tight border-b border-border-subtle pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-text-muted">
                    <span>
                      Subtotal ({summary.itemCount}{' '}
                      {summary.itemCount === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-semibold text-text-main font-sans not-italic tabular-nums">
                      {formatINR(summary.subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-text-muted">
                    <span>Estimated Shipping</span>
                    <span
                      className={
                        summary.shippingFee === 0
                          ? 'text-green-700 font-semibold font-sans not-italic'
                          : 'font-semibold text-text-main font-sans not-italic tabular-nums'
                      }
                    >
                      {summary.shippingFee === 0
                        ? 'FREE'
                        : formatINR(summary.shippingFee)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-baseline justify-between">
                    <div>
                      <span className="font-semibold text-base text-text-main tracking-tight">
                        Total Amount
                      </span>
                      <p className="text-[11px] text-text-muted">
                        Inclusive of all taxes
                      </p>
                    </div>
                    <span className="font-bold text-2xl text-primary tracking-tight font-sans not-italic tabular-nums">
                      {formatINR(summary.totalAmount)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/checkout')}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 border-t border-border-subtle space-y-2 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Safe & encrypted payments with Razorpay & COD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Bespoke presentation packaging on every order</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
