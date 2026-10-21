'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Zap,
  Check,
  Truck,
  ShieldCheck,
  Gift,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import type { ProductWithCategory, CartItem, PrismaProductVariant } from '@/types';
import { formatINR, calculateDiscount, parseJson } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductDetailsProps {
  product: ProductWithCategory;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const variants = product.variants || [];

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  // State
  const [selectedVariant, setSelectedVariant] = useState<PrismaProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [personalization, setPersonalization] = useState('');
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Delivery Pincode Estimator State
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{
    tested: boolean;
    valid: boolean;
    message?: string;
  }>({ tested: false, valid: false });

  // Images
  const images = parseJson<string[]>(product.images, []);
  const mainImage = images[0] || '/images/products/blushing-peony-rose-1.svg';

  // Computed Pricing & Stock
  const variantAdjustment = selectedVariant?.priceAdjustment || 0;
  const currentPrice = product.price + variantAdjustment;
  const currentCompareAt = product.compareAtPrice
    ? product.compareAtPrice + variantAdjustment
    : null;
  const discountPercent = calculateDiscount(currentPrice, currentCompareAt);

  const availableStock = selectedVariant
    ? selectedVariant.stockQuantity
    : product.stockQuantity;
  const isOutOfStock = availableStock <= 0;

  // Handlers
  const handleVariantSelect = (variant: PrismaProductVariant) => {
    setSelectedVariant(variant);
    // Reset quantity if it exceeds variant stock
    if (quantity > variant.stockQuantity) {
      setQuantity(Math.max(1, variant.stockQuantity));
    }
  };

  const handleIncrement = () => {
    if (quantity < availableStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const createCartItem = (): CartItem => {
    return {
      id: `${product.id}-${selectedVariant?.id || 'default'}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: mainImage,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      unitPrice: currentPrice,
      quantity,
      personalization: personalization.trim() || undefined,
      stock: availableStock,
    };
  };

  const handleAddToCart = () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);

    const item = createCartItem();
    addToCart(item);

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setIsAdding(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const item = createCartItem();
    addToCart(item);
    router.push('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincodeInput.trim();
    if (/^\d{6}$/.test(cleanPin)) {
      setPincodeResult({
        tested: true,
        valid: true,
        message: `Delivery available to ${cleanPin}. Estimated arrival in 3–4 business days with express tracking.`,
      });
    } else {
      setPincodeResult({
        tested: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code (e.g. 110001, 560001).',
      });
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 text-text-main">
      {/* Category Link & SKU */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href={`/collections/${product.category.slug}`}
          className="font-medium text-primary hover:underline uppercase tracking-wider"
        >
          {product.category.name}
        </Link>
        <span className="text-text-muted">
          SKU: {selectedVariant?.sku || `DAH-${product.slug.slice(0, 8).toUpperCase()}`}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-text-main leading-tight">
        {product.name}
      </h1>

      {/* Pricing Row */}
      <div className="flex flex-wrap items-baseline gap-3 pb-4 border-b border-border-subtle">
        <span className="font-display font-bold text-2xl sm:text-3xl text-primary">
          {formatINR(currentPrice)}
        </span>
        {currentCompareAt && currentCompareAt > currentPrice && (
          <span className="text-base sm:text-lg text-text-muted line-through font-sans">
            {formatINR(currentCompareAt)}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blush-soft text-primary border border-blush">
            Save {discountPercent}%
          </span>
        )}
        <p className="w-full text-xs text-text-muted mt-1">
          Inclusive of all taxes • Free shipping across India on orders over ₹999
        </p>
      </div>

      {/* Variant Selector (if variants exist) */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Choose Variant / Style:
            </span>
            {selectedVariant && (
              <span className="text-xs font-medium text-primary">
                Selected: {selectedVariant.name}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const isVarOutOfStock = v.stockQuantity <= 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleVariantSelect(v)}
                  disabled={isVarOutOfStock}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-primary bg-primary text-white shadow-sm ring-2 ring-primary/20'
                      : isVarOutOfStock
                      ? 'border-border-subtle bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-border-subtle bg-white text-text-main hover:border-blush hover:bg-surface-warm'
                  }`}
                >
                  <span>{v.name}</span>
                  {v.priceAdjustment > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'text-primary font-semibold'
                      }`}
                    >
                      +{formatINR(v.priceAdjustment)}
                    </span>
                  )}
                  {isVarOutOfStock && (
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      (Sold out)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Personalization Text Input (Complimentary Gift Card Note) */}
      <div className="p-4 rounded-2xl bg-surface-warm border border-border-subtle space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="toggle-personalization"
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <input
              id="toggle-personalization"
              type="checkbox"
              checked={showPersonalization}
              onChange={(e) => {
                setShowPersonalization(e.target.checked);
                if (!e.target.checked) setPersonalization('');
              }}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-border-subtle cursor-pointer accent-primary"
            />
            <span className="text-xs sm:text-sm font-semibold text-text-main flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-primary" />
              Add Free Handwritten Gift Card Message
            </span>
          </label>
          <span className="text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
            Free
          </span>
        </div>

        {showPersonalization && (
          <div className="space-y-2 pt-2 animate-fade-in">
            <textarea
              id="personalization-note"
              rows={3}
              maxLength={250}
              value={personalization}
              onChange={(e) => setPersonalization(e.target.value)}
              placeholder="Write your heartfelt note here... (e.g., Happy 25th Anniversary Mom & Dad! Forever blooming with love.)"
              className="w-full p-3 text-xs rounded-xl border border-border-subtle bg-white text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
            />
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span>Handwritten on luxury textured cardstock</span>
              <span
                className={
                  personalization.length >= 240
                    ? 'text-red-500 font-bold'
                    : 'text-text-muted'
                }
              >
                {personalization.length} / 250 characters
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quantity & CTAs Row */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-border-subtle rounded-xl bg-white overflow-hidden shadow-2xs h-11">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1 || isOutOfStock}
              className="px-3.5 py-2 text-text-main hover:bg-surface-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-base select-none"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-semibold select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= availableStock || isOutOfStock}
              className="px-3.5 py-2 text-text-main hover:bg-surface-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-base select-none"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 h-11 px-5 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] ${
              addedSuccess
                ? 'bg-green-600 text-white'
                : isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`h-11 w-11 flex items-center justify-center rounded-xl border transition-all ${
              wishlisted
                ? 'bg-primary border-primary text-white shadow-xs'
                : 'bg-white border-border-subtle text-text-muted hover:text-primary hover:border-blush'
            }`}
            aria-label={
              wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'
            }
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Buy Now CTA */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={`w-full h-11 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all border shadow-xs active:scale-[0.99] ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-surface-warm hover:bg-blush-soft text-primary border-blush hover:border-primary'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Buy Now — Instant Checkout</span>
        </button>
      </div>

      {/* Delivery Estimator Pill & Pincode Checker */}
      <div className="p-4 rounded-2xl bg-surface-warm/80 border border-border-subtle space-y-3">
        <div className="flex items-start gap-2.5">
          <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-text-main">
              Fast Dispatch & Pan-India Delivery
            </p>
            <p className="text-text-muted leading-relaxed">
              Dispatched within 24–48 hours in luxury protective packaging. Delivered in 3–5 business days across India.
            </p>
          </div>
        </div>

        {/* Pincode Input */}
        <form onSubmit={handleCheckPincode} className="flex gap-2 pt-1">
          <input
            type="text"
            maxLength={6}
            value={pincodeInput}
            onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit Pincode"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-border-subtle bg-white text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            aria-label="Enter pincode for delivery check"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-primary text-text-main hover:text-white border border-border-subtle hover:border-primary text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Check
          </button>
        </form>

        {pincodeResult.tested && (
          <p
            className={`text-xs font-medium animate-fade-in ${
              pincodeResult.valid ? 'text-green-700' : 'text-red-500'
            }`}
          >
            {pincodeResult.message}
          </p>
        )}
      </div>

      {/* Trust & Artisan Guarantee Strips */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-text-main">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border-subtle">
          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium text-[11px]">Never Wilts & Zero Maintenance</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border-subtle">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium text-[11px]">100% Milk Cotton Handcrafted</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border-subtle">
          <Gift className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium text-[11px]">Luxury Ready-to-Gift Packaging</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border-subtle">
          <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium text-[11px]">Secure COD & Online Payments</span>
        </div>
      </div>

      {/* Rich Description & Craft Details */}
      <div className="space-y-4 pt-4 border-t border-border-subtle">
        <div>
          <h2 className="font-display font-bold text-lg text-text-main mb-2">
            Description & Artisan Story
          </h2>
          <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.details && (
          <div className="p-4 rounded-2xl bg-surface-warm/50 border border-border-subtle space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary" />
              Dimensions, Materials & Care
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              {product.details}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
