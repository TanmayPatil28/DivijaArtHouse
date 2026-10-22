"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import { FluidGradient } from "./fluid-gradient";

export interface CarouselSlide {
  id: string | number;
  content?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  colors?: string[];
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  textPosition?: "top-left" | "bottom-left";
}

export interface AppleCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  leftControls?: React.ReactNode;
  rightControls?: React.ReactNode;
  activeFeatureId?: string | null;
  features?: { id: string; content: React.ReactNode }[];
  hideCenterControls?: boolean;
  centerControls?: React.ReactNode;
}

export function AppleCarousel({ 
  className, 
  slides = [], 
  autoPlay = true, 
  autoPlayInterval = 7000, 
  leftControls,
  rightControls,
  activeFeatureId = null,
  features = [],
  hideCenterControls = false,
  centerControls,
  ...props 
}: AppleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  const SLIDE_DURATION = autoPlayInterval;

  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % slides.length;
        setPlayKey((prev) => prev + 1);
        return next;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [slides.length, isPaused, autoPlay, SLIDE_DURATION]);

  const scrollToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    setPlayKey((prev) => prev + 1);
    setIsPaused(true);
  }, []);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);

    // Swiped left (next slide)
    if (swipe < -swipeConfidenceThreshold && activeIndex < slides.length - 1) {
      scrollToSlide(activeIndex + 1);
    } 
    // Swiped right (previous slide)
    else if (swipe > swipeConfidenceThreshold && activeIndex > 0) {
      scrollToSlide(activeIndex - 1);
    }
  };

  const springTransition: Transition = {
    ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
    duration: 0.8,
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full" aria-roledescription="carousel">
      <div className="relative w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Master Cinema Frame Container */}
        <div 
          className="relative w-full rounded-2xl md:rounded-[28px] overflow-hidden isolate shadow-2xl ring-1 ring-gold/25 bg-[#201213] min-h-[460px] md:min-h-[440px] lg:aspect-[24/9]"
        >
          {/* Static Ambient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-0 pointer-events-none" />

          <AnimatePresence mode="wait">
            {activeFeatureId ? (
              <motion.div
                key="feature-view"
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
              >
                {features.find(f => f.id === activeFeatureId)?.content}
              </motion.div>
            ) : (
              <motion.div
                key="slides-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 z-10 overflow-hidden"
              >
                {/* Hardware-accelerated sliding track with drag physics */}
                <motion.div 
                  className="flex gap-0 cursor-grab active:cursor-grabbing relative h-full w-full"
                  animate={{ x: `-${activeIndex * 100}%` }}
                  transition={springTransition}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                >
                  {slides.map((slide, idx) => (
                    <div 
                      key={slide.id} 
                      className="carousel-item relative shrink-0 w-full h-full rounded-2xl md:rounded-[28px] overflow-hidden group isolate bg-transparent min-h-[460px] md:min-h-[440px] lg:aspect-[24/9]"
                    >
                      {/* Fluid gradient canvas if colors provided */}
                      {slide.colors && slide.colors.length > 0 ? (
                        <div className="absolute inset-0 z-0">
                          <FluidGradient colors={slide.colors} />
                        </div>
                      ) : null}

                      {/* Image Layer */}
                      {slide.imageUrl && (
                        <div className="absolute inset-0 z-[1] overflow-hidden">
                          <Image
                            src={slide.imageUrl}
                            alt={slide.imageAlt || "Slide image"}
                            fill
                            unoptimized={slide.imageUrl.endsWith('.svg')}
                            sizes="(max-width: 1240px) 100vw, 1240px"
                            className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                            priority={idx === 0}
                          />
                        </div>
                      )}

                      {/* Custom Content Slot */}
                      {slide.content && (
                        <div className="absolute inset-0 z-[2]">
                          {slide.content}
                        </div>
                      )}
                      
                      {/* Fallback Overlay Text */}
                      {!slide.content && slide.headline && (
                        <div 
                          className={cn(
                            "absolute z-20 max-w-[85%] md:max-w-[55%] pointer-events-none",
                            slide.textPosition === "bottom-left" ? "bottom-[48px] left-[48px]" : "top-[48px] left-[48px]"
                          )}
                        >
                          <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
                            {slide.headline}
                          </h3>
                          {slide.subheadline && (
                            <p className="mt-3 md:mt-4 text-base md:text-xl font-medium text-white/85">
                              {slide.subheadline}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Bottom Floating Controls: Optional Left / Right + Sleek Glass Dock ── */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 md:bottom-8 md:left-8 md:right-8 z-30 pointer-events-none flex items-end justify-between gap-4">
            {/* Optional Left Controls */}
            {leftControls && (
              <div className="pointer-events-auto">
                {leftControls}
              </div>
            )}

            {/* Optional Right Controls if explicitly passed */}
            {rightControls && (
              <div className="pointer-events-auto ml-auto">
                {rightControls}
              </div>
            )}

            {/* Sleek Bottom-Right Glass Dock (Progress Pills + Play/Pause) */}
            {!hideCenterControls && !activeFeatureId && slides.length > 1 && !centerControls && (
              <div className={cn(
                "pointer-events-auto flex items-center gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-white/20 bg-black/50 backdrop-blur-md",
                !leftControls && !rightControls ? "ml-auto" : ""
              )}>
                {/* Slide Indicators */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {slides.map((_, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => scrollToSlide(idx)}
                        className="relative flex items-center justify-center focus:outline-none group/dot py-1"
                        aria-label={`Go to slide ${idx + 1}`}
                        aria-current={isActive ? "true" : "false"}
                      >
                        <div 
                          className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] relative h-1.5 sm:h-2 rounded-full"
                          style={{
                            width: isActive ? '32px' : '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.35)',
                          }}
                        >
                          {isActive && (
                            <div
                              key={`progress-${idx}-${playKey}`}
                              className="absolute top-0 left-0 h-full bg-gold rounded-full"
                              style={{ 
                                width: '100%',
                                animation: `progress-fill ${SLIDE_DURATION}ms linear forwards`,
                                animationPlayState: isPaused ? 'paused' : 'running'
                              }}
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Subtle Divider */}
                <div className="w-px h-3.5 bg-white/20" />

                {/* Play / Pause Button */}
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all focus:outline-none active:scale-95"
                  aria-label={isPaused ? "Play slide rotation" : "Pause slide rotation"}
                  title={isPaused ? "Play" : "Pause"}
                >
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="text-white">
                    <motion.path
                      fill="currentColor"
                      initial={false}
                      animate={{
                        d: isPaused 
                          ? "M 1 2 L 9 6 L 9 6 L 1 6 Z"
                          : "M 1 1 L 3.5 1 L 3.5 11 L 1 11 Z",
                      }}
                      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    />
                    <motion.path
                      fill="currentColor"
                      initial={false}
                      animate={{
                        d: isPaused 
                          ? "M 1 10 L 9 6 L 9 6 L 1 6 Z"
                          : "M 6.5 1 L 9 1 L 9 11 L 6.5 11 Z",
                      }}
                      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Butter-smooth Progress Fill Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
    </section>
  );
}
