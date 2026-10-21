import { prisma } from './prisma';
import type { CategoryWithProducts } from '@/types';

/**
 * Fetch all categories ordered by sortOrder.
 */
export async function getCategories(options: {
  activeOnly?: boolean;
  includeProductsCount?: boolean;
} = {}): Promise<CategoryWithProducts[]> {
  const { activeOnly = true, includeProductsCount = true } = options;

  const where = activeOnly ? { isActive: true } : {};

  const categories = await prisma.category.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: {
      ...(includeProductsCount ? { _count: { select: { products: true } } } : {}),
    },
  });

  return categories as CategoryWithProducts[];
}

/**
 * Fetch a single category by slug, optionally including active products.
 */
export async function getCategoryBySlug(
  slug: string,
  options: {
    includeProducts?: boolean;
    productLimit?: number;
  } = {}
): Promise<CategoryWithProducts | null> {
  if (!slug) return null;

  const { includeProducts = false, productLimit = 50 } = options;
  const safeProductLimit =
    !productLimit || isNaN(productLimit)
      ? 20
      : Math.max(1, Math.min(100, productLimit));

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: true },
      },
      ...(includeProducts
        ? {
            products: {
              where: { isActive: true },
              orderBy: { isFeatured: 'desc' },
              take: safeProductLimit,
            },
          }
        : {}),
    },
  });

  if (!category || !category.isActive) {
    return null;
  }

  return category as CategoryWithProducts;
}
