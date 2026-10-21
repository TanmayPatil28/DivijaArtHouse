'use client';

import { useState, useEffect } from 'react';
import type { CartItem } from '@/types';

const CART_KEY = 'divija_cart';
const WISHLIST_KEY = 'divija_wishlist';

export function getLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('divija:cart-updated', { detail: items }));
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
  }
}

export function addToLocalCart(item: CartItem): void {
  const current = getLocalCart();
  const existingIndex = current.findIndex(
    (i) => i.productId === item.productId && i.variantId === item.variantId
  );

  if (existingIndex > -1) {
    current[existingIndex].quantity += item.quantity;
  } else {
    current.push(item);
  }

  saveLocalCart(current);
}

export function getLocalWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleLocalWishlist(productId: string): boolean {
  const list = getLocalWishlist();
  const index = list.indexOf(productId);
  let isWishlisted = false;

  if (index > -1) {
    list.splice(index, 1);
    isWishlisted = false;
  } else {
    list.push(productId);
    isWishlisted = true;
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
      window.dispatchEvent(
        new CustomEvent('divija:wishlist-updated', {
          detail: { list, toggledId: productId, isWishlisted },
        })
      );
    } catch (err) {
      console.error('Failed to save wishlist:', err);
    }
  }

  return isWishlisted;
}

export function useCartCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const items = getLocalCart();
      const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCount(total);
    };

    update();
    window.addEventListener('divija:cart-updated', update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('divija:cart-updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return count;
}

export function useWishlist(): {
  wishlist: string[];
  isWishlisted: (id: string) => boolean;
  toggle: (id: string) => void;
} {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      setWishlist(getLocalWishlist());
    };

    update();
    window.addEventListener('divija:wishlist-updated', update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('divija:wishlist-updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return {
    wishlist,
    isWishlisted: (id: string) => wishlist.includes(id),
    toggle: (id: string) => {
      toggleLocalWishlist(id);
    },
  };
}
