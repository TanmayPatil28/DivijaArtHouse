'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import {
  getHomepageSections,
  toggleHomepageSection,
  reorderHomepageSections,
  resetHomepageSections,
  type HomepageSectionConfig,
} from '@/lib/homepage-sections';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required.');
  }
  return session.user;
}

/**
 * Server Action: Retrieve all homepage sections
 */
export async function getHomepageSectionsAction(): Promise<{
  success: boolean;
  sections: HomepageSectionConfig[];
}> {
  await requireAdmin();
  const sections = getHomepageSections();
  return { success: true, sections };
}

/**
 * Server Action: 1-Click Show/Hide Toggle
 */
export async function toggleHomepageSectionAction(
  key: string,
  isEnabled: boolean
): Promise<{
  success: boolean;
  sections: HomepageSectionConfig[];
}> {
  await requireAdmin();

  const updated = toggleHomepageSection(key, isEnabled);

  // Instantly revalidate the home page so visitors see the update immediately
  revalidatePath('/');
  revalidatePath('/admin/homepage');
  revalidatePath('/admin');

  return { success: true, sections: updated };
}

/**
 * Server Action: Reorder sections
 */
export async function reorderHomepageSectionsAction(
  keysInOrder: string[]
): Promise<{
  success: boolean;
  sections: HomepageSectionConfig[];
}> {
  await requireAdmin();

  const updated = reorderHomepageSections(keysInOrder);

  revalidatePath('/');
  revalidatePath('/admin/homepage');
  revalidatePath('/admin');

  return { success: true, sections: updated };
}

/**
 * Server Action: Reset all sections to default atelier layout
 */
export async function resetHomepageSectionsAction(): Promise<{
  success: boolean;
  sections: HomepageSectionConfig[];
}> {
  await requireAdmin();

  const reset = resetHomepageSections();

  revalidatePath('/');
  revalidatePath('/admin/homepage');
  revalidatePath('/admin');

  return { success: true, sections: reset };
}
