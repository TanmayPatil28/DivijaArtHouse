'use server';

import { prisma } from '@/lib/prisma';
import {
  createRazorpayOrder,
  isRazorpayEnabled,
  getRazorpayKeyId,
} from '@/lib/razorpay';
import {
  sendOrderConfirmationEmail,
  sendAdminNewOrderNotification,
} from '@/lib/email';
import type { CheckoutPayload } from '@/types';
import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  customerEmail: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  customerPhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  shippingAddress: z.object({
    fullName: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    addressLine1: z
      .string()
      .trim()
      .min(3, 'Address line 1 is required (at least 3 characters)'),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2, 'City is required'),
    state: z.string().trim().min(2, 'State is required'),
    pincode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'Please enter a valid 6-digit Indian PIN code'),
    country: z.string().trim().optional().default('India'),
  }),
  deliveryInstructions: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        personalization: z.string().optional(),
      })
    )
    .min(1, 'Your shopping bag is empty'),
  paymentMethod: z.enum(['COD', 'RAZORPAY']).default('COD'),
});

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  paymentMethod?: 'COD' | 'RAZORPAY';
  error?: string;
  errors?: Record<string, string>;
  razorpayOrder?: {
    id: string;
    amount: number;
    currency: string;
    keyId: string;
  };
}

const FREE_SHIPPING_THRESHOLD = 99900; // ₹999 in paise
const STANDARD_SHIPPING_FEE = 9900; // ₹99 in paise

/**
 * Generates a human-readable order number, checking for collision
 * Format: DAH-YYYY-XXXXXX (e.g. DAH-2026-834912)
 */
async function generateUniqueOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt++) {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    const candidate = `DAH-${year}-${randomSixDigits}`;
    const existing = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });
    if (!existing) {
      return candidate;
    }
  }
  return `DAH-${year}-${Date.now().toString().slice(-6)}`;
}

/**
 * Server Action: Creates order with server-side price recalculation,
 * atomic stock decrement, and payment initialization.
 */
export async function createOrder(
  payload: CheckoutPayload
): Promise<CreateOrderResult> {
  // 1. Zod input validation
  const validation = checkoutSchema.safeParse(payload);
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const path = issue.path.join('.');
      fieldErrors[path] = issue.message;
    }
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid checkout information',
      errors: fieldErrors,
    };
  }

  const data = validation.data;

  // 2. Server-side price recalculation and stock availability verification
  const productIds = Array.from(new Set(data.items.map((i) => i.productId)));
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
    include: {
      variants: true,
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  interface VerifiedItem {
    productId: string;
    variantId: string | null;
    productName: string;
    productSlug: string;
    variantName: string | null;
    unitPrice: number;
    quantity: number;
    lineSubtotal: number;
    image: string | null;
    personalization: string | null;
  }

  const verifiedItems: VerifiedItem[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return {
        success: false,
        error: 'One or more items in your cart are no longer available.',
      };
    }

    let unitPrice = product.price; // in paise
    let variantName: string | null = null;

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return {
          success: false,
          error: `The chosen variant for "${product.name}" is no longer available.`,
        };
      }
      if (variant.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name} (${variant.name})". Only ${variant.stockQuantity} remaining.`,
        };
      }
      unitPrice += variant.priceAdjustment || 0;
      variantName = variant.name;
    } else {
      if (product.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name}". Only ${product.stockQuantity} remaining.`,
        };
      }
    }

    // Safely extract primary product image
    let image: string | null = null;
    try {
      const parsedImages = JSON.parse(product.images);
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        image = parsedImages[0];
      }
    } catch {
      image = null;
    }

    const lineSubtotal = unitPrice * item.quantity;

    verifiedItems.push({
      productId: product.id,
      variantId: item.variantId || null,
      productName: product.name,
      productSlug: product.slug,
      variantName,
      unitPrice,
      quantity: item.quantity,
      lineSubtotal,
      image,
      personalization: item.personalization || null,
    });
  }

  // 3. Totals arithmetic
  const subtotal = verifiedItems.reduce((acc, curr) => acc + curr.lineSubtotal, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;

  // 4. Generate order number
  const orderNumber = await generateUniqueOrderNumber();

  // 5. Determine payment method based on env flag and user selection
  const razorpayActive = isRazorpayEnabled() && data.paymentMethod === 'RAZORPAY';
  const resolvedPaymentMethod = razorpayActive ? 'RAZORPAY' : 'COD';

  try {
    // 6. Prisma transaction: stock decrement + Order + OrderItems
    const order = await prisma.$transaction(async (tx) => {
      // a. Decrement stock atomically with concurrency defense
      for (const item of verifiedItems) {
        const productUpdate = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: { gte: item.quantity },
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        if (productUpdate.count === 0) {
          throw new Error(`Insufficient stock for "${item.productName}". The item may have just sold out.`);
        }

        if (item.variantId) {
          const variantUpdate = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              stockQuantity: { gte: item.quantity },
            },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });

          if (variantUpdate.count === 0) {
            throw new Error(`Insufficient stock for variant "${item.variantName}".`);
          }
        }
      }

      // b. Create Order record
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddressLine1: data.shippingAddress.addressLine1,
          shippingAddressLine2: data.shippingAddress.addressLine2 || null,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          pincode: data.shippingAddress.pincode,
          deliveryInstructions: data.deliveryInstructions || null,
          subtotal,
          shippingFee,
          taxAmount: 0,
          totalAmount,
          paymentMethod: resolvedPaymentMethod,
          paymentStatus: 'PENDING',
          orderStatus: resolvedPaymentMethod === 'COD' ? 'PENDING_COD' : 'PENDING',
        },
      });

      // c. Create immutable OrderItem records
      await tx.orderItem.createMany({
        data: verifiedItems.map((vi) => ({
          orderId: createdOrder.id,
          productId: vi.productId,
          variantId: vi.variantId,
          productName: vi.productName,
          productSlug: vi.productSlug,
          variantName: vi.variantName,
          unitPrice: vi.unitPrice,
          quantity: vi.quantity,
          lineSubtotal: vi.lineSubtotal,
          image: vi.image,
          personalizationText: vi.personalization,
        })),
      });

      return createdOrder;
    });

    // 7. Payment handling
    if (resolvedPaymentMethod === 'RAZORPAY') {
      const rzpOrder = await createRazorpayOrder({
        amount: totalAmount,
        receipt: order.orderNumber,
        notes: {
          orderId: order.id,
          customerEmail: order.customerEmail,
        },
      });

      // Store Razorpay order ID on Order
      await prisma.order.update({
        where: { id: order.id },
        data: {
          razorpayOrderId: rzpOrder.id,
        },
      });

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod: 'RAZORPAY',
        razorpayOrder: {
          id: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: getRazorpayKeyId(),
        },
      };
    }

    // Default: Cash on Delivery - trigger transactional emails asynchronously
    sendOrderConfirmationEmail(order.id).catch((err) =>
      console.error('Failed to dispatch COD customer confirmation email:', err)
    );
    sendAdminNewOrderNotification(order.id).catch((err) =>
      console.error('Failed to dispatch COD admin notification email:', err)
    );

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentMethod: 'COD',
    };
  } catch (error) {
    console.error('Checkout error creating order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred while placing your order. Please try again.',
    };
  }
}
