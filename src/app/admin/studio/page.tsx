import React from 'react';
import prisma from '@/lib/prisma';
import { getSiteSettings } from '@/lib/site-settings';
import { getHomepageSections } from '@/lib/homepage-sections';
import { SiteStudioMaster } from '@/components/admin/SiteStudioMaster';

export const metadata = {
  title: 'Atelier Site Studio | DivijaArtHouse Admin',
  description: 'Executive storefront customization studio: navbar, announcement bar, homepage sections, categories, and store identity.',
};

export default async function AdminSiteStudioPage() {
  const [settings, sections, categories] = await Promise.all([
    Promise.resolve(getSiteSettings()),
    Promise.resolve(getHomepageSections()),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <SiteStudioMaster
        initialSettings={settings}
        initialSections={sections}
        initialCategories={categories}
      />
    </div>
  );
}
