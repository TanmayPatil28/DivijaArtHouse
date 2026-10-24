import React from 'react';
import { getHomepageSections } from '@/lib/homepage-sections';
import { HomepageSectionsManager } from '@/components/admin/HomepageSectionsManager';

export const metadata = {
  title: 'Homepage Studio | DivijaArtHouse Admin',
  description: 'Manage homepage sections, toggle visibility in one click, and reorder layout.',
};

export default function AdminHomepageStudioPage() {
  const sections = getHomepageSections();

  return (
    <div className="space-y-6">
      <HomepageSectionsManager initialSections={sections} />
    </div>
  );
}
