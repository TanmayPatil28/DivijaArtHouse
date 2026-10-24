'use client';

import React, { useState, useTransition } from 'react';
import {
  Sparkles,
  Gift,
  Truck,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  CheckCircle2,
  RotateCcw,
  Link2,
  X,
  Compass,
  MessageSquare,
} from 'lucide-react';
import type {
  AnnouncementMessage,
  NavItemConfig,
  SiteSettings,
} from '@/lib/site-settings';
import {
  updateAnnouncementBarAction,
  updateNavItemsAction,
  addCustomNavItemAction,
  deleteNavItemAction,
} from '@/actions/site-settings';

interface NavbarStudioProps {
  initialSettings: SiteSettings;
  onNotification: (msg: string) => void;
}

export function NavbarStudio({ initialSettings, onNotification }: NavbarStudioProps) {
  const [announcement, setAnnouncement] = useState(initialSettings.announcementBar);
  const [navItems, setNavItems] = useState(initialSettings.navigation.items);
  const [isPending, startTransition] = useTransition();

  // New Custom Link Form State
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkHref, setNewLinkHref] = useState('');
  const [newLinkBadge, setNewLinkBadge] = useState('');

  // New Ticker Message Form State
  const [isAddingMessage, setIsAddingMessage] = useState(false);
  const [newMsgText, setNewMsgText] = useState('');
  const [newMsgLink, setNewMsgLink] = useState('');
  const [newMsgIcon, setNewMsgIcon] = useState<'sparkles' | 'gift' | 'truck'>('sparkles');

  // Toggle Announcement Bar
  const handleToggleAnnouncement = () => {
    const nextState = !announcement.isEnabled;
    setAnnouncement((prev) => ({ ...prev, isEnabled: nextState }));

    startTransition(async () => {
      try {
        const res = await updateAnnouncementBarAction({ isEnabled: nextState });
        if (res.success) {
          onNotification(
            nextState
              ? 'Announcement Bar is now LIVE on top of the storefront.'
              : 'Announcement Bar is now HIDDEN.'
          );
        }
      } catch (err) {
        setAnnouncement((prev) => ({ ...prev, isEnabled: !nextState }));
        alert('Failed to update announcement bar');
      }
    });
  };

  // Delete Announcement Message
  const handleDeleteMessage = (id: string) => {
    const updated = announcement.messages.filter((m) => m.id !== id);
    setAnnouncement((prev) => ({ ...prev, messages: updated }));

    startTransition(async () => {
      try {
        const res = await updateAnnouncementBarAction({ messages: updated });
        if (res.success) {
          onNotification('Announcement ticker message removed.');
        }
      } catch (err) {
        alert('Failed to delete message');
      }
    });
  };

  // Add Announcement Message
  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const newMessage: AnnouncementMessage = {
      id: `msg-${Date.now()}`,
      text: newMsgText.trim(),
      link: newMsgLink.trim() || undefined,
      icon: newMsgIcon,
    };

    const updated = [...announcement.messages, newMessage];
    setAnnouncement((prev) => ({ ...prev, messages: updated }));
    setIsAddingMessage(false);
    setNewMsgText('');
    setNewMsgLink('');

    startTransition(async () => {
      try {
        const res = await updateAnnouncementBarAction({ messages: updated });
        if (res.success) {
          onNotification('Added new announcement ticker message.');
        }
      } catch (err) {
        alert('Failed to add message');
      }
    });
  };

  // 1-Click Toggle Nav Item Visibility
  const handleToggleNavItem = (id: string, currentEnabled: boolean) => {
    const nextEnabled = !currentEnabled;
    const updated = navItems.map((item) =>
      item.id === id ? { ...item, isEnabled: nextEnabled } : item
    );
    setNavItems(updated);

    startTransition(async () => {
      try {
        const res = await updateNavItemsAction(updated);
        if (res.success) {
          onNotification('Navbar link visibility updated.');
        }
      } catch (err) {
        setNavItems(navItems);
        alert('Failed to update navigation link');
      }
    });
  };

  // Move Nav Item Up
  const handleMoveNavUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...navItems];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    const reordered = updated.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    setNavItems(reordered);

    startTransition(async () => {
      try {
        const res = await updateNavItemsAction(reordered);
        if (res.success) {
          onNotification('Navbar order updated.');
        }
      } catch (err) {
        alert('Failed to reorder navbar');
      }
    });
  };

  // Move Nav Item Down
  const handleMoveNavDown = (index: number) => {
    if (index >= navItems.length - 1) return;
    const updated = [...navItems];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    const reordered = updated.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    setNavItems(reordered);

    startTransition(async () => {
      try {
        const res = await updateNavItemsAction(reordered);
        if (res.success) {
          onNotification('Navbar order updated.');
        }
      } catch (err) {
        alert('Failed to reorder navbar');
      }
    });
  };

  // Add Custom Nav Link
  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkName.trim() || !newLinkHref.trim()) return;

    startTransition(async () => {
      try {
        const res = await addCustomNavItemAction({
          name: newLinkName.trim(),
          href: newLinkHref.trim(),
          badge: newLinkBadge.trim() || undefined,
        });
        if (res.success) {
          setNavItems(res.settings.navigation.items);
          setIsAddingLink(false);
          setNewLinkName('');
          setNewLinkHref('');
          setNewLinkBadge('');
          onNotification(`Added "${newLinkName}" to the navigation.`);
        }
      } catch (err) {
        alert('Failed to add custom link');
      }
    });
  };

  // Delete Nav Link
  const handleDeleteLink = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the navbar?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteNavItemAction(id);
        if (res.success) {
          setNavItems(res.settings.navigation.items);
          onNotification(`Removed "${name}" from navigation.`);
        }
      } catch (err) {
        alert('Failed to delete navigation link');
      }
    });
  };

  return (
    <div className="space-y-10">
      {/* ========================================================== */}
      {/* 1. TOP ANNOUNCEMENT BAR TICKER STUDIO                      */}
      {/* ========================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span>Top Ticker Strip</span>
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Announcement Bar &amp; Promo Banner
            </h3>
            <p className="text-xs text-stone-500 max-w-xl">
              Displays above the header on all storefront pages. Promote free shipping, discount codes, or seasonal festival offers.
            </p>
          </div>

          {/* Master 1-Click Toggle Switch */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`text-xs font-semibold ${
                announcement.isEnabled ? 'text-emerald-700' : 'text-stone-400'
              }`}
            >
              {announcement.isEnabled ? 'Bar Active (Visible)' : 'Bar Hidden'}
            </span>
            <button
              type="button"
              onClick={handleToggleAnnouncement}
              disabled={isPending}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${
                announcement.isEnabled ? 'bg-primary' : 'bg-stone-300'
              }`}
              role="switch"
              aria-checked={announcement.isEnabled}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  announcement.isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {announcement.isEnabled ? (
                  <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-stone-300" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Ticker Messages List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Active Ticker Messages ({announcement.messages.length})
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingMessage(!isAddingMessage)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-light hover:bg-gold/20 text-gold-hover text-xs font-semibold border border-gold/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>Add Message</span>
            </button>
          </div>

          {/* Inline Add Message Form */}
          {isAddingMessage && (
            <form
              onSubmit={handleAddMessage}
              className="p-4 rounded-2xl bg-surface-warm border border-gold/40 space-y-3 animate-in fade-in duration-200"
            >
              <div className="font-semibold text-xs text-stone-900">New Ticker Message:</div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    required
                    value={newMsgText}
                    onChange={(e) => setNewMsgText(e.target.value)}
                    placeholder="e.g. Free express shipping on orders above ₹999"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={newMsgLink}
                    onChange={(e) => setNewMsgLink(e.target.value)}
                    placeholder="Optional Link (e.g. /shop)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="sm:col-span-3 flex items-center gap-2">
                  <select
                    value={newMsgIcon}
                    onChange={(e) => setNewMsgIcon(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none"
                  >
                    <option value="sparkles">✨ Sparkles</option>
                    <option value="gift">🎁 Gift</option>
                    <option value="truck">🚚 Delivery Truck</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingMessage(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs"
                >
                  Save Message
                </button>
              </div>
            </form>
          )}

          {announcement.messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="p-1.5 rounded-lg bg-white border border-stone-200 text-gold shrink-0">
                  {msg.icon === 'gift' ? (
                    <Gift className="w-3.5 h-3.5" />
                  ) : msg.icon === 'truck' ? (
                    <Truck className="w-3.5 h-3.5" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </span>
                <span className="font-medium text-stone-900 truncate">{msg.text}</span>
                {msg.link && (
                  <span className="font-mono text-[11px] text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0 hidden sm:inline">
                    {msg.link}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDeleteMessage(msg.id)}
                disabled={isPending}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors shrink-0"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. MAIN NAVBAR & NAVIGATION STUDIO                         */}
      {/* ========================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-light text-gold-hover border border-gold/40">
                <Compass className="w-3.5 h-3.5 text-gold" />
                <span>Store Header Menu</span>
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Navbar Navigation Items
            </h3>
            <p className="text-xs text-stone-500 max-w-xl">
              Customize the links shown in the top navigation bar and mobile menu drawer. Add custom promotion links, reorder, or toggle visibility in 1 click.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingLink(!isAddingLink)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Nav Link</span>
          </button>
        </div>

        {/* Inline Add Custom Link Form */}
        {isAddingLink && (
          <form
            onSubmit={handleAddCustomLink}
            className="p-5 rounded-2xl bg-surface-warm border border-gold/40 space-y-4 animate-in fade-in duration-200"
          >
            <div className="font-semibold text-xs text-stone-900">
              Add New Navigation Item to Header:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Menu Title
                </label>
                <input
                  type="text"
                  required
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  placeholder="e.g. Festive Gift Sets"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  required
                  value={newLinkHref}
                  onChange={(e) => setNewLinkHref(e.target.value)}
                  placeholder="e.g. /shop?category=gift-boxes"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  value={newLinkBadge}
                  onChange={(e) => setNewLinkBadge(e.target.value)}
                  placeholder="e.g. Popular or 10% Off"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingLink(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs"
              >
                Add to Navbar
              </button>
            </div>
          </form>
        )}

        {/* Nav Items List */}
        <div className="space-y-3">
          {navItems.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === navItems.length - 1;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.isEnabled
                    ? 'bg-white border-stone-200 hover:border-gold/50 shadow-2xs'
                    : 'bg-stone-50/70 border-dashed border-stone-300 opacity-70'
                }`}
              >
                {/* Left: Reorder & Link Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveNavUp(index)}
                      disabled={isFirst || isPending}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-xs font-bold text-stone-500 w-5 text-center">
                      #{item.sortOrder}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMoveNavDown(index)}
                      disabled={isLast || isPending}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & URL */}
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-stone-900 text-sm">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                      {item.isCustom && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gold-light text-gold-hover border border-gold/40">
                          Custom Link
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-stone-400 block truncate">
                      {item.href}
                    </span>
                  </div>
                </div>

                {/* Right: Toggle & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <span
                    className={`text-xs font-semibold ${
                      item.isEnabled ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    {item.isEnabled ? 'In Navbar' : 'Hidden'}
                  </span>

                  {/* 1-Click Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleNavItem(item.id, item.isEnabled)}
                    disabled={isPending}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${
                      item.isEnabled ? 'bg-primary' : 'bg-stone-300'
                    }`}
                    role="switch"
                    aria-checked={item.isEnabled}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                        item.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {item.isEnabled && <Check className="w-3 h-3 text-primary stroke-[3]" />}
                    </span>
                  </button>

                  {/* Delete button (for custom links) */}
                  {item.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(item.id, item.name)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete custom link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
