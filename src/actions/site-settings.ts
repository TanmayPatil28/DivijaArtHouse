'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import {
  getSiteSettings,
  updateAnnouncementBar,
  updateNavItems,
  addCustomNavItem,
  deleteNavItem,
  updateStoreIdentity,
  resetSiteSettings,
  type SiteSettings,
  type AnnouncementMessage,
  type NavItemConfig,
  type StoreIdentityConfig,
} from '@/lib/site-settings';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required.');
  }
  return session.user;
}

/**
 * Server Action: Get all site settings
 */
export async function getSiteSettingsAction(): Promise<{
  success: boolean;
  settings: SiteSettings;
}> {
  await requireAdmin();
  const settings = getSiteSettings();
  return { success: true, settings };
}

/**
 * Server Action: Update Announcement Bar (Master Toggle & Messages)
 */
export async function updateAnnouncementBarAction(data: {
  isEnabled?: boolean;
  messages?: AnnouncementMessage[];
}): Promise<{
  success: boolean;
  settings: SiteSettings;
}> {
  await requireAdmin();
  const updated = updateAnnouncementBar(data);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/studio');

  return { success: true, settings: updated };
}

/**
 * Server Action: Update Navbar items (reorder, toggle visibility)
 */
export async function updateNavItemsAction(items: NavItemConfig[]): Promise<{
  success: boolean;
  settings: SiteSettings;
}> {
  await requireAdmin();
  const updated = updateNavItems(items);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/studio');

  return { success: true, settings: updated };
}

/**
 * Server Action: Add a custom navbar link
 */
export async function addCustomNavItemAction(item: {
  name: string;
  href: string;
  badge?: string;
}): Promise<{
  success: boolean;
  settings: SiteSettings;
}> {
  await requireAdmin();
  const updated = addCustomNavItem(item);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/studio');

  return { success: true, settings: updated };
}

/**
 * Server Action: Delete a navbar link
 */
export async function deleteNavItemAction(id: string): Promise<{
  success: boolean;
  settings: SiteSettings;
}> {
  await requireAdmin();
  const updated = deleteNavItem(id);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/studio');

  return { success: true, settings: updated };
}

/**
 * Server Action: Update Store Identity (Phone, WhatsApp, Email, Threshold, Socials)
 */
export async function updateStoreIdentityAction(
  data: Partial<StoreIdentityConfig>
): Promise<{
  success: boolean;
  settings: SiteSettings;
}> {
  await requireAdmin();
  const updated = updateStoreIdentity(data);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/studio');

  return { success: true, settings: updated };
}

/**
 * Server Action: Reset all site settings to default
 */
export async function resetSiteSettingsAction(): Promise<{
  success: boolean;
  settings: SiteSettings;
}> {
  await requireAdmin();
  const reset = resetSiteSettings();

  revalidatePath('/', 'layout');
  revalidatePath('/admin/studio');

  return { success: true, settings: reset };
}
