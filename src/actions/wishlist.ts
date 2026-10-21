'use server';

import { prisma } from '@/lib/prisma';
import type { ProductWithCategory } from '@/types';

/**
 * Fetch full product records for an array of product IDs.
 * Used by the Wishlist page to resolve client-stored wishlist IDs into full product entities.
 */
export async function getWishlistProducts(
  productIds: string[]
): Promise<ProductWithCategory[]> {
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return [];
  }

  // Deduplicate and filter valid string IDs
  const uniqueIds = Array.from(
    new Set(
      productIds.filter(
        (id) => typeof id === 'string' && id.trim().length > 0
      )
    )
  );

  if (uniqueIds.length === 0) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        id: { in: uniqueIds },
        isActive: true,
      },
      include: {
        category: true,
        variants: {
          orderBy: { priceAdjustment: 'asc' },
        },
      },
    });

    // Preserve the order of unique items
    const productMap = new Map(products.map((p) => [p.id, p as ProductWithCategory]));
    const orderedProducts: ProductWithCategory[] = [];

    for (const id of uniqueIds) {
      const match = productMap.get(id);
      if (match) {
        orderedProducts.push(match);
      }
    }

    return orderedProducts;
  } catch (error) {
    console.error('Failed to fetch wishlist products:', error);
    return [];
  }
}
