import React from 'react';
import prisma from '@/lib/prisma';
import { ProductsManager } from '@/components/admin/ProductsManager';

export const metadata = {
  title: 'Manage Products | DivijaArtHouse Admin',
  description: 'Add, update, or remove handcrafted crochet products and inventory.',
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
          Artisan Product Catalog
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Manage product pricing in paise, active stock quantities, images, and category assignments
        </p>
      </div>

      <ProductsManager
        initialProducts={products}
        categories={categories}
      />
    </div>
  );
}
