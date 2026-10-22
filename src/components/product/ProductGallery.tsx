'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { parseJson, calculateDiscount } from '@/lib/utils';
import type { ProductWithCategory } from '@/types';

interface ProductGalleryProps {
  product: ProductWithCategory;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = parseJson<string[]>(product.images, [
    '/images/products/blushing-peony-rose-1.svg',
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeImage = images[activeIndex] || images[0] || '/images/products/blushing-peony-rose-1.svg';
  const discountPercent = calculateDiscount(product.price, product.compareAtPrice);
  const isSvg = (src: string) => src.endsWith('.svg');

  // Mouse Move for Smooth Pan-Zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  // Keyboard Navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setLightboxZoom(1);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      
      {/* Primary Image Display Viewport */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 50, y: 50 });
        }}
        onMouseMove={handleMouseMove}
        onClick={() => {
          setIsLightboxOpen(true);
          setLightboxZoom(1);
        }}
        className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#F6F0E8] to-[#EEE5D8] border border-gold/30 ring-1 ring-gold/20 shadow-md group cursor-zoom-in isolate"
        role="button"
        tabIndex={0}
        aria-label="Inspect handcrafted crochet stitches in fullscreen"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsLightboxOpen(true);
          }
        }}
      >
        {/* Subtle Ambient Radial Backlight */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(197,154,90,0.08)_100%)] pointer-events-none z-10" 
          aria-hidden="true" 
        />

        {/* Dynamic Zooming Image Canvas */}
        <div
          className="relative w-full h-full flex items-center justify-center p-3 sm:p-5"
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: isHovered ? 'scale(1.42)' : 'scale(1)',
            transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s ease-out',
          }}
        >
          {isSvg(activeImage) ? (
            <img
              src={activeImage}
              alt={`${product.name} - View ${activeIndex + 1}`}
              className="w-full h-full object-contain p-1 drop-shadow-sm select-none"
            />
          ) : (
            <Image
              src={activeImage}
              alt={`${product.name} - View ${activeIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-2 drop-shadow-md select-none"
            />
          )}
        </div>

        {/* Top Floating Controls: Discount Pill (Left) & Inspect Button (Right) */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
          {/* Discount Pill */}
          {discountPercent > 0 ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white border border-gold/40 shadow-md pointer-events-auto">
              {discountPercent}% OFF
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-primary border border-gold/30 shadow-xs backdrop-blur-md pointer-events-auto">
              Artisan Keepsake
            </span>
          )}

          {/* Inspect Stitches / Expand Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
              setLightboxZoom(1);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-text-main hover:text-primary border border-gold/35 text-[11px] font-semibold shadow-xs backdrop-blur-md transition-all pointer-events-auto active:scale-95 group/btn"
            title="Inspect handcrafted stitches in fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5 text-gold group-hover/btn:scale-110 transition-transform" />
            <span className="hidden sm:inline">Inspect Stitches</span>
          </button>
        </div>

        {/* Bottom Floating Pill: Slide Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3.5 right-3.5 z-20 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-wider shadow-xs pointer-events-auto">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* Interactive Thumbnail Selector Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-thin">
          {images.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden flex-shrink-0 bg-[#FAF6F0] border-2 transition-all p-1.5 ${
                  isSelected
                    ? 'border-primary ring-2 ring-gold/50 shadow-md scale-102'
                    : 'border-border-subtle hover:border-gold/50 opacity-70 hover:opacity-100'
                }`}
                aria-label={`View creation view ${idx + 1}`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                {isSvg(img) ? (
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="88px"
                    className="object-contain"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Fullscreen Artisan Lightbox Modal ── */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Artisan stitch inspection view"
        >
          {/* Lightbox Top Bar */}
          <div className="w-full flex items-center justify-between z-10 max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-white font-medium">
                {product.name}
              </span>
              <span className="text-xs text-gold/80 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30">
                View {activeIndex + 1} of {images.length}
              </span>
            </div>

            {/* Actions: Zoom & Close */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => (z === 1 ? 1.8 : 1))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
                title={lightboxZoom === 1 ? 'Zoom In' : 'Zoom Out'}
                aria-label={lightboxZoom === 1 ? 'Zoom In' : 'Zoom Out'}
              >
                {lightboxZoom === 1 ? (
                  <ZoomIn className="w-5 h-5 text-gold" />
                ) : (
                  <ZoomOut className="w-5 h-5 text-gold" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxZoom(1);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
                title="Close Lightbox (Esc)"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image View */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev Slide Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/75 text-white/80 hover:text-white border border-white/15 transition-all focus:outline-none active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Active Magnified Canvas */}
            <div 
              className="relative w-full max-w-2xl aspect-square flex items-center justify-center transition-transform duration-300"
              style={{ transform: `scale(${lightboxZoom})` }}
            >
              {isSvg(activeImage) ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain drop-shadow-2xl select-none"
                />
              ) : (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  sizes="800px"
                  className="object-contain drop-shadow-2xl select-none"
                />
              )}
            </div>

            {/* Next Slide Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/75 text-white/80 hover:text-white border border-white/15 transition-all focus:outline-none active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Strip */}
          {images.length > 1 && (
            <div className="w-full max-w-md mx-auto flex items-center justify-center gap-2.5 z-10 pb-2">
              {images.map((img, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={`modal-${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white/5 ${
                      isSelected
                        ? 'border-gold ring-2 ring-gold/50 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`Switch to image ${idx + 1}`}
                  >
                    {isSvg(img) ? (
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Image src={img} alt="" fill sizes="56px" className="object-contain" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
