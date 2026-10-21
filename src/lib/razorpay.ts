import Razorpay from 'razorpay';
import crypto from 'crypto';

export interface CreateRazorpayOrderInput {
  amount: number; // in paise
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status?: string;
}

export function isRazorpayEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RAZORPAY_ENABLED === 'true';
}

export function isPlaceholderCredentials(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  return (
    !keyId ||
    !keySecret ||
    keyId === 'rzp_test_placeholder' ||
    keySecret === 'rzp_test_placeholder'
  );
}

export function getRazorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
}

let razorpayInstance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay | null {
  if (!isRazorpayEnabled()) {
    return null;
  }
  if (isPlaceholderCredentials()) {
    return null;
  }
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
}

/**
 * Creates an order in Razorpay (or a dev mock if keys are placeholders)
 */
export async function createRazorpayOrder(
  input: CreateRazorpayOrderInput
): Promise<RazorpayOrderResult> {
  const instance = getRazorpayInstance();

  if (!instance) {
    // Development fallback mock order
    const mockId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id: mockId,
      amount: input.amount,
      currency: 'INR',
      receipt: input.receipt,
      status: 'created',
    };
  }

  const order = await instance.orders.create({
    amount: input.amount,
    currency: 'INR',
    receipt: input.receipt,
    notes: input.notes,
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    receipt: order.receipt || input.receipt,
    status: order.status,
  };
}

/**
 * Verifies Razorpay payment signature via HMAC SHA-256
 */
export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  if (isPlaceholderCredentials()) {
    // In dev / test placeholder mode, allow mock signatures matching orderId
    if (
      razorpaySignature === `mock_sig_${razorpayOrderId}` ||
      razorpaySignature.startsWith('mock_sig_')
    ) {
      return true;
    }
    // If testing genuine HMAC with dummy secret:
    const fallbackSecret = keySecret || 'dev_secret_divija';
    const generated = crypto
      .createHmac('sha256', fallbackSecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    return generated === razorpaySignature;
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature;
}
