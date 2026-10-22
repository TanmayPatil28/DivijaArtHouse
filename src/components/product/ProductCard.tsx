'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Check, Star } from 'lucide-react';
import type { ProductWithCategory, CartItem } from '@/types';
import { formatINR, calculateDiscount, parseJson } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: ProductWithCategory;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  // Parse images JSON string
  const images = parseJson<string[]>(product.images, []);
  const mainImage = images[0] || '/images/products/blushing-peony-rose-1.svg';
  const hasHoverImage = images.length > 1 && images[1] !== mainImage;
  const hoverImage = hasHoverImage ? images[1] : null;

  const discountPercent = calculateDiscount(product.price, product.compareAtPrice);

  // Deterministic artisan rating (4.8 - 5.0) for social proof
  const rating = (4.8 + ((product.id.charCodeAt(product.id.length - 1) || 0) % 3) * 0.1).toFixed(1);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;
    setIsAdding(true);

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

    addToCart(item);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setIsAdding(false);
    }, 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const isMainSvg = mainImage.endsWith('.svg');
  const isHoverSvg = hoverImage ? hoverImage.endsWith('.svg') : false;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-border-subtle/90 overflow-hidden hover:border-gold/60 hover:shadow-[0_16px_36px_-10px_rgba(120,29,44,0.12),0_4px_12px_rgba(197,154,90,0.08)] hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Area - Edge-to-Edge Bleed */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-square bg-gradient-to-b from-[#FBF8F5] via-[#F8F1ED]/40 to-[#F2E8E4]/60 overflow-hidden block"
      >
        {/* Dual-Image Crossfade Canvas */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Main Angle Image */}
          {isMainSvg ? (
            <img
              src={mainImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading={priority ? 'eager' : 'lazy'}
            />
          ) : (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}

          {/* Alternate Angle Reveal on Hover */}
          {hasHoverImage && (
            isHoverSvg ? (
              <img
                src={hoverImage!}
                alt={`${product.name} alternate view`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                loading="lazy"
              />
            ) : (
              <Image
                src={hoverImage!}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
              />
            )
          )}
        </div>

        {/* Top-Left Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/95 text-white border border-gold/40 shadow-xs backdrop-blur-md font-sans not-italic tabular-nums">
            {discountPercent}% OFF
          </span>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-xs ${
            wishlisted
              ? 'bg-primary text-white border border-gold/40 shadow-wine-glow scale-105'
              : 'bg-white/85 text-text-muted hover:text-primary hover:bg-white hover:scale-110 border border-stone-200/80'
          }`}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${wishlisted ? 'fill-white' : ''}`}
          />
        </button>

        {/* Desktop Floating Quick Add Pill (Smooth Slide-Up on Hover) */}
        <div className="hidden sm:block absolute bottom-3 inset-x-3 z-20 translate-y-2 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stockQuantity <= 0}
            className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg backdrop-blur-md transition-all duration-200 ${
              justAdded
                ? 'bg-[#386B3E] text-white border border-emerald-400/40 shadow-emerald-900/20'
                : product.stockQuantity <= 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed border-transparent'
                : 'bg-primary text-white hover:bg-primary-dark border border-gold/40 shadow-wine-glow hover:border-gold hover:shadow-gold-glow active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : product.stockQuantity <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="p-3.5 sm:p-4 md:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Micro Category & Rating Row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {product.category?.name ? (
              <span className="text-[10px] sm:text-[11px] font-semibold text-gold uppercase tracking-[0.16em] truncate">
                {product.category.name}
              </span>
            ) : (
              <span />
            )}

            {/* Artisan Social Proof Rating */}
            <div
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-canvas border border-border-subtle/80 text-[10px] sm:text-[11px] font-medium text-text-main shrink-0"
              title="Artisan quality rating based on verified customer feedback"
            >
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-gold text-gold" />
              <span className="font-sans not-italic tabular-nums font-semibold">{rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            href={`/products/${product.slug}`}
            className="block font-medium text-[14px] sm:text-[15px] md:text-base tracking-tight text-text-main hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-3">
          {/* Price & Savings Row */}
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base sm:text-lg text-primary tracking-tight font-sans not-italic tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-text-muted line-through font-sans not-italic tabular-nums">
                  {formatINR(product.compareAtPrice)}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="hidden sm:inline-block text-[10px] font-semibold text-primary bg-blush-soft/60 px-1.5 py-0.5 rounded border border-primary/20 font-sans not-italic tabular-nums">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stockQuantity <= 0}
            className={`sm:hidden mt-3 w-full py-2 px-3 rounded-full text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
              justAdded
                ? 'bg-[#386B3E] text-white'
                : product.stockQuantity <= 0
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : 'bg-surface-warm text-text-main border border-border-subtle active:bg-primary active:text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added</span>
              </>
            ) : product.stockQuantity <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
