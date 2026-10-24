'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Search,
  Check,
  AlertCircle,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import type { HomepageSectionConfig } from '@/lib/homepage-sections';
import {
  toggleHomepageSectionAction,
  reorderHomepageSectionsAction,
  resetHomepageSectionsAction,
} from '@/actions/homepage-sections';

interface HomepageSectionsManagerProps {
  initialSections: HomepageSectionConfig[];
}

const CATEGORY_STYLES: Record<string, string> = {
  Hero: 'bg-primary/10 text-primary border-primary/20',
  Discovery: 'bg-gold-light text-gold-hover border-gold/30',
  Story: 'bg-purple-50 text-purple-800 border-purple-200',
  Reassurance: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Conversion: 'bg-amber-50 text-amber-800 border-amber-200',
};

export function HomepageSectionsManager({ initialSections }: HomepageSectionsManagerProps) {
  const [sections, setSections] = useState<HomepageSectionConfig[]>(initialSections);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'HIDDEN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // 1-Click Toggle Visibility
  const handleToggle = (key: string, currentEnabled: boolean) => {
    const nextEnabled = !currentEnabled;

    // Optimistic update
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, isEnabled: nextEnabled } : s))
    );

    startTransition(async () => {
      try {
        const res = await toggleHomepageSectionAction(key, nextEnabled);
        if (res.success && res.sections) {
          setSections(res.sections);
          showNotification(
            nextEnabled
              ? `Section "${key}" is now LIVE on the homepage.`
              : `Section "${key}" is now HIDDEN from the homepage.`
          );
        }
      } catch (err) {
        // Revert on error
        setSections((prev) =>
          prev.map((s) => (s.key === key ? { ...s, isEnabled: currentEnabled } : s))
        );
        alert(err instanceof Error ? err.message : 'Failed to update section visibility');
      }
    });
  };

  // Move Section Up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;

    const updated = newSections.map((s, idx) => ({ ...s, sortOrder: idx + 1 }));
    setSections(updated);

    startTransition(async () => {
      try {
        const keysInOrder = updated.map((s) => s.key);
        const res = await reorderHomepageSectionsAction(keysInOrder);
        if (res.success && res.sections) {
          setSections(res.sections);
          showNotification('Homepage section order updated.');
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to reorder sections');
      }
    });
  };

  // Move Section Down
  const handleMoveDown = (index: number) => {
    if (index >= sections.length - 1) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;

    const updated = newSections.map((s, idx) => ({ ...s, sortOrder: idx + 1 }));
    setSections(updated);

    startTransition(async () => {
      try {
        const keysInOrder = updated.map((s) => s.key);
        const res = await reorderHomepageSectionsAction(keysInOrder);
        if (res.success && res.sections) {
          setSections(res.sections);
          showNotification('Homepage section order updated.');
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to reorder sections');
      }
    });
  };

  // Reset to Default Layout
  const handleReset = () => {
    if (!confirm('Are you sure you want to restore the default atelier homepage layout?')) {
      return;
    }

    startTransition(async () => {
      try {
        const res = await resetHomepageSectionsAction();
        if (res.success && res.sections) {
          setSections(res.sections);
          showNotification('Restored default atelier homepage layout.');
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to reset sections');
      }
    });
  };

  // Filter & Search Logic
  const filteredSections = sections.filter((s) => {
    if (filter === 'ACTIVE' && !s.isEnabled) return false;
    if (filter === 'HIDDEN' && s.isEnabled) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = sections.filter((s) => s.isEnabled).length;
  const totalCount = sections.length;

  return (
    <div className="space-y-6">
      {/* 1. TOP CONTROL BAR & STATS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-light text-gold-hover border border-gold/40">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold" />
              <span>Live Storefront Customizer</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {activeCount} of {totalCount} Active
              </span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
            Homepage Section Switchboard
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
            Toggle any section on or off in a single click. Adjust layout order using Move Up/Down controls. Changes reflect instantly on the live website.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <span>View Live Home</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold border border-stone-200 transition-colors disabled:opacity-50"
            title="Reset to original 10-section atelier layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Layout</span>
          </button>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-stone-900 text-white text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-lg border border-stone-700 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <span className="text-[11px] text-stone-400 font-normal">Live ISR Updated</span>
        </div>
      )}

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'ALL'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
            }`}
          >
            All Sections ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'ACTIVE'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
            }`}
          >
            Active &bull; Visible ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('HIDDEN')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'HIDDEN'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
            }`}
          >
            Hidden ({totalCount - activeCount})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sections..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* 3. SECTION CARDS LIST */}
      <div className="space-y-3.5">
        {filteredSections.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs">
            <Layers className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-800">No Sections Found</h3>
            <p className="text-xs text-stone-500 mt-1">No homepage sections match the active filter or query.</p>
          </div>
        ) : (
          filteredSections.map((sec) => {
            const index = sections.findIndex((s) => s.key === sec.key);
            const isFirst = index === 0;
            const isLast = index === sections.length - 1;

            return (
              <div
                key={sec.key}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all ${
                  sec.isEnabled
                    ? 'border-stone-200 hover:border-gold/50 shadow-xs hover:shadow-gold-soft'
                    : 'border-dashed border-stone-300 bg-stone-50/60 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Reorder Arrows & Info */}
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Reorder Controls */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={isFirst || isPending}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Section Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-xs font-bold text-stone-500">
                        #{sec.sortOrder}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={isLast || isPending}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Section Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Section Details */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
                          {sec.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            CATEGORY_STYLES[sec.category] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {sec.category}
                        </span>
                        {sec.badge && (
                          <span className="text-[10px] text-stone-400 font-mono hidden md:inline">
                            &bull; {sec.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
                        {sec.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: 1-Click iOS-Style Switch */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <span
                      className={`text-xs font-semibold ${
                        sec.isEnabled ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    >
                      {sec.isEnabled ? 'Visible on Home' : 'Hidden from Home'}
                    </span>

                    {/* 1-Click Switch Button */}
                    <button
                      type="button"
                      onClick={() => handleToggle(sec.key, sec.isEnabled)}
                      disabled={isPending}
                      className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${
                        sec.isEnabled ? 'bg-primary' : 'bg-stone-300'
                      }`}
                      role="switch"
                      aria-checked={sec.isEnabled}
                      title={sec.isEnabled ? 'Click to Hide Section' : 'Click to Show Section'}
                    >
                      <span className="sr-only">Toggle {sec.name}</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                          sec.isEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      >
                        {sec.isEnabled ? (
                          <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-stone-300" />
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
