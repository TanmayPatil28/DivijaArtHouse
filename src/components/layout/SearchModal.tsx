'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = origOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const popularSearches = [
    'OHP Rangoli',
    'Woolen Rangoli',
    'Kundan Pooja Art',
    'Pipe Cleaner Tulip',
    'Festive Toran',
    'Haldi Decor',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search storefront products" data-lenis-prevent
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border-subtle overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center px-4 py-3.5 border-b border-border-subtle"
        >
          <Search className="w-5 h-5 text-primary flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search OHP rangoli, woolen floor art, pipe cleaner florals, torans..."
            className="w-full px-3 py-1 text-base text-text-main placeholder-text-muted focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-text-muted hover:text-text-main rounded-full mr-2"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Suggestions */}
        <div className="p-4 bg-surface-warm">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  router.push(`/shop?q=${encodeURIComponent(term)}`);
                  onClose();
                }}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-blush-soft border border-border-subtle text-text-main hover:text-primary transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
