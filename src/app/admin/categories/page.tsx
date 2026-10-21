import React from 'react';
import prisma from '@/lib/prisma';
import { CategoriesManager } from '@/components/admin/CategoriesManager';

export const metadata = {
  title: 'Manage Categories | DivijaArtHouse Admin',
  description: 'Manage floral collections and category taxonomy.',
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
          Artisan Collections & Categories
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Organize storefront navigation, collection descriptions, and circular banner icons
        </p>
      </div>

      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
