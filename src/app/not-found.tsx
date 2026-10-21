import Link from 'next/link';
import { Flower2, Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-blush-soft border border-blush flex items-center justify-center text-primary mb-6">
        <Flower2 className="w-8 h-8 stroke-[1.5]" />
      </div>

      <span className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">
        404 — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-main mb-4">
        This Bloom Seems to Have Wandered Off
      </h1>

      <p className="text-sm sm:text-base text-text-muted mb-8 leading-relaxed">
        The page or handcrafted creation you are looking for does not exist or may have been relocated. Let&apos;s guide you back to our floral collections.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-surface-warm border border-border-subtle text-text-main text-sm font-medium transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-primary" />
          <span>Browse All Blooms</span>
        </Link>
      </div>
    </div>
  );
}
