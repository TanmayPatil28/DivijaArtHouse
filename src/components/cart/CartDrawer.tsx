'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { FreeShippingBar } from './FreeShippingBar';
import { CartDrawerItem } from './CartDrawerItem';

export function CartDrawer() {
  const { items, summary, isOpen, closeCart } = useCart();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard accessibility (Escape key and focus trapping)
  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scrolling while drawer is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const focusTimeout = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(focusTimeout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleShopRedirect = () => {
    closeCart();
    router.push('/shop');
  };

  return (
    <>
      {/* Semi-transparent Backdrop with Blur */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-out Sheet Drawer from Right */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your Floral Bag"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-lg text-text-main">
              Your Floral Bag
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blush-soft text-primary">
              {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-surface-warm transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (always shown when drawer is open) */}
        <div className="px-5 py-3 border-b border-border-subtle bg-surface-warm/40 flex-shrink-0">
          <FreeShippingBar
            subtotal={summary.subtotal}
            remainingForFreeShipping={summary.remainingForFreeShipping}
          />
        </div>

        {/* Drawer Body: Line Items or Empty State */}
        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 overflow-y-auto">
            <div className="relative w-24 h-24 rounded-full bg-blush-soft/70 border border-blush flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-12 h-12 text-primary" />
              <div className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-xs">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>

            <div className="max-w-xs space-y-2">
              <h3 className="font-display font-bold text-xl text-text-main">
                Your floral bag is empty
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Explore our handcrafted bouquets and everlasting floral gifts designed to keep your moments blooming forever.
              </p>
            </div>

            <button
              type="button"
              onClick={handleShopRedirect}
              className="mt-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white transition-all shadow-sm active:scale-[0.98] flex items-center gap-2"
            >
              <span>Explore Blooms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Scrollable Line Items List */
          <div className="flex-1 overflow-y-auto px-5 divide-y divide-border-subtle">
            {items.map((item) => (
              <CartDrawerItem
                key={item.id}
                item={item}
                onItemClick={closeCart}
              />
            ))}
          </div>
        )}

        {/* Footer (shown when cart has items) */}
        {items.length > 0 && (
          <div className="border-t border-border-subtle bg-surface-warm/40 p-5 space-y-3.5 flex-shrink-0 shadow-lg">
            {/* Subtotal Breakdown */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="font-medium text-text-main">
                  {formatINR(summary.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-text-muted">
                <span>Estimated Shipping</span>
                <span
                  className={
                    summary.shippingFee === 0
                      ? 'text-green-700 font-semibold uppercase'
                      : 'font-medium text-text-main'
                  }
                >
                  {summary.shippingFee === 0
                    ? 'FREE'
                    : formatINR(summary.shippingFee)}
                </span>
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-baseline justify-between">
                <div>
                  <span className="font-display font-bold text-base text-text-main">
                    Estimated Total
                  </span>
                  <p className="text-[10px] text-text-muted">
                    Inclusive of all taxes
                  </p>
                </div>
                <span className="font-display font-bold text-xl text-primary">
                  {formatINR(summary.totalAmount)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={closeCart}
                className="w-full py-2.5 text-xs font-medium text-text-muted hover:text-primary transition-colors text-center block"
              >
                or Continue Shopping
              </button>
            </div>

            {/* Trust Micro-Copy */}
            <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Safe & Secure Checkout • Pan-India Express Delivery</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
