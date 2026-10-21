'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { CartItem, CartSummary } from '@/types';

export const CART_STORAGE_KEY = 'divija_cart';
export const FREE_SHIPPING_THRESHOLD = 99900; // ₹999 in integer paise
export const STANDARD_SHIPPING_FEE = 9900; // ₹99 in integer paise

export interface CartContextValue {
  items: CartItem[];
  summary: CartSummary;
  isOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

/**
 * Pure integer paise calculation of cart summary
 */
export function calculateCartSummary(items: CartItem[]): CartSummary {
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * (item.quantity || 0),
    0
  );

  // If cart is empty, shipping fee is 0; otherwise free if subtotal >= ₹999 (99900 paise)
  const shippingFee =
    subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const taxAmount = 0; // Inclusive in MRP
  const totalAmount = subtotal + shippingFee;

  return {
    subtotal,
    shippingFee,
    taxAmount,
    totalAmount,
    itemCount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    remainingForFreeShipping,
  };
}

/**
 * Generates composite key for line items: `${productId}-${variantId || 'default'}`
 */
export function getCartItemId(productId: string, variantId?: string): string {
  return `${productId}-${variantId || 'default'}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read initial cart from localStorage on client mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to parse cart from localStorage:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Multi-tab synchronization & local event listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        try {
          const updated = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(updated)) {
            setItems(updated);
          }
        } catch (err) {
          console.error('Error handling storage event for cart:', err);
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<CartItem[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setItems(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('divija:cart-sync', handleCustomSync);
    window.addEventListener('divija:cart-updated', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('divija:cart-sync', handleCustomSync);
      window.removeEventListener('divija:cart-updated', handleCustomSync);
    };
  }, []);

  // Helper to persist to localStorage and broadcast sync events
  const persistItems = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
        window.dispatchEvent(
          new CustomEvent('divija:cart-updated', { detail: newItems })
        );
        window.dispatchEvent(
          new CustomEvent('divija:cart-sync', { detail: newItems })
        );
      } catch (err) {
        console.error('Failed to save cart to localStorage:', err);
      }
    }
  }, []);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const addToCart = useCallback(
    (item: CartItem) => {
      const compositeId = item.id || getCartItemId(item.productId, item.variantId);
      const normalizedItem: CartItem = {
        ...item,
        id: compositeId,
      };

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (i) =>
            i.id === compositeId ||
            (i.productId === normalizedItem.productId &&
              (i.variantId || 'default') === (normalizedItem.variantId || 'default'))
        );

        let updatedList: CartItem[];

        if (existingIndex > -1) {
          // Merge quantities for identical product+variant combo
          const existing = prevItems[existingIndex];
          const newQty = (existing.quantity || 1) + (normalizedItem.quantity || 1);
          // If available stock is specified, clamp to stock limit
          const maxStock = normalizedItem.stock ?? existing.stock;
          const clampedQty = maxStock ? Math.min(newQty, maxStock) : newQty;

          const merged: CartItem = {
            ...existing,
            quantity: clampedQty,
            personalization:
              normalizedItem.personalization !== undefined
                ? normalizedItem.personalization
                : existing.personalization,
            unitPrice: normalizedItem.unitPrice || existing.unitPrice,
            stock: maxStock,
          };

          updatedList = [...prevItems];
          updatedList[existingIndex] = merged;
        } else {
          // Add as new line item
          const maxStock = normalizedItem.stock;
          const initialQty = maxStock
            ? Math.min(normalizedItem.quantity || 1, maxStock)
            : normalizedItem.quantity || 1;

          updatedList = [
            ...prevItems,
            {
              ...normalizedItem,
              quantity: Math.max(1, initialQty),
            },
          ];
        }

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedList));
            window.dispatchEvent(
              new CustomEvent('divija:cart-updated', { detail: updatedList })
            );
            window.dispatchEvent(
              new CustomEvent('divija:cart-sync', { detail: updatedList })
            );
          } catch (err) {
            console.error('Failed to save cart to localStorage:', err);
          }
        }

        return updatedList;
      });

      // Adding to cart automatically triggers openCart
      setIsOpen(true);
    },
    []
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      setItems((prevItems) => {
        if (quantity <= 0) {
          const filtered = prevItems.filter((i) => i.id !== itemId);
          persistItems(filtered);
          return filtered;
        }

        const updated = prevItems.map((item) => {
          if (item.id === itemId) {
            const maxStock = item.stock;
            const validQty = maxStock ? Math.min(quantity, maxStock) : quantity;
            return {
              ...item,
              quantity: Math.max(1, validQty),
            };
          }
          return item;
        });

        persistItems(updated);
        return updated;
      });
    },
    [persistItems]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      setItems((prevItems) => {
        const filtered = prevItems.filter((i) => i.id !== itemId);
        persistItems(filtered);
        return filtered;
      });
    },
    [persistItems]
  );

  const clearCart = useCallback(() => {
    persistItems([]);
  }, [persistItems]);

  const summary = useMemo(() => calculateCartSummary(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      summary,
      isOpen,
      isHydrated,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      summary,
      isOpen,
      isHydrated,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
