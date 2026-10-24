import fs from 'fs';
import path from 'path';

export interface HomepageSectionConfig {
  id: string;
  key: string;
  name: string;
  category: 'Hero' | 'Discovery' | 'Story' | 'Reassurance' | 'Conversion';
  badge?: string;
  description: string;
  sortOrder: number;
  isEnabled: boolean;
}

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  {
    id: 'hero_carousel',
    key: 'hero_carousel',
    name: 'Top Carousel Showcase',
    category: 'Hero',
    badge: 'Apple-Style Carousel',
    description:
      'Dynamic horizontal slide banner showcasing featured bouquets, seasonal collections, and celebratory announcements.',
    sortOrder: 1,
    isEnabled: true,
  },
  {
    id: 'hero',
    key: 'hero',
    name: 'Editorial Brand Hero',
    category: 'Hero',
    badge: 'Visiting Card Ribbon',
    description:
      'Main editorial hero with handcrafted ribbon accent, headline, explore button, and atelier guarantees.',
    sortOrder: 2,
    isEnabled: true,
  },
  {
    id: 'value_props',
    key: 'value_props',
    name: 'Trust & Value Props Strip',
    category: 'Reassurance',
    badge: 'Pan-India Trust',
    description:
      'Four key guarantees: 100% Handcrafted by Women Artisans, Free Shipping ₹999+, Safe Bloom Box Packaging, and Everlasting Longevity.',
    sortOrder: 3,
    isEnabled: true,
  },
  {
    id: 'collection_reel',
    key: 'collection_reel',
    name: 'Shop by Collection Reel',
    category: 'Discovery',
    badge: 'Category Discs',
    description:
      'Circular illustrated discs for browsing bouquets, single stems, flower pots, and bespoke gift hampers.',
    sortOrder: 4,
    isEnabled: true,
  },
  {
    id: 'bestsellers',
    key: 'bestsellers',
    name: 'Bestselling Bouquets Grid',
    category: 'Discovery',
    badge: 'Live Catalog',
    description:
      'Data-driven product grid featuring top-selling everlasting crochet bouquets with quick Add to Bag and pricing.',
    sortOrder: 5,
    isEnabled: true,
  },
  {
    id: 'occasions',
    key: 'occasions',
    name: 'Shop by Occasion Grid',
    category: 'Discovery',
    badge: 'Gifting Hub',
    description:
      'Curated visual cards for Anniversaries, Birthdays, Romantic Gestures, and Home Decor floral arrangements.',
    sortOrder: 6,
    isEnabled: true,
  },
  {
    id: 'featured_collection',
    key: 'featured_collection',
    name: 'Editorial Spotlight Collection',
    category: 'Story',
    badge: 'Artisan Spotlight',
    description:
      'Large split-screen editorial showcase highlighting our signature Everlasting Rose arrangement and craftsmanship details.',
    sortOrder: 7,
    isEnabled: true,
  },
  {
    id: 'brand_story',
    key: 'brand_story',
    name: 'Brand Story & Artisan Heritage',
    category: 'Story',
    badge: 'Women Collective',
    description:
      'The story behind DivijaArtHouse: empowering women crochet artisans, premium milk cotton yarn, and everlasting floral preservation.',
    sortOrder: 8,
    isEnabled: true,
  },
  {
    id: 'testimonials',
    key: 'testimonials',
    name: 'Customer Reviews & Testimonials',
    category: 'Reassurance',
    badge: 'Social Proof',
    description:
      'Verified patron testimonials, star ratings, and heartwarming unboxing stories from floral gift recipients across India.',
    sortOrder: 9,
    isEnabled: true,
  },
  {
    id: 'newsletter',
    key: 'newsletter',
    name: 'Atelier VIP Newsletter',
    category: 'Conversion',
    badge: 'Lead Gen',
    description:
      'Email subscription block offering 10% off the first order and early access to limited seasonal flower drops.',
    sortOrder: 10,
    isEnabled: true,
  },
];

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'homepage-sections.json');

/**
 * Ensures data directory exists
 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Retrieves the current homepage section configurations, sorted by sortOrder.
 * Fallbacks safely to DEFAULT_HOMEPAGE_SECTIONS.
 */
export function getHomepageSections(): HomepageSectionConfig[] {
  try {
    ensureDataDir();

    if (!fs.existsSync(CONFIG_FILE)) {
      saveHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
      return DEFAULT_HOMEPAGE_SECTIONS;
    }

    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw) as HomepageSectionConfig[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
      return DEFAULT_HOMEPAGE_SECTIONS;
    }

    // Merge in any newly added default sections that might not exist in the stored json
    const existingKeys = new Set(parsed.map((s) => s.key));
    const merged = [...parsed];

    DEFAULT_HOMEPAGE_SECTIONS.forEach((defaultSec) => {
      if (!existingKeys.has(defaultSec.key)) {
        merged.push({
          ...defaultSec,
          sortOrder: merged.length + 1,
        });
      }
    });

    return merged.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.error('Error reading homepage sections configuration:', error);
    return DEFAULT_HOMEPAGE_SECTIONS;
  }
}

/**
 * Saves section configurations to persistent storage
 */
export function saveHomepageSections(sections: HomepageSectionConfig[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(sections, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving homepage sections configuration:', error);
  }
}

/**
 * 1-Click Toggle: Toggles visibility (isEnabled) for a section by key
 */
export function toggleHomepageSection(key: string, isEnabled: boolean): HomepageSectionConfig[] {
  const current = getHomepageSections();
  const updated = current.map((sec) => (sec.key === key ? { ...sec, isEnabled } : sec));
  saveHomepageSections(updated);
  return updated;
}

/**
 * Reorders sections based on an ordered array of section keys
 */
export function reorderHomepageSections(keysInOrder: string[]): HomepageSectionConfig[] {
  const current = getHomepageSections();
  const map = new Map(current.map((s) => [s.key, s]));

  const updated: HomepageSectionConfig[] = [];

  keysInOrder.forEach((key, index) => {
    const existing = map.get(key);
    if (existing) {
      updated.push({
        ...existing,
        sortOrder: index + 1,
      });
      map.delete(key);
    }
  });

  // Append any leftover sections that weren't in keysInOrder
  map.forEach((leftover) => {
    updated.push({
      ...leftover,
      sortOrder: updated.length + 1,
    });
  });

  saveHomepageSections(updated);
  return updated;
}

/**
 * Resets sections to original atelier default ordering and visibility
 */
export function resetHomepageSections(): HomepageSectionConfig[] {
  saveHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
  return DEFAULT_HOMEPAGE_SECTIONS;
}
