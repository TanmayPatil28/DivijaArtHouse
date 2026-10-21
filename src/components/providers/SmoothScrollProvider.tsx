'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis, useLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Handles route-change scroll resets, in-page anchor links, and header offset
 */
function ScrollHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  // Reset scroll to top on route navigation (unless URL contains in-page hash)
  useEffect(() => {
    if (!lenis) return;

    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
        return;
      }
    }

    // Immediate scroll reset on route changes prevents awkward jump
    lenis.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  // Smoothly intercept in-page anchor links (e.g. href="#bestsellers")
  useEffect(() => {
    if (!lenis) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, { offset: -80, duration: 1.0 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [lenis]);

  return null;
}

/**
 * Root SmoothScrollProvider using official Lenis React integration.
 * - Respects prefers-reduced-motion automatically.
 * - Keeps mobile touch scrolling 100% native (syncTouch: false).
 * - Calibrated with natural Apple-like easing (responsive, not floaty or heavy).
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // If user requests reduced motion in system preferences, render native scrolling without physics
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        duration: 1.0, // calibrated for snappy, natural response
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like exponential deceleration
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 1, // preserve 1:1 mobile response
        syncTouch: false,   // preserve native mobile touch momentum scrolling
        autoRaf: true,
      }}
    >
      <ScrollHandler />
      {children}
    </ReactLenis>
  );
}
