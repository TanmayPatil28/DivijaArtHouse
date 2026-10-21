import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind and conditional CSS class strings
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats monetary amounts stored in integer paise into INR currency representation.
 * e.g., 149900 -> "₹1,499"
 */
export function formatINR(
  amountInPaise: number,
  options: { showPaise?: boolean } = {}
): string {
  const safePaise = isNaN(amountInPaise) || !isFinite(amountInPaise) ? 0 : amountInPaise;
  const rupees = (safePaise || 0) / 100;
  const { showPaise = false } = options;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showPaise ? 2 : (rupees % 1 === 0 ? 0 : 2),
    maximumFractionDigits: showPaise ? 2 : (rupees % 1 === 0 ? 0 : 2),
  }).format(rupees);
}

/**
 * Generate URL-friendly slugs from strings
 */
export function slugify(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Computes discount percentage from price and compareAtPrice (both in paise)
 */
export function calculateDiscount(
  price: number,
  compareAtPrice: number | null | undefined
): number {
  if (
    !compareAtPrice ||
    isNaN(compareAtPrice) ||
    isNaN(price) ||
    compareAtPrice <= price ||
    compareAtPrice <= 0
  ) {
    return 0;
  }
  const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  return isNaN(discount) || !isFinite(discount) || discount <= 0 ? 0 : discount;
}

/**
 * Safely parse JSON strings with a default fallback
 */
export function parseJson<T>(value: string | null | undefined, defaultValue: T): T {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Format timestamp into standard Indian localized date string
 */
export function formatDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}
