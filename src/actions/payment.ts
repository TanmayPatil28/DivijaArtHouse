'use server';

import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import {
  sendOrderConfirmationEmail,
  sendAdminNewOrderNotification,
} from '@/lib/email';
import { z } from 'zod';

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay Signature is required'),
});

export interface VerifyPaymentResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  paymentStatus?: string;
  orderStatus?: string;
  error?: string;
}

/**
 * Server Action: Validates Razorpay HMAC-SHA256 signature and updates order status to PAID / PROCESSING.
 */
export async function verifyPayment(payload: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<VerifyPaymentResult> {
  const parsed = verifyPaymentSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid payment verification parameters',
    };
  }

  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    parsed.data;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return {
        success: false,
        error: 'Order record not found',
      };
    }

    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED',
        },
      });
      return {
        success: false,
        error: 'Payment signature verification failed. Please contact support.',
      };
    }

    if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
      return {
        success: false,
        error: 'Razorpay order ID mismatch. Payment cannot be verified for this order.',
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING',
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    // Trigger transactional confirmation and admin alert emails asynchronously
    sendOrderConfirmationEmail(updatedOrder.id).catch((err) =>
      console.error('Failed to dispatch prepaid customer confirmation email:', err)
    );
    sendAdminNewOrderNotification(updatedOrder.id).catch((err) =>
      console.error('Failed to dispatch prepaid admin notification email:', err)
    );

    return {
      success: true,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      paymentStatus: updatedOrder.paymentStatus,
      orderStatus: updatedOrder.orderStatus,
    };
  } catch (error) {
    console.error('Payment signature verification error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during payment verification.',
    };
  }
}
