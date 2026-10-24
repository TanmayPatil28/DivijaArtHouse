'use client';

import React, { useState, useTransition } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook,
  Check,
  Save,
  Truck,
  Sparkles,
} from 'lucide-react';
import type { StoreIdentityConfig } from '@/lib/site-settings';
import { updateStoreIdentityAction } from '@/actions/site-settings';

interface StoreIdentityStudioProps {
  initialIdentity: StoreIdentityConfig;
  onNotification: (msg: string) => void;
}

export function StoreIdentityStudio({
  initialIdentity,
  onNotification,
}: StoreIdentityStudioProps) {
  const [identity, setIdentity] = useState<StoreIdentityConfig>(initialIdentity);
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: keyof StoreIdentityConfig, value: any) => {
    setIdentity((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = await updateStoreIdentityAction(identity);
        if (res.success) {
          setIdentity(res.settings.identity);
          onNotification('Store identity & contact channels updated successfully.');
        }
      } catch (err) {
        alert('Failed to update store identity');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-8">
      <div className="border-b border-stone-100 pb-5 space-y-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-light text-gold-hover border border-gold/40">
          <Building2 className="w-3.5 h-3.5 text-gold" />
          <span>Brand &amp; Support Identity</span>
        </span>
        <h3 className="font-serif font-bold text-lg text-stone-900">
          Store Information &amp; Concierge Channels
        </h3>
        <p className="text-xs text-stone-500 max-w-xl">
          Updating your WhatsApp Concierge number, support phone, or email here synchronizes across the entire storefront (Footer, Contact Page, WhatsApp Help buttons, and Order Receipts).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Store Brand Name
            </label>
            <input
              type="text"
              required
              value={identity.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Brand Tagline
            </label>
            <input
              type="text"
              required
              value={identity.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-serif italic"
            />
          </div>

          {/* WhatsApp Concierge */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Concierge Number</span>
            </label>
            <input
              type="text"
              required
              value={identity.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Used in all 1-click WhatsApp buttons for quick customer inquiries.
            </p>
          </div>

          {/* Support Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              <span>Customer Helpline Phone</span>
            </label>
            <input
              type="text"
              required
              value={identity.supportPhone}
              onChange={(e) => handleChange('supportPhone', e.target.value)}
              placeholder="+91 92092 84423"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Support Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-500" />
              <span>Support Email Address</span>
            </label>
            <input
              type="email"
              required
              value={identity.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              placeholder="care@divijaarthouse.com"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Free Shipping Threshold */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-stone-500" />
              <span>Free Shipping Minimum Order (₹)</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={identity.freeShippingThresholdINR}
              onChange={(e) => handleChange('freeShippingThresholdINR', parseInt(e.target.value, 10) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 font-sans font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Current: Orders of ₹{identity.freeShippingThresholdINR} and above receive complimentary shipping.
            </p>
          </div>
        </div>

        {/* Physical Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <span>Artisan Studio Address</span>
          </label>
          <input
            type="text"
            required
            value={identity.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Social Media Links */}
        <div className="pt-4 border-t border-stone-100 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Social Media Channels
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1 flex items-center gap-1">
                <Instagram className="w-3 h-3 text-pink-600" />
                <span>Instagram Profile</span>
              </label>
              <input
                type="text"
                value={identity.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1 flex items-center gap-1">
                <Facebook className="w-3 h-3 text-blue-600" />
                <span>Facebook Page</span>
              </label>
              <input
                type="text"
                value={identity.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-600" />
                <span>Pinterest Board</span>
              </label>
              <input
                type="text"
                value={identity.pinterestUrl}
                onChange={(e) => handleChange('pinterestUrl', e.target.value)}
                placeholder="https://pinterest.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-wine-glow transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
