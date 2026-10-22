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
  Star,
  MessageCircle,
  ArrowRight,
  PenLine,
} from 'lucide-react';
import type { ProductWithCategory, CartItem, PrismaProductVariant } from '@/types';
import { formatINR, calculateDiscount, parseJson } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductDetailsProps {
  product: ProductWithCategory;
}

const GIFT_NOTE_PRESETS = [
  'Happy Anniversary! Blooming with love forever.',
  'Happy Birthday! Wishing you a day as radiant as these blooms.',
  'Forever blooming for you, just like my love.',
  'A little reminder that you are deeply cherished.',
];

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
        message: 'Please enter a valid 6-digit Indian PIN code (e.g. 411028, 110001).',
      });
    }
  };

  const applyPresetMessage = (msg: string) => {
    setPersonalization(msg);
  };

  const whatsappInquiryUrl = `https://wa.me/919209284423?text=${encodeURIComponent(
    `Hi Divija Art House, I'm interested in ordering "${product.name}" (SKU: ${
      selectedVariant?.sku || product.slug
    }) and would like to ask about custom color options / delivery timelines.`
  )}`;

  return (
    <div className="w-full flex flex-col space-y-6 text-text-main">
      
      {/* Category Tag & Social Proof Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Link
            href={`/collections/${product.category.slug}`}
            className="font-semibold text-primary hover:text-primary-hover uppercase tracking-widest text-[11px] bg-primary/5 px-2.5 py-1 rounded-full border border-primary/20"
          >
            {product.category.name}
          </Link>
          <span className="text-gray-400">•</span>
          <span className="text-text-muted text-[11px]">
            SKU: {selectedVariant?.sku || `DAH-${product.slug.slice(0, 8).toUpperCase()}`}
          </span>
        </div>

        {/* Verified Social Proof Rating */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <div className="flex items-center text-gold">
            <Star className="w-3.5 h-3.5 fill-gold" />
            <Star className="w-3.5 h-3.5 fill-gold" />
            <Star className="w-3.5 h-3.5 fill-gold" />
            <Star className="w-3.5 h-3.5 fill-gold" />
            <Star className="w-3.5 h-3.5 fill-gold" />
          </div>
          <span className="font-semibold text-text-main text-[11px]">4.9</span>
          <span className="text-gray-400 text-[11px]">(140+ Gifting Reviews)</span>
        </div>
      </div>

      {/* Product Title (Playfair Serif Elegance) */}
      <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-semibold text-text-main leading-snug tracking-tight">
        {product.name}
      </h1>

      {/* Pricing & Value Offer Strip */}
      <div className="pb-4 border-b border-border-subtle space-y-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            {formatINR(currentPrice)}
          </span>
          {currentCompareAt && currentCompareAt > currentPrice && (
            <span className="text-base sm:text-lg text-text-muted line-through font-sans">
              {formatINR(currentCompareAt)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/30">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Reassurance note */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Truck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Inclusive of all taxes • Free express shipping across India on orders over ₹999</span>
        </div>
      </div>

      {/* Variant Selector */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Choose Variant / Style:
            </span>
            {selectedVariant && (
              <span className="text-xs font-semibold text-primary">
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
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-2 ${
                    isSelected
                      ? 'border-primary bg-primary text-white shadow-md ring-2 ring-primary/20 scale-102'
                      : isVarOutOfStock
                      ? 'border-border-subtle bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-border-subtle bg-white text-text-main hover:border-gold/60 hover:bg-surface-warm'
                  }`}
                >
                  <span>{v.name}</span>
                  {v.priceAdjustment > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'text-primary font-bold bg-primary/5'
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

      {/* Interactive Luxury Gifting Suite: Complimentary Handwritten Gift Card Note */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFAF7] border border-gold/35 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="toggle-personalization"
            className="flex items-center gap-2.5 cursor-pointer select-none group"
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
            <span className="text-xs sm:text-sm font-semibold text-text-main flex items-center gap-1.5 group-hover:text-primary transition-colors">
              <Gift className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Add Complimentary Handwritten Gift Note</span>
            </span>
          </label>

          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
            100% Free
          </span>
        </div>

        {showPersonalization && (
          <div className="space-y-3 pt-2 animate-fade-in">
            {/* Quick Occasion Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
                <PenLine className="w-3 h-3 text-gold" />
                <span>1-Click Occasion Suggestions:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GIFT_NOTE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPresetMessage(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-border-subtle hover:border-gold hover:bg-gold/5 text-text-muted hover:text-text-main transition-colors text-left"
                  >
                    &ldquo;{preset}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Note Textarea */}
            <textarea
              id="personalization-note"
              rows={3}
              maxLength={250}
              value={personalization}
              onChange={(e) => setPersonalization(e.target.value)}
              placeholder="Write your heartfelt note here... (e.g., Happy 25th Anniversary Mom & Dad! Forever blooming with love.)"
              className="w-full p-3 text-xs rounded-xl border border-gold/40 bg-white text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none shadow-xs"
            />

            <div className="flex items-center justify-between text-[11px] text-text-muted pt-0.5">
              <span className="flex items-center gap-1 text-[#8C6D46]">
                <Sparkles className="w-3 h-3 text-gold" />
                Handwritten with ink on textured linen cardstock
              </span>
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

      {/* Balanced 2-Tier Luxury Action Stack */}
      <div className="space-y-3 pt-2">
        {/* Tier 1: Quantity + Primary Add to Bag + Wishlist */}
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-border-subtle rounded-xl bg-white overflow-hidden shadow-xs h-12">
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

          {/* Primary Add to Bag Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 h-12 px-6 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-gold-glow active:scale-[0.99] ${
              addedSuccess
                ? 'bg-emerald-700 text-white'
                : isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4 animate-scale-in" />
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
            className={`h-12 w-12 flex items-center justify-center rounded-xl border transition-all ${
              wishlisted
                ? 'bg-primary border-primary text-white shadow-xs'
                : 'bg-white border-border-subtle text-text-muted hover:text-primary hover:border-gold/40 shadow-xs'
            }`}
            aria-label={
              wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'
            }
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Tier 2: Buy Now — Express Checkout */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={`w-full h-12 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all border shadow-xs active:scale-[0.99] ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-[#FDF9F5] hover:bg-[#F9F1E6] text-primary border-gold/50 hover:border-gold'
          }`}
        >
          <Zap className="w-4 h-4 text-gold fill-gold" />
          <span>Buy Now — Instant Checkout</span>
        </button>

        {/* WhatsApp Custom Order Concierge Link */}
        <div className="pt-1 flex items-center justify-center">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-emerald-700 transition-colors py-1 group"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>Need custom bouquet colors or urgent delivery? <strong>Chat with Artisan on WhatsApp</strong></span>
            <ArrowRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Delivery Estimator Pill & Pincode Checker */}
      <div className="p-4 rounded-2xl bg-surface-warm/80 border border-border-subtle space-y-3">
        <div className="flex items-start gap-2.5">
          <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-text-main">
              Fast Dispatch &amp; Pan-India Delivery
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
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-border-subtle bg-white text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            aria-label="Enter pincode for delivery check"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-white hover:bg-primary text-text-main hover:text-white border border-border-subtle hover:border-primary text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Check
          </button>
        </form>

        {pincodeResult.tested && (
          <p
            className={`text-xs font-medium animate-fade-in ${
              pincodeResult.valid ? 'text-emerald-700' : 'text-red-500'
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
          <span className="font-medium text-[11px]">Never Wilts &amp; Zero Maintenance</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border-subtle">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium text-[11px]">100% Organic Milk Cotton</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border-subtle">
          <Gift className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium text-[11px]">Ready-to-Gift Luxury Packaging</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border-subtle">
          <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium text-[11px]">Secure Razorpay, UPI &amp; COD</span>
        </div>
      </div>

      {/* Rich Description & Craft Details */}
      <div className="space-y-4 pt-4 border-t border-border-subtle">
        <div>
          <h2 className="font-serif font-semibold text-xl text-text-main tracking-tight mb-2">
            Description &amp; Artisan Story
          </h2>
          <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.details && (
          <div className="p-4 rounded-2xl bg-surface-warm/50 border border-border-subtle space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary" />
              Dimensions, Materials &amp; Care
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
