'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Search, Check, X, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InquiryTopic {
  value: string;
  label: string;
  icon: string;
  hint: string;
}

export const INQUIRY_TOPICS: InquiryTopic[] = [
  {
    value: 'General Inquiry',
    label: 'General Question & Greetings',
    icon: '✨',
    hint: 'Questions about our artisan craft, atelier, or general gifting.',
  },
  {
    value: 'Custom Bouquet Request',
    label: 'Custom Bouquet & Color Palette',
    icon: '🌸',
    hint: 'Request specific floral species, color combinations, or stem counts.',
  },
  {
    value: 'Bulk & Corporate Gifting',
    label: 'Wedding Favors & Corporate Hampers',
    icon: '💼',
    hint: 'Volume pricing for milestone celebrations, baby showers, or bulk hampers.',
  },
  {
    value: 'Order Status & Delivery',
    label: 'Order Status & Express Courier Update',
    icon: '📦',
    hint: 'Transit inquiry, delivery schedule, or shipping address update.',
  },
  {
    value: 'Press & Collaboration',
    label: 'Collaboration, Press & Pop-Ups',
    icon: '🌿',
    hint: 'Artisan workshops, creator partnerships, or media inquiries.',
  },
];

interface InquiryTopicSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

export function InquiryTopicSelector({
  value,
  onChange,
  error,
  id = 'subject',
  name = 'subject',
  disabled = false,
}: InquiryTopicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const selectedTopic = INQUIRY_TOPICS.find((t) => t.value === value) || INQUIRY_TOPICS[0];

  const filteredTopics = INQUIRY_TOPICS.filter(
    (t) =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.hint.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (topicValue: string) => {
    onChange(topicValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input to preserve traditional form post */}
      <input type="hidden" id={id} name={name} value={value} />

      {/* Luxury Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-3 rounded-xl border text-sm text-left flex items-center justify-between transition-all duration-200 select-none outline-none bg-canvas hover:bg-white',
          error
            ? 'border-red-400 bg-red-50/20 text-text-main'
            : isOpen
            ? 'border-gold ring-2 ring-gold/30 bg-white shadow-sm'
            : 'border-border-subtle hover:border-gold/50 focus:border-gold focus:ring-2 focus:ring-gold/30',
          disabled && 'opacity-60 cursor-not-allowed bg-cream/40'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <HelpCircle
            className={cn(
              'w-4 h-4 shrink-0 transition-colors',
              isOpen ? 'text-primary' : 'text-gold'
            )}
          />
          <span className="shrink-0 text-base leading-none" aria-hidden="true">
            {selectedTopic.icon}
          </span>
          <span className="font-medium text-text-main truncate text-xs sm:text-sm">
            {selectedTopic.label}
          </span>
        </div>

        <ChevronDown
          className={cn(
            'w-4 h-4 text-text-muted shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-primary'
          )}
        />
      </button>

      {/* Floating Luxury Dropdown Menu */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Inquiry Topic Options"
          className="absolute left-0 right-0 top-full mt-2 z-50 w-full bg-white/98 backdrop-blur-md border border-gold/35 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* Top Search Input */}
          <div className="p-2.5 pb-2 border-b border-gold/15 bg-[#FAF6F0]/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter topic..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-border-subtle bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 placeholder:text-gray-400 text-text-main"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-main p-0.5 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Topics List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1 overscroll-contain">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => {
                const isSelected = value === topic.value;
                return (
                  <button
                    key={topic.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(topic.value)}
                    className={cn(
                      'w-full p-2.5 text-left rounded-xl transition-all flex items-start gap-3',
                      isSelected
                        ? 'bg-primary/10 border border-primary/25 shadow-xs'
                        : 'hover:bg-[#FAF6F1] active:bg-gold/10'
                    )}
                  >
                    <span className="text-lg leading-none mt-0.5" aria-hidden="true">
                      {topic.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            'text-xs sm:text-sm font-semibold truncate',
                            isSelected ? 'text-primary' : 'text-text-main'
                          )}
                        >
                          {topic.label}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-snug line-clamp-1">
                        {topic.hint}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-text-muted">
                No topic matching &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
