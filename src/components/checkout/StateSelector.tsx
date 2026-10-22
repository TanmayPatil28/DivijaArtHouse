'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Search, Check, X, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

// Curated high-frequency art gifting destinations
const POPULAR_STATES = [
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Gujarat',
  'Telangana',
  'West Bengal',
];

/**
 * Detect Indian State / Union Territory based on 6-digit postal PIN code prefix.
 */
export function getStateFromPincode(pincode: string): string | null {
  const cleanPin = pincode.replace(/\D/g, '');
  if (cleanPin.length < 2) return null;

  const prefix3 = cleanPin.substring(0, 3);
  const prefix2 = cleanPin.substring(0, 2);
  const p3 = parseInt(prefix3, 10);
  const p2 = parseInt(prefix2, 10);

  // 3-digit specific territory overrides
  if (prefix3 === '403') return 'Goa';
  if (prefix3 === '605') return 'Puducherry';
  if (prefix3 === '682') return 'Lakshadweep';
  if (prefix3 === '744') return 'Andaman and Nicobar Islands';
  if (prefix3 === '737') return 'Sikkim';
  if (prefix3 === '396') return 'Dadra and Nagar Haveli and Daman and Diu';
  if (p3 >= 790 && p3 <= 792) return 'Arunachal Pradesh';
  if (p3 >= 793 && p3 <= 794) return 'Meghalaya';
  if (p3 === 795) return 'Manipur';
  if (p3 === 796) return 'Mizoram';
  if (p3 === 797) return 'Nagaland';
  if (p3 === 799) return 'Tripura';
  if (p3 >= 248 && p3 <= 249) return 'Uttarakhand';
  if (p3 >= 262 && p3 <= 263) return 'Uttarakhand';

  // 2-digit postal circle mappings
  if (p2 === 11) return 'Delhi';
  if (p2 === 12 || p2 === 13) return 'Haryana';
  if (p2 === 14 || p2 === 15) return 'Punjab';
  if (p2 === 16) return 'Chandigarh';
  if (p2 === 17) return 'Himachal Pradesh';
  if (p2 === 18 || p2 === 19) return 'Jammu and Kashmir';
  if (p2 >= 20 && p2 <= 28) return 'Uttar Pradesh';
  if (p2 >= 30 && p2 <= 34) return 'Rajasthan';
  if (p2 >= 36 && p2 <= 39) return 'Gujarat';
  if (p2 >= 40 && p2 <= 44) return 'Maharashtra';
  if (p2 >= 45 && p2 <= 48) return 'Madhya Pradesh';
  if (p2 === 49) return 'Chhattisgarh';
  if (p2 === 50) return 'Telangana';
  if (p2 >= 51 && p2 <= 53) return 'Andhra Pradesh';
  if (p2 >= 56 && p2 <= 59) return 'Karnataka';
  if (p2 >= 60 && p2 <= 64) return 'Tamil Nadu';
  if (p2 >= 67 && p2 <= 69) return 'Kerala';
  if (p2 >= 70 && p2 <= 74) return 'West Bengal';
  if (p2 >= 75 && p2 <= 77) return 'Odisha';
  if (p2 === 78) return 'Assam';
  if (p2 >= 80 && p2 <= 85) {
    if (p3 >= 825 && p3 <= 835) return 'Jharkhand';
    if (p3 >= 814 && p3 <= 816) return 'Jharkhand';
    return 'Bihar';
  }

  return null;
}

interface StateSelectorProps {
  value: string;
  onChange: (stateName: string) => void;
  error?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

export function StateSelector({
  value,
  onChange,
  error,
  id = 'state',
  name = 'state',
  disabled = false,
}: StateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Filter states based on user search query
  const filteredStates = INDIAN_STATES.filter((st) =>
    st.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Position calculation: auto-detect if menu should open upward or downward
  const handleToggle = () => {
    if (disabled) return;

    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 280px below and more space above, open upwards
      if (spaceBelow < 280 && rect.top > 280) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }

    setIsOpen((prev) => !prev);
  };

  // Focus search input when menu opens
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

  // Close on outside click
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

  // Close on Escape key
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

  const handleSelect = (stateName: string) => {
    onChange(stateName);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input to preserve traditional form integration */}
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
        aria-invalid={!!error}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border text-sm text-left flex items-center justify-between transition-all duration-200 select-none outline-none',
          error
            ? 'border-red-400 bg-red-50/20 text-text-main'
            : isOpen
            ? 'border-gold ring-2 ring-gold/30 bg-white shadow-sm'
            : 'border-border-subtle bg-white hover:border-gold/50 focus:border-gold focus:ring-2 focus:ring-gold/30',
          disabled && 'opacity-60 cursor-not-allowed bg-cream/40'
        )}
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <MapPin
            className={cn(
              'w-3.5 h-3.5 shrink-0 transition-colors',
              isOpen ? 'text-primary' : 'text-gold'
            )}
          />
          {value ? (
            <span className="font-medium text-text-main truncate">{value}</span>
          ) : (
            <span className="text-gray-400">Select State / UT</span>
          )}
        </div>

        <ChevronDown
          className={cn(
            'w-4 h-4 text-text-muted shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-primary'
          )}
        />
      </button>

      {/* Floating Luxury Dropdown Popover */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Indian States and Union Territories"
          className={cn(
            'absolute left-0 right-0 z-50 w-full bg-white/98 backdrop-blur-md border border-gold/35 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden transition-all duration-150',
            openUpward
              ? 'bottom-full mb-2 origin-bottom'
              : 'top-full mt-2 origin-top'
          )}
        >
          {/* Top Search Filter Header */}
          <div className="p-2.5 pb-2 border-b border-gold/15 bg-[#FAF6F0]/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gold absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search state or union territory..."
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

          {/* Quick-Pick Popular Destinations (Visible when search is empty) */}
          {!search.trim() && (
            <div className="px-3 pt-2 pb-2.5 border-b border-gold/10 bg-white">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Popular Destinations
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_STATES.map((popState) => {
                  const isSelected = value === popState;
                  return (
                    <button
                      key={popState}
                      type="button"
                      onClick={() => handleSelect(popState)}
                      className={cn(
                        'px-2.5 py-1 text-[11px] rounded-full border transition-all text-left font-medium',
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-[#FAF6F1]/80 text-text-secondary border-gold/25 hover:border-gold hover:bg-gold/15 hover:text-primary'
                      )}
                    >
                      {popState}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section Indicator */}
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted bg-[#FAF6F0]/30 border-b border-gold/10 flex items-center justify-between">
            <span>
              {search.trim()
                ? `Results (${filteredStates.length})`
                : 'All States & Union Territories (A–Z)'}
            </span>
            <span className="text-[9px] lowercase font-normal text-text-muted">
              {filteredStates.length} items
            </span>
          </div>

          {/* Scrollable State List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 overscroll-contain">
            {filteredStates.length > 0 ? (
              filteredStates.map((st) => {
                const isSelected = value === st;
                return (
                  <button
                    key={st}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(st)}
                    className={cn(
                      'w-full px-3 py-2 text-xs rounded-xl flex items-center justify-between text-left transition-all',
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-xs'
                        : 'text-text-main hover:bg-[#FAF6F1] hover:text-primary active:bg-gold/15'
                    )}
                  >
                    <span className="truncate">{st}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-6 px-3 text-center space-y-2">
                <p className="text-xs text-text-muted">
                  No states found matching &quot;{search}&quot;
                </p>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-xs text-primary font-medium underline underline-offset-2 hover:text-primary-dark"
                >
                  Show all 36 states
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
