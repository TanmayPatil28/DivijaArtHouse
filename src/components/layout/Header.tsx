'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  User,
} from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';
import { SearchModal } from './SearchModal';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const MAIN_NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Shop All', href: '/shop' },
  { name: 'OHP Rangoli', href: '/collections/ohp-sheets-rangoli' },
  { name: 'Woolen Rangoli', href: '/collections/woolen-rangoli' },
  { name: 'Pipe Cleaner Crafts', href: '/collections/pipe-cleaner-crafts' },
  { name: 'Decore Crafts', href: '/collections/decore-crafts' },
  { name: 'Our Story', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

interface HeaderProps {
  navItems?: Array<{ name: string; href: string; isEnabled?: boolean; badge?: string }>;
}

export function Header({ navItems }: HeaderProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const itemsToRender =
    navItems && navItems.length > 0
      ? navItems.filter((i) => i.isEnabled !== false)
      : MAIN_NAV_ITEMS;

  const { summary, openCart, isHydrated: isCartHydrated } = useCart();
  const { wishlistCount, isHydrated: isWishlistHydrated } = useWishlist();

  const activeCartCount = isCartHydrated ? summary.itemCount : 0;
  const activeWishlistCount = isWishlistHydrated ? wishlistCount : 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border-subtle transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile Hamburger Toggle */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-lg text-text-main hover:text-primary hover:bg-surface-warm transition-colors"
                aria-label="Open mobile navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Wordmark with Visiting Card Heart Accent */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="group flex flex-col items-center md:items-start select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl sm:text-[26px] font-semibold tracking-tight text-text-main group-hover:text-primary transition-colors">
                    Divija Art House
                  </span>
                  <Heart className="w-4 h-4 text-primary fill-primary/80 transform group-hover:scale-110 transition-transform" />
                </div>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest text-text-muted font-medium">
                  Handcrafted Floral Gifts
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden lg:flex items-center space-x-6 xl:space-x-8"
              aria-label="Main Store Navigation"
            >
              {itemsToRender.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? 'text-primary font-semibold'
                        : 'text-text-main hover:text-primary'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Wishlist, Cart) */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search Icon Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-text-main hover:text-primary hover:bg-surface-warm transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Heart Counter */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-full text-text-main hover:text-primary hover:bg-surface-warm transition-colors"
                aria-label={`Wishlist with ${activeWishlistCount} items`}
              >
                <Heart className="w-5 h-5" />
                {activeWishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold font-sans not-italic tabular-nums text-white bg-primary rounded-full shadow-sm">
                    {activeWishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account Link */}
              <Link
                href="/account"
                className="p-2 rounded-full text-text-main hover:text-primary hover:bg-surface-warm transition-colors"
                aria-label="My Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Bag Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 rounded-full text-text-main hover:text-primary hover:bg-surface-warm transition-colors"
                aria-label={`Shopping bag with ${activeCartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {activeCartCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold font-sans not-italic tabular-nums text-white bg-primary rounded-full shadow-sm animate-scale-in">
                    {activeCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tablet Navigation Bar (visible on md to lg screens) */}
        <div className="hidden md:flex lg:hidden border-t border-border-subtle bg-surface-warm/50 px-4 py-2 overflow-x-auto justify-center gap-5 text-xs font-medium">
          {itemsToRender.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-primary font-bold border-b border-primary'
                    : 'text-text-main hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Accessible Mobile Slide-Out Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        wishlistCount={activeWishlistCount}
        cartCount={activeCartCount}
        onOpenCart={openCart}
        navItems={itemsToRender}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
