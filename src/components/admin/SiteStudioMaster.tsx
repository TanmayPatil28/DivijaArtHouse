'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  SlidersHorizontal,
  FolderTree,
  Building2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { SiteSettings } from '@/lib/site-settings';
import type { HomepageSectionConfig } from '@/lib/homepage-sections';
import { NavbarStudio } from './NavbarStudio';
import { HomepageSectionsManager } from './HomepageSectionsManager';
import { CategoriesManager } from './CategoriesManager';
import { StoreIdentityStudio } from './StoreIdentityStudio';
import { resetSiteSettingsAction } from '@/actions/site-settings';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: {
    products: number;
  };
}

interface SiteStudioMasterProps {
  initialSettings: SiteSettings;
  initialSections: HomepageSectionConfig[];
  initialCategories: CategoryItem[];
}

export function SiteStudioMaster({
  initialSettings,
  initialSections,
  initialCategories,
}: SiteStudioMasterProps) {
  const [activeTab, setActiveTab] = useState<'navigation' | 'sections' | 'categories' | 'identity'>('navigation');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetAll = async () => {
    if (!confirm('Are you sure you want to reset all site settings (Navbar, Announcement Bar, Identity) to original defaults?')) {
      return;
    }
    try {
      const res = await resetSiteSettingsAction();
      if (res.success) {
        showNotification('All storefront settings restored to default.');
        window.location.reload();
      }
    } catch (err) {
      alert('Failed to reset site settings');
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. MASTER ATELIER STUDIO HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-light text-gold-hover border border-gold/40">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Atelier CMS &amp; Storefront Studio</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            Store Customization Studio
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
            Complete executive control over your storefront: customize the top announcement bar, edit navbar links, toggle homepage sections, manage floral categories, and update contact channels.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <span>Preview Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold border border-stone-200 transition-colors"
            title="Reset site settings to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="p-4 rounded-2xl bg-stone-900 text-white text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-lg border border-stone-700 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <span className="text-[11px] text-stone-400 font-normal">Real-Time Sync Active</span>
        </div>
      )}

      {/* 2. SUB-STUDIO TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('navigation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'navigation'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Navbar &amp; Announcement Bar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'sections'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Homepage Sections (10)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'categories'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Floral Collections &amp; Categories</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'identity'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Store Identity &amp; Concierge</span>
        </button>
      </div>

      {/* 3. SUB-STUDIO ACTIVE PANEL */}
      <div className="pt-2">
        {activeTab === 'navigation' && (
          <NavbarStudio
            initialSettings={initialSettings}
            onNotification={showNotification}
          />
        )}

        {activeTab === 'sections' && (
          <HomepageSectionsManager initialSections={initialSections} />
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-1">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Floral Collections &amp; Categories
              </h3>
              <p className="text-xs text-stone-500">
                Add new categories, edit category descriptions, choose preset banner discs, and toggle active status.
              </p>
            </div>
            <CategoriesManager initialCategories={initialCategories} />
          </div>
        )}

        {activeTab === 'identity' && (
          <StoreIdentityStudio
            initialIdentity={initialSettings.identity}
            onNotification={showNotification}
          />
        )}
      </div>
    </div>
  );
}
