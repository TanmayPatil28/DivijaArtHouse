'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import type { OrderStatus } from '@prisma/client';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required.');
  }
  return session.user;
}

/**
 * ---------------------------------------------------------------------------
 * Product Actions
 * ---------------------------------------------------------------------------
 */

export interface CreateProductInput {
  name: string;
  slug?: string;
  description: string;
  details?: string;
  categoryId: string;
  priceInRupees: number;
  compareAtPriceInRupees?: number;
  stockQuantity: number;
  isActive?: boolean;
  isFeatured?: boolean;
  image?: string;
  tags?: string;
}

export async function createProduct(input: CreateProductInput) {
  await requireAdmin();

  const finalSlug = slugify(input.slug || input.name);
  const priceInPaise = Math.round(Number(input.priceInRupees) * 100);
  const compareAtPaise = input.compareAtPriceInRupees
    ? Math.round(Number(input.compareAtPriceInRupees) * 100)
    : null;

  const imageArray = input.image ? [input.image] : ['/images/products/crochet-rose-pink.svg'];

  const product = await prisma.product.create({
    data: {
      name: input.name.trim(),
      slug: finalSlug,
      description: input.description.trim(),
      details: input.details?.trim() || null,
      categoryId: input.categoryId,
      price: priceInPaise,
      compareAtPrice: compareAtPaise,
      stockQuantity: Number(input.stockQuantity) || 0,
      isActive: input.isActive ?? true,
      isFeatured: input.isFeatured ?? false,
      tags: input.tags?.trim() || '',
      images: JSON.stringify(imageArray),
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/');
  return { success: true, product };
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  details?: string;
  categoryId?: string;
  priceInRupees?: number;
  compareAtPriceInRupees?: number;
  stockQuantity?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  image?: string;
  tags?: string;
}

export async function updateProduct(input: UpdateProductInput) {
  await requireAdmin();

  const data: Record<string, any> = {};

  if (input.name !== undefined) data.name = input.name.trim();
  if (input.slug !== undefined) data.slug = slugify(input.slug);
  if (input.description !== undefined) data.description = input.description.trim();
  if (input.details !== undefined) data.details = input.details.trim();
  if (input.categoryId !== undefined) data.categoryId = input.categoryId;
  if (input.priceInRupees !== undefined) {
    data.price = Math.round(Number(input.priceInRupees) * 100);
  }
  if (input.compareAtPriceInRupees !== undefined) {
    data.compareAtPrice = input.compareAtPriceInRupees
      ? Math.round(Number(input.compareAtPriceInRupees) * 100)
      : null;
  }
  if (input.stockQuantity !== undefined) {
    data.stockQuantity = Number(input.stockQuantity);
  }
  if (input.isActive !== undefined) data.isActive = input.isActive;
  if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;
  if (input.tags !== undefined) data.tags = input.tags.trim();
  if (input.image !== undefined) {
    data.images = JSON.stringify([input.image]);
  }

  const product = await prisma.product.update({
    where: { id: input.id },
    data,
  });

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath(`/products/${product.slug}`);
  revalidatePath('/');
  return { success: true, product };
}

export async function deleteProduct(productId: string) {
  await requireAdmin();

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/');
  return { success: true };
}

/**
 * ---------------------------------------------------------------------------
 * Category Actions
 * ---------------------------------------------------------------------------
 */

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function createCategory(input: CreateCategoryInput) {
  await requireAdmin();

  const finalSlug = slugify(input.slug || input.name);

  const category = await prisma.category.create({
    data: {
      name: input.name.trim(),
      slug: finalSlug,
      description: input.description?.trim() || null,
      image: input.image || '/images/categories/bouquets.svg',
      sortOrder: Number(input.sortOrder) || 0,
      isActive: input.isActive ?? true,
    },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/');
  return { success: true, category };
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function updateCategory(input: UpdateCategoryInput) {
  await requireAdmin();

  const data: Record<string, any> = {};
  if (input.name !== undefined) data.name = input.name.trim();
  if (input.slug !== undefined) data.slug = slugify(input.slug);
  if (input.description !== undefined) data.description = input.description.trim();
  if (input.image !== undefined) data.image = input.image.trim();
  if (input.sortOrder !== undefined) data.sortOrder = Number(input.sortOrder);
  if (input.isActive !== undefined) data.isActive = input.isActive;

  const category = await prisma.category.update({
    where: { id: input.id },
    data,
  });

  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/');
  return { success: true, category };
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();

  await prisma.category.delete({
    where: { id: categoryId },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/');
  return { success: true };
}

/**
 * ---------------------------------------------------------------------------
 * Order Fulfillment Actions
 * ---------------------------------------------------------------------------
 */

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  await requireAdmin();

  const updateData: Record<string, any> = {
    orderStatus: newStatus,
  };

  // If order delivered, mark COD as paid
  if (newStatus === 'DELIVERED') {
    updateData.paymentStatus = 'PAID';
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
  });

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  revalidatePath('/account/orders');
  return { success: true, order };
}
