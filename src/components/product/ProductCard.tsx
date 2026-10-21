'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Check } from 'lucide-react';
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
  const hoverImage = images[1] || mainImage;

  const discountPercent = calculateDiscount(product.price, product.compareAtPrice);

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

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-border-subtle overflow-hidden hover:shadow-lg hover:border-blush transition-all duration-300">
      {/* Product Image Area */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full aspect-square bg-gradient-to-br from-surface-warm to-blush-soft/40 p-4 overflow-hidden block"
      >
        {/* Main Image */}
        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-contain p-2 transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            wishlisted
              ? 'bg-primary text-white'
              : 'bg-white/90 text-text-muted hover:text-primary hover:bg-white'
          }`}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Heart
            className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`}
          />
        </button>
      </Link>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Tag */}
          {product.category?.name && (
            <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1 line-clamp-1">
              {product.category.name}
            </p>
          )}

          {/* Product Title */}
          <Link
            href={`/products/${product.slug}`}
            className="block font-display font-bold text-sm sm:text-base text-text-main hover:text-primary transition-colors line-clamp-2 leading-snug mb-2"
          >
            {product.name}
          </Link>
        </div>

        <div>
          {/* Price & MRP Row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-bold text-base sm:text-lg text-primary">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-text-muted line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Quick Add CTA */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stockQuantity <= 0}
            className={`w-full py-2 px-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              justAdded
                ? 'bg-green-600 text-white'
                : product.stockQuantity <= 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-surface-warm hover:bg-primary text-text-main hover:text-white border border-border-subtle hover:border-primary active:scale-[0.98]'
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
      </div>
    </div>
  );
}
