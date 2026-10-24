import fs from 'fs';
import path from 'path';

export interface AnnouncementMessage {
  id: string;
  text: string;
  link?: string;
  icon?: 'sparkles' | 'gift' | 'truck';
}

export interface NavItemConfig {
  id: string;
  name: string;
  href: string;
  isEnabled: boolean;
  sortOrder: number;
  badge?: string;
  isCustom?: boolean;
}

export interface StoreIdentityConfig {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  location: string;
  freeShippingThresholdINR: number;
  instagramUrl: string;
  facebookUrl: string;
  pinterestUrl: string;
}

export interface SiteSettings {
  announcementBar: {
    isEnabled: boolean;
    messages: AnnouncementMessage[];
  };
  navigation: {
    items: NavItemConfig[];
  };
  identity: StoreIdentityConfig;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementBar: {
    isEnabled: true,
    messages: [
      {
        id: 'msg-1',
        text: 'Handcrafted Rangolis & Keepsake Crafts, made with devotion.',
        icon: 'sparkles',
      },
      {
        id: 'msg-2',
        text: 'Festive OHP & Woolen Rangolis for Diwali, Weddings & Pooja.',
        link: '/shop',
        icon: 'gift',
      },
      {
        id: 'msg-3',
        text: 'Free delivery on orders over ₹999 across India.',
        link: '/shop',
        icon: 'truck',
      },
    ],
  },
  navigation: {
    items: [
      { id: 'nav-home', name: 'Home', href: '/', isEnabled: true, sortOrder: 1 },
      { id: 'nav-shop', name: 'Shop All', href: '/shop', isEnabled: true, sortOrder: 2, badge: 'Popular' },
      { id: 'nav-ohp', name: 'OHP Rangoli', href: '/collections/ohp-sheets-rangoli', isEnabled: true, sortOrder: 3 },
      { id: 'nav-woolen', name: 'Woolen Rangoli', href: '/collections/woolen-rangoli', isEnabled: true, sortOrder: 4 },
      { id: 'nav-pipe', name: 'Pipe Cleaner Crafts', href: '/collections/pipe-cleaner-crafts', isEnabled: true, sortOrder: 5 },
      { id: 'nav-decore', name: 'Decore Crafts', href: '/collections/decore-crafts', isEnabled: true, sortOrder: 6 },
      { id: 'nav-story', name: 'Our Story', href: '/about', isEnabled: true, sortOrder: 7 },
      { id: 'nav-contact', name: 'Contact', href: '/contact', isEnabled: true, sortOrder: 8 },
    ],
  },
  identity: {
    storeName: 'Divija Art House',
    tagline: 'Artisanal Rangolis & Keepsake Home Decor.',
    supportEmail: 'support@divijaarthouse.com',
    supportPhone: '+91 92092 84423',
    whatsappNumber: '+91 98765 43210',
    location: 'Hadapsar, Pune, Maharashtra 411028, India',
    freeShippingThresholdINR: 999,
    instagramUrl: 'https://instagram.com/divijaarthouse',
    facebookUrl: 'https://facebook.com/divijaarthouse',
    pinterestUrl: 'https://pinterest.com/divijaarthouse',
  },
};

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'site-settings.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Retrieves the live site settings with safe defaults
 */
export function getSiteSettings(): SiteSettings {
  try {
    ensureDataDir();

    if (!fs.existsSync(SETTINGS_FILE)) {
      saveSiteSettings(DEFAULT_SITE_SETTINGS);
      return DEFAULT_SITE_SETTINGS;
    }

    const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;

    return {
      announcementBar: {
        isEnabled: parsed.announcementBar?.isEnabled ?? DEFAULT_SITE_SETTINGS.announcementBar.isEnabled,
        messages: parsed.announcementBar?.messages?.length
          ? parsed.announcementBar.messages
          : DEFAULT_SITE_SETTINGS.announcementBar.messages,
      },
      navigation: {
        items: parsed.navigation?.items?.length
          ? parsed.navigation.items.sort((a, b) => a.sortOrder - b.sortOrder)
          : DEFAULT_SITE_SETTINGS.navigation.items,
      },
      identity: {
        ...DEFAULT_SITE_SETTINGS.identity,
        ...(parsed.identity || {}),
      },
    };
  } catch (err) {
    console.error('Error reading site settings:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Saves site settings to persistent storage
 */
export function saveSiteSettings(settings: SiteSettings): void {
  try {
    ensureDataDir();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving site settings:', err);
  }
}

/**
 * Updates Announcement Bar settings
 */
export function updateAnnouncementBar(data: {
  isEnabled?: boolean;
  messages?: AnnouncementMessage[];
}): SiteSettings {
  const settings = getSiteSettings();
  if (data.isEnabled !== undefined) {
    settings.announcementBar.isEnabled = data.isEnabled;
  }
  if (data.messages !== undefined) {
    settings.announcementBar.messages = data.messages;
  }
  saveSiteSettings(settings);
  return settings;
}

/**
 * Updates Navigation Items
 */
export function updateNavItems(items: NavItemConfig[]): SiteSettings {
  const settings = getSiteSettings();
  settings.navigation.items = items.sort((a, b) => a.sortOrder - b.sortOrder);
  saveSiteSettings(settings);
  return settings;
}

/**
 * Adds a custom nav item
 */
export function addCustomNavItem(item: {
  name: string;
  href: string;
  badge?: string;
}): SiteSettings {
  const settings = getSiteSettings();
  const newId = `nav-custom-${Date.now()}`;
  const maxOrder = settings.navigation.items.reduce((max, i) => Math.max(max, i.sortOrder), 0);

  settings.navigation.items.push({
    id: newId,
    name: item.name.trim(),
    href: item.href.trim(),
    badge: item.badge?.trim() || undefined,
    isEnabled: true,
    sortOrder: maxOrder + 1,
    isCustom: true,
  });

  saveSiteSettings(settings);
  return settings;
}

/**
 * Deletes a nav item
 */
export function deleteNavItem(id: string): SiteSettings {
  const settings = getSiteSettings();
  settings.navigation.items = settings.navigation.items.filter((item) => item.id !== id);
  // Re-normalize sort orders
  settings.navigation.items.forEach((item, index) => {
    item.sortOrder = index + 1;
  });
  saveSiteSettings(settings);
  return settings;
}

/**
 * Updates Store Identity & Footer Contact
 */
export function updateStoreIdentity(data: Partial<StoreIdentityConfig>): SiteSettings {
  const settings = getSiteSettings();
  settings.identity = {
    ...settings.identity,
    ...data,
  };
  saveSiteSettings(settings);
  return settings;
}

/**
 * Resets site settings to original atelier defaults
 */
export function resetSiteSettings(): SiteSettings {
  saveSiteSettings(DEFAULT_SITE_SETTINGS);
  return DEFAULT_SITE_SETTINGS;
}
