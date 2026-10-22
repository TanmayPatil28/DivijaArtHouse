'use server';

import { prisma } from '@/lib/prisma';
import type { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

export interface TrackingItem {
  id: string;
  productName: string;
  productSlug: string;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
  lineSubtotal: number;
  image: string | null;
  personalizationText: string | null;
}

export interface SanitizedOrderTracking {
  orderNumber: string;
  createdAt: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingCity: string;
  shippingState: string;
  trackingCourier: string | null;
  trackingNumber: string | null;
  estimatedDelivery: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  itemCount: number;
  items: TrackingItem[];
  currentStep: number; // 1: Placed, 2: Crafting/Processing, 3: Dispatched, 4: Delivered
  isCancelled: boolean;
}

export interface TrackOrderResult {
  success: boolean;
  order?: SanitizedOrderTracking;
  error?: string;
}

/**
 * Calculates human-readable estimated delivery date range based on order creation
 */
function calculateDeliveryEstimate(createdAt: Date, orderStatus: OrderStatus): string {
  if (orderStatus === 'DELIVERED') {
    return 'Delivered';
  }
  if (orderStatus === 'CANCELLED') {
    return 'Cancelled';
  }

  // Calculate 4 to 7 business days from order creation
  const minDelivery = new Date(createdAt);
  minDelivery.setDate(minDelivery.getDate() + 4);

  const maxDelivery = new Date(createdAt);
  maxDelivery.setDate(maxDelivery.getDate() + 7);

  const formatOpts: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  const minStr = minDelivery.toLocaleDateString('en-IN', formatOpts);
  const maxStr = maxDelivery.toLocaleDateString('en-IN', {
    ...formatOpts,
    year: 'numeric',
  });

  return `${minStr} – ${maxStr}`;
}

/**
 * Maps database OrderStatus to the 5-step tracking stepper index (1 to 5)
 */
function mapStatusToStep(status: OrderStatus): number {
  switch (status) {
    case 'PENDING':
    case 'PENDING_COD':
      return 1;
    case 'CONFIRMED':
      return 2;
    case 'PROCESSING':
      return 3;
    case 'SHIPPED':
      return 4;
    case 'DELIVERED':
      return 5;
    case 'CANCELLED':
      return 0;
    default:
      return 1;
  }
}

/**
 * Server Action: Look up public order tracking details by order number
 */
export async function trackOrder(rawOrderNumber: string): Promise<TrackOrderResult> {
  const normalized = (rawOrderNumber || '').trim().toUpperCase();

  if (!normalized) {
    return {
      success: false,
      error: 'Please enter a valid order number (e.g. DAH-2026-123456).',
    };
  }

  // Quick demonstration sample for prospective buyers and testing
  if (normalized === 'DAH-SAMPLE' || normalized === 'SAMPLE') {
    const sampleDate = new Date();
    sampleDate.setDate(sampleDate.getDate() - 2);

    const sampleOrder: SanitizedOrderTracking = {
      orderNumber: 'DAH-SAMPLE',
      createdAt: sampleDate.toISOString(),
      orderStatus: 'SHIPPED',
      paymentStatus: 'PAID',
      paymentMethod: 'RAZORPAY',
      shippingCity: 'Bengaluru',
      shippingState: 'Karnataka',
      trackingCourier: 'BlueDart Express',
      trackingNumber: 'BD-849201938IN',
      estimatedDelivery: 'Oct 25 – Oct 27',
      subtotal: 349900,
      shippingFee: 0,
      totalAmount: 349900,
      itemCount: 1,
      items: [
        {
          id: 'sample-item-1',
          productName: 'The Royal Sovereign 24-Stem Jumbo Bouquet',
          productSlug: 'royal-sovereign-24-stem-jumbo-bouquet',
          variantName: 'Velvet Wine & Gold Ribbon Edition',
          unitPrice: 349900,
          quantity: 1,
          lineSubtotal: 349900,
          image: '/images/products/royal-sovereign-jumbo-1.svg',
          personalizationText: 'Handcrafted with love for our anniversary',
        },
      ],
      currentStep: 4,
      isCancelled: false,
    };

    return {
      success: true,
      order: sampleOrder,
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: normalized },
      include: {
        items: true,
      },
    });

    if (!order) {
      return {
        success: false,
        error: `No order found matching "${normalized}". Please check your order confirmation receipt or email for the exact order ID.`,
      };
    }

    const currentStep = mapStatusToStep(order.orderStatus);
    const isCancelled = order.orderStatus === 'CANCELLED';
    const estimatedDelivery = calculateDeliveryEstimate(
      order.createdAt,
      order.orderStatus
    );

    const trackingItems: TrackingItem[] = order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      productSlug: item.productSlug,
      variantName: item.variantName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineSubtotal: item.lineSubtotal,
      image: item.image,
      personalizationText: item.personalizationText,
    }));

    const sanitized: SanitizedOrderTracking = {
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingCity: order.city,
      shippingState: order.state,
      trackingCourier: order.trackingCourier,
      trackingNumber: order.trackingNumber,
      estimatedDelivery,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      itemCount: trackingItems.reduce((acc, i) => acc + i.quantity, 0),
      items: trackingItems,
      currentStep,
      isCancelled,
    };

    return {
      success: true,
      order: sanitized,
    };
  } catch (error) {
    console.error('Error looking up order for tracking:', error);
    return {
      success: false,
      error: 'An unexpected system error occurred while retrieving order status. Please try again later.',
    };
  }
}
