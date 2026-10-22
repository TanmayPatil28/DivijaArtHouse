'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { getWishlistProducts } from '@/actions/wishlist';
import type { ProductWithCategory, CartItem } from '@/types';
import { formatINR, calculateDiscount, parseJson } from '@/lib/utils';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, isHydrated } = useWishlist();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Fetch product data whenever the wishlist IDs change
  useEffect(() => {
    if (!isHydrated) return;

    if (wishlist.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    startTransition(async () => {
      try {
        const data = await getWishlistProducts(wishlist);
        setProducts(data);
      } catch (err) {
        console.error('Error loading wishlist items:', err);
      } finally {
        setIsLoading(false);
      }
    });
  }, [wishlist, isHydrated]);

  const handleMoveToBag = (product: ProductWithCategory) => {
    setMovingId(product.id);

    const images = parseJson<string[]>(product.images, []);
    const mainImage = images[0] || '/images/products/blushing-peony-rose-1.svg';

    const item: CartItem = {
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: mainImage,
      unitPrice: product.price,
      quantity: 1,
      stock: product.stockQuantity,
    };

    // Add to cart (which also opens the cart drawer)
    addToCart(item);

    // Remove from wishlist
    removeFromWishlist(product.id);

    setTimeout(() => {
      setMovingId(null);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-canvas py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-3">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-main font-medium">My Wishlist</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-subtle">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs mb-2 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Saved For Later</span>
              </div>
              <h1 className="font-semibold text-3xl sm:text-4xl tracking-tight text-text-main">
                My Saved{' '}
                <span className="font-serif italic font-normal text-primary">
                  Everlasting Blooms.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-text-muted mt-1.5">
                Your personal sanctuary of handcrafted everlasting florals.
              </p>
            </div>
            {wishlist.length > 0 && (
              <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold bg-blush-soft text-primary border border-blush">
                {wishlist.length} {wishlist.length === 1 ? 'bloom saved' : 'blooms saved'}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        {!isHydrated || (isLoading && products.length === 0) ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border-subtle p-4 space-y-3 animate-pulse"
              >
                <div className="aspect-square bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-9 bg-gray-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 || products.length === 0 ? (
          /* Empty Wishlist State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
            <div className="relative w-24 h-24 rounded-full bg-blush-soft/80 border border-blush flex items-center justify-center shadow-inner mb-6">
              <Heart className="w-12 h-12 text-primary" />
              <div className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-xs">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>

            <h2 className="font-semibold text-2xl text-text-main tracking-tight mb-2">
              Your wishlist is{' '}
              <span className="font-serif italic font-normal text-primary">
                currently empty.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
              Explore our handcrafted bouquets, everlasting floral pots, and thoughtful gift boxes. Save your favorite pieces to revisit them anytime.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Wishlist Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              const images = parseJson<string[]>(product.images, []);
              const mainImage =
                images[0] || '/images/products/blushing-peony-rose-1.svg';
              const discountPercent = calculateDiscount(
                product.price,
                product.compareAtPrice
              );
              const isOutOfStock = product.stockQuantity <= 0;
              const isMoving = movingId === product.id;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col bg-white rounded-2xl border border-border-subtle overflow-hidden hover:shadow-lg hover:border-blush transition-all duration-300"
                >
                  {/* Product Image Area */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-surface-warm to-blush-soft/40 p-4 overflow-hidden">
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative block w-full h-full transition-transform duration-500 group-hover:scale-105"
                    >
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        unoptimized={mainImage.endsWith('.svg')}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-2"
                      />
                    </Link>

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-sm font-sans not-italic tabular-nums">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {/* Remove from Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-text-muted hover:text-red-600 hover:bg-white shadow-sm backdrop-blur-xs transition-colors"
                      aria-label={`Remove ${product.name} from wishlist`}
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Category */}
                      {product.category?.name && (
                        <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1 line-clamp-1">
                          {product.category.name}
                        </p>
                      )}

                      {/* Title */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="block font-medium text-[15px] sm:text-base tracking-tight text-text-main hover:text-primary transition-colors line-clamp-2 leading-snug mb-2"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div>
                      {/* Price & Stock */}
                      <div className="flex items-baseline justify-between gap-2 mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-base sm:text-lg text-primary font-sans not-italic tabular-nums">
                            {formatINR(product.price)}
                          </span>
                          {product.compareAtPrice &&
                            product.compareAtPrice > product.price && (
                              <span className="text-xs text-text-muted line-through font-sans not-italic tabular-nums">
                                {formatINR(product.compareAtPrice)}
                              </span>
                            )}
                        </div>

                        {/* Stock indicator badge */}
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider ${
                            isOutOfStock ? 'text-red-500' : 'text-green-700'
                          }`}
                        >
                          {isOutOfStock ? 'Sold out' : 'In Stock'}
                        </span>
                      </div>

                      {/* Action: Move to Bag */}
                      <button
                        type="button"
                        onClick={() => handleMoveToBag(product)}
                        disabled={isOutOfStock || isMoving}
                        className={`w-full py-2.5 px-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          isMoving
                            ? 'bg-green-600 text-white'
                            : isOutOfStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-hover text-white active:scale-[0.98]'
                        }`}
                      >
                        {isMoving ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Moved to Bag</span>
                          </>
                        ) : isOutOfStock ? (
                          <span>Out of Stock</span>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Move to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

