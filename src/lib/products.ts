import { prisma } from './prisma';
import type { ProductWithCategory, ProductFilterParams } from '@/types';
import type { Prisma } from '@prisma/client';

export interface PaginatedProductsResult {
  products: ProductWithCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetch a paginated and filtered list of active products.
 */
export async function getProducts(
  params: ProductFilterParams = {}
): Promise<PaginatedProductsResult> {
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    sort = 'featured',
    q,
    page = 1,
    limit = 12,
  } = params;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  // Filter by category slug or categoryId
  if (category && category !== 'all') {
    where.OR = [
      { category: { slug: category } },
      { categoryId: category },
    ];
  }

  // Filter by price range (in paise)
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined && !isNaN(minPrice)) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      where.price.lte = maxPrice;
    }
  }

  // Filter by stock availability
  if (inStock === true) {
    where.stockQuantity = { gt: 0 };
  }

  // Search by query string (name, description, tags)
  if (q && q.trim()) {
    const searchTerm = q.trim();
    where.AND = [
      {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { tags: { contains: searchTerm } },
        ],
      },
    ];
  }

  // Sorting order
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  switch (sort) {
    case 'price_asc':
      orderBy = { price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { price: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'featured':
    default:
      orderBy = { isFeatured: 'desc' };
      break;
  }

  const safePage = !page || isNaN(page) ? 1 : Math.max(1, page);
  const safeLimit =
    limit === 0
      ? 1
      : !limit || isNaN(limit)
      ? 12
      : Math.max(1, Math.min(100, limit));
  const skip = (safePage - 1) * safeLimit;

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: safeLimit,
      include: {
        category: true,
        variants: true,
      },
    }),
  ]);

  return {
    products: products as ProductWithCategory[],
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit) || 1,
  };
}

/**
 * Fetch a single product by slug, including category and variants.
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  if (!slug) return null;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        orderBy: { priceAdjustment: 'asc' },
      },
    },
  });

  if (!product || !product.isActive) {
    return null;
  }

  return product as ProductWithCategory;
}

/**
 * Fetch featured products for the storefront homepage.
 */
export async function getFeaturedProducts(
  limit = 8
): Promise<ProductWithCategory[]> {
  const safeLimit =
    limit === 0
      ? 1
      : !limit || isNaN(limit)
      ? 8
      : Math.max(1, Math.min(50, limit));

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    take: safeLimit,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      variants: true,
    },
  });

  return products as ProductWithCategory[];
}

/**
 * Fetch related products based on category and tags.
 */
export async function getRelatedProducts(
  currentProductId: string,
  categoryId: string,
  tags?: string,
  limit = 4
): Promise<ProductWithCategory[]> {
  if (limit === 0) return [];
  const safeLimit =
    !limit || isNaN(limit) ? 4 : Math.max(1, Math.min(20, limit));

  const parsedTags = tags
    ? tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const orConditions: Prisma.ProductWhereInput[] = [{ categoryId }];

  for (const tag of parsedTags.slice(0, 3)) {
    orConditions.push({ tags: { contains: tag } });
  }

  let related = await prisma.product.findMany({
    where: {
      id: { not: currentProductId },
      isActive: true,
      OR: orConditions,
    },
    take: safeLimit,
    orderBy: { isFeatured: 'desc' },
    include: {
      category: true,
      variants: true,
    },
  });

  // If not enough related products found, backfill with featured products
  if (related.length < safeLimit) {
    const existingIds = [currentProductId, ...related.map((p) => p.id)];
    const backfill = await prisma.product.findMany({
      where: {
        id: { notIn: existingIds },
        isActive: true,
      },
      take: safeLimit - related.length,
      orderBy: { isFeatured: 'desc' },
      include: {
        category: true,
        variants: true,
      },
    });

    related = [...related, ...backfill];
  }

  return related as ProductWithCategory[];
}
