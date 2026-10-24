'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Flower2,
  FolderTree,
  ShoppingBag,
  ExternalLink,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { handleSignOut } from '@/actions/auth';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Site Studio', href: '/admin/studio', icon: Palette },
  { name: 'Products', href: '/admin/products', icon: Flower2 },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
];

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-stone-900 text-stone-100 flex flex-col flex-shrink-0 min-h-screen border-r border-stone-800">
      {/* Admin Brand Wordmark */}
      <div className="p-6 border-b border-stone-800">
        <Link href="/admin" className="flex flex-col">
          <span className="text-xl font-semibold tracking-tight tracking-tight text-white flex items-center gap-2">
            <span className="text-primary">✿</span> DivijaArtHouse
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-semibold">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      {/* Main Admin Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-400">
          Management
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-400">
          Quick Links
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-300 hover:text-white hover:bg-stone-800/80 transition-all"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-stone-400" />
            <span>View Storefront</span>
          </div>
          <span className="text-[10px] text-stone-400">↗</span>
        </Link>
      </nav>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-stone-800 bg-stone-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user.name || 'Admin'}
              </p>
              <p className="text-[11px] text-stone-400 truncate">
                {user.email}
              </p>
            </div>
          </div>

          <form action={handleSignOut}>
            <button
              type="submit"
              title="Sign Out"
              className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
