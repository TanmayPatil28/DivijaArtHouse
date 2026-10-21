'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for diagnostics
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-primary mb-6">
        <AlertCircle className="w-8 h-8 stroke-[1.5]" />
      </div>

      <span className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">
        Something Went Wrong
      </span>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-main mb-3">
        We Hit an Unexpected Snag
      </h1>

      <p className="text-sm text-text-muted mb-8 leading-relaxed">
        Our artisan workshop encountered a temporary hiccup loading this page. Please try refreshing or return to the storefront.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-surface-warm border border-border-subtle text-text-main text-sm font-medium transition-colors"
        >
          <Home className="w-4 h-4 text-primary" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
