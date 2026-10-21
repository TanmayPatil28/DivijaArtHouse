'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

export const WISHLIST_STORAGE_KEY = 'divija_wishlist';

export interface WishlistContextValue {
  wishlist: string[];
  wishlistCount: number;
  isHydrated: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read initial wishlist from localStorage on client mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to parse wishlist from localStorage:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Multi-tab synchronization & local event listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY) {
        try {
          const updated = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(updated)) {
            setWishlist(updated);
          }
        } catch (err) {
          console.error('Error handling storage event for wishlist:', err);
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ list?: string[]; detail?: string[] }>;
      const list = customEvent.detail?.list || (Array.isArray(customEvent.detail) ? customEvent.detail : null);
      if (list && Array.isArray(list)) {
        setWishlist(list);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('divija:wishlist-updated', handleCustomSync as EventListener);
    window.addEventListener('divija:wishlist-sync', handleCustomSync as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('divija:wishlist-updated', handleCustomSync as EventListener);
      window.removeEventListener('divija:wishlist-sync', handleCustomSync as EventListener);
    };
  }, []);

  const persistWishlist = useCallback((newList: string[]) => {
    setWishlist(newList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newList));
        window.dispatchEvent(
          new CustomEvent('divija:wishlist-updated', {
            detail: { list: newList },
          })
        );
        window.dispatchEvent(
          new CustomEvent('divija:wishlist-sync', {
            detail: { list: newList },
          })
        );
      } catch (err) {
        console.error('Failed to save wishlist to localStorage:', err);
      }
    }
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prevList) => {
        const index = prevList.indexOf(productId);
        let updated: string[];
        if (index > -1) {
          updated = prevList.filter((id) => id !== productId);
        } else {
          updated = [...prevList, productId];
        }

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
            window.dispatchEvent(
              new CustomEvent('divija:wishlist-updated', {
                detail: { list: updated, toggledId: productId, isWishlisted: index === -1 },
              })
            );
            window.dispatchEvent(
              new CustomEvent('divija:wishlist-sync', {
                detail: { list: updated },
              })
            );
          } catch (err) {
            console.error('Failed to save wishlist to localStorage:', err);
          }
        }

        return updated;
      });
    },
    []
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlist((prevList) => {
        const filtered = prevList.filter((id) => id !== productId);
        persistWishlist(filtered);
        return filtered;
      });
    },
    [persistWishlist]
  );

  const clearWishlist = useCallback(() => {
    persistWishlist([]);
  }, [persistWishlist]);

  const wishlistCount = wishlist.length;

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlist,
      wishlistCount,
      isHydrated,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [
      wishlist,
      wishlistCount,
      isHydrated,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
