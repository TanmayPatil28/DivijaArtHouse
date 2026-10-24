'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  Home,
  ShoppingBag,
  Sparkles,
  Flower2,
  Gift,
  Smile,
  HeartHandshake,
  BookOpen,
  Phone,
  ArrowRight,
  Heart,
  User,
} from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistCount?: number;
  cartCount?: number;
  onOpenCart?: () => void;
  navItems?: Array<{ name: string; href: string; badge?: string }>;
}

const NAV_LINKS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Shop All', href: '/shop', icon: ShoppingBag, badge: 'Popular' },
  { name: 'Bouquets', href: '/collections/bouquets', icon: Flower2 },
  { name: 'Flower Pots', href: '/collections/flower-pots', icon: Sparkles },
  { name: 'Gift Boxes', href: '/collections/gift-boxes', icon: Gift },
  { name: 'Hair Accessories', href: '/collections/hair-accessories', icon: Smile },
  { name: 'Our Story', href: '/about', icon: BookOpen },
  { name: 'Contact', href: '/contact', icon: Phone },
];

export function MobileNavDrawer({
  isOpen,
  onClose,
  wishlistCount = 0,
  cartCount = 0,
  onOpenCart,
  navItems,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const itemsToRender =
    navItems && navItems.length > 0
      ? navItems.map((item) => {
          const match = NAV_LINKS.find((nl) => nl.href === item.href);
          return {
            name: item.name,
            href: item.href,
            icon: match ? match.icon : Flower2,
            badge: item.badge,
          };
        })
      : NAV_LINKS;

  // Close drawer automatically on route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname, isOpen, onClose]);

  // Trap focus & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed top-0 left-0 bottom-0 z-50 w-full max-w-xs bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-surface-warm">
          <Link
            href="/"
            onClick={onClose}
            className="text-xl font-semibold text-primary tracking-tight"
          >
            Divija Art House
          </Link>
          <button
            ref={firstFocusableRef}
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-blush-soft text-text-muted hover:text-text-main transition-colors"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Tagline Pill */}
        <div className="px-5 py-2.5 bg-blush-soft/60 border-b border-blush text-center">
          <p className="text-xs font-medium text-primary">
            &ldquo;Little Blooms, Lasting Feelings.&rdquo;
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1" data-lenis-prevent>
          {itemsToRender.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blush-soft text-primary font-semibold'
                    : 'text-text-main hover:bg-surface-warm hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-white uppercase tracking-wider">
                    {link.badge}
                  </span>
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted/60" />
                )}
              </Link>
            );
          })}

          {/* Quick Wishlist Link */}
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-text-main hover:bg-surface-warm hover:text-primary transition-colors border-t border-border-subtle mt-3 pt-3"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-primary" />
              <span>My Wishlist</span>
            </div>
            {wishlistCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-sans not-italic tabular-nums bg-primary text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Quick Account Link */}
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-text-main hover:bg-surface-warm hover:text-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-primary" />
              <span>My Account</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted/60" />
          </Link>

          {/* Quick Cart Bag Trigger */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenCart) {
                onOpenCart();
              }
            }}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-text-main hover:bg-surface-warm hover:text-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span>Shopping Bag</span>
            </div>
            {cartCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-sans not-italic tabular-nums bg-primary text-white">
                {cartCount}
              </span>
            )}
          </button>
        </nav>

        {/* Drawer Footer with Craft Note */}
        <div className="p-4 border-t border-border-subtle bg-surface-warm">
          <div className="rounded-lg p-3 bg-white border border-border-subtle text-xs text-text-muted space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-text-main">
              <HeartHandshake className="w-3.5 h-3.5 text-primary" />
              <span>Handcrafted in India</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every petal is individually hand-crocheted with pure cotton yarn.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
