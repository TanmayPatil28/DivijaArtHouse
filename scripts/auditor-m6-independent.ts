import { prisma } from '../src/lib/prisma';
import { createOrder } from '../src/actions/checkout';
import { verifyPayment } from '../src/actions/payment';
import { getWishlistProducts } from '../src/actions/wishlist';

async function runForensicAudit() {
  console.log('--- STARTING AUDITOR M6 FORENSIC VERIFICATION ---');

  // Check 1: Server-Side Price Recalculation & Tamper Resistance
  console.log('\n[Check 1] Server-Side Price Recalculation & Tamper Resistance:');
  const sampleProduct = await prisma.product.findFirst({
    where: { isActive: true, stockQuantity: { gt: 5 } },
    include: { variants: true },
  });

  if (!sampleProduct) {
    throw new Error('No active product found in DB to audit.');
  }

  const sampleVariant = sampleProduct.variants[0] || null;
  const expectedUnitPrice = sampleProduct.price + (sampleVariant ? sampleVariant.priceAdjustment : 0);
  const qty = 2;
  const expectedSubtotal = expectedUnitPrice * qty;
  const expectedShipping = expectedSubtotal >= 99900 ? 0 : 9900;
  const expectedTotal = expectedSubtotal + expectedShipping;

  const testPayload = {
    customerName: 'Auditor Forensic Verify',
    customerEmail: 'forensic.auditor@divija-test.in',
    customerPhone: '9876543210',
    shippingAddress: {
      addressLine1: 'Audit Forensic Lab, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    },
    deliveryInstructions: 'Forensic integrity audit test order',
    items: [
      {
        productId: sampleProduct.id,
        variantId: sampleVariant ? sampleVariant.id : undefined,
        quantity: qty,
        personalization: 'Forensic test personalization note',
      },
    ],
    paymentMethod: 'COD' as const,
  };

  const initialStock = sampleProduct.stockQuantity;
  const orderResult = await createOrder(testPayload);

  if (!orderResult.success || !orderResult.orderId) {
    throw new Error(`Order creation failed: ${orderResult.error}`);
  }

  console.log(`✓ Order successfully created: ${orderResult.orderNumber} (ID: ${orderResult.orderId})`);

  // Verify DB record directly
  const dbOrder = await prisma.order.findUnique({
    where: { id: orderResult.orderId },
    include: { items: true },
  });

  if (!dbOrder) {
    throw new Error('Created order not found in MySQL DB!');
  }

  // Integer paise check
  if (
    !Number.isInteger(dbOrder.subtotal) ||
    !Number.isInteger(dbOrder.shippingFee) ||
    !Number.isInteger(dbOrder.totalAmount)
  ) {
    throw new Error('Non-integer monetary value detected in Order record!');
  }

  if (dbOrder.subtotal !== expectedSubtotal) {
    throw new Error(`Subtotal mismatch! DB: ${dbOrder.subtotal}, Expected: ${expectedSubtotal}`);
  }
  if (dbOrder.shippingFee !== expectedShipping) {
    throw new Error(`Shipping fee mismatch! DB: ${dbOrder.shippingFee}, Expected: ${expectedShipping}`);
  }
  if (dbOrder.totalAmount !== expectedTotal) {
    throw new Error(`Total amount mismatch! DB: ${dbOrder.totalAmount}, Expected: ${expectedTotal}`);
  }

  console.log(`✓ Server-side calculation matches DB exactly: Subtotal=${dbOrder.subtotal}, Shipping=${dbOrder.shippingFee}, Total=${dbOrder.totalAmount}`);

  // Order item snapshot check
  const orderItem = dbOrder.items[0];
  if (!orderItem) {
    throw new Error('No order item found in DB!');
  }

  if (orderItem.unitPrice !== expectedUnitPrice) {
    throw new Error(`OrderItem unitPrice snapshot mismatch! DB: ${orderItem.unitPrice}, Expected: ${expectedUnitPrice}`);
  }
  if (orderItem.productName !== sampleProduct.name) {
    throw new Error(`OrderItem productName snapshot mismatch! DB: "${orderItem.productName}", Expected: "${sampleProduct.name}"`);
  }
  if (!Number.isInteger(orderItem.unitPrice) || !Number.isInteger(orderItem.lineSubtotal)) {
    throw new Error('Non-integer monetary value detected in OrderItem record!');
  }

  console.log(`✓ OrderItem snapshot verified: ProductName="${orderItem.productName}", UnitPrice=${orderItem.unitPrice}, LineSubtotal=${orderItem.lineSubtotal}`);

  // Guest checkout check: userId must be null
  if (dbOrder.userId !== null) {
    throw new Error(`Expected guest order userId to be null, got: ${dbOrder.userId}`);
  }
  console.log('✓ Guest checkout verified: userId is null.');

  // Atomic stock decrement check
  const postProduct = await prisma.product.findUnique({
    where: { id: sampleProduct.id },
  });
  if (!postProduct || postProduct.stockQuantity !== initialStock - qty) {
    throw new Error(`Stock was not decremented! Initial: ${initialStock}, Now: ${postProduct?.stockQuantity}`);
  }
  console.log(`✓ Stock decrement verified: ${initialStock} -> ${postProduct.stockQuantity} (decremented by ${qty})`);

  // Check 2: Razorpay Signature Verification & State Transition
  console.log('\n[Check 2] Razorpay Signature Verification & State Transition:');
  process.env.NEXT_PUBLIC_RAZORPAY_ENABLED = 'true';

  const rzpOrderResult = await createOrder({
    customerName: 'Auditor Online Test',
    customerEmail: 'auditor.online@divija-test.in',
    customerPhone: '9811223344',
    shippingAddress: {
      addressLine1: 'Cyber Security Wing, Floor 4',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
    },
    items: [{ productId: sampleProduct.id, quantity: 1 }],
    paymentMethod: 'RAZORPAY',
  });

  if (!rzpOrderResult.success || !rzpOrderResult.orderId || !rzpOrderResult.razorpayOrder) {
    throw new Error(`Razorpay order creation failed: ${rzpOrderResult.error}`);
  }

  console.log(`✓ Razorpay order created: ${rzpOrderResult.orderNumber} (Razorpay ID: ${rzpOrderResult.razorpayOrder.id})`);

  // Tampered signature attempt
  const bogusVerify = await verifyPayment({
    orderId: rzpOrderResult.orderId,
    razorpayOrderId: rzpOrderResult.razorpayOrder.id,
    razorpayPaymentId: 'pay_fraud_123',
    razorpaySignature: 'fraudulent_signature_hash',
  });

  if (bogusVerify.success) {
    throw new Error('Security flaw: Bogus signature was accepted by verifyPayment!');
  }
  console.log('✓ Bogus signature correctly rejected.');

  const dbOrderFailed = await prisma.order.findUnique({
    where: { id: rzpOrderResult.orderId },
  });
  if (dbOrderFailed?.paymentStatus !== 'FAILED') {
    throw new Error(`Expected paymentStatus FAILED after forged signature, got: ${dbOrderFailed?.paymentStatus}`);
  }
  console.log(`✓ Order status in DB after forgery attempt: ${dbOrderFailed.paymentStatus}`);

  // Valid signature verification
  const validVerify = await verifyPayment({
    orderId: rzpOrderResult.orderId,
    razorpayOrderId: rzpOrderResult.razorpayOrder.id,
    razorpayPaymentId: 'pay_valid_forensic_789',
    razorpaySignature: `mock_sig_${rzpOrderResult.razorpayOrder.id}`,
  });

  if (!validVerify.success) {
    throw new Error(`Valid signature failed verification: ${validVerify.error}`);
  }

  const dbOrderPaid = await prisma.order.findUnique({
    where: { id: rzpOrderResult.orderId },
  });
  if (dbOrderPaid?.paymentStatus !== 'PAID' || dbOrderPaid?.orderStatus !== 'PROCESSING') {
    throw new Error(`Expected PAID / PROCESSING, got: ${dbOrderPaid?.paymentStatus} / ${dbOrderPaid?.orderStatus}`);
  }
  console.log(`✓ Order status in DB after valid verification: paymentStatus=${dbOrderPaid.paymentStatus}, orderStatus=${dbOrderPaid.orderStatus}`);

  // Check 3: Wishlist deduplication verification (M5 recommendation)
  console.log('\n[Check 3] Wishlist product fetch deduplication:');
  const wishlistResult = await getWishlistProducts([
    sampleProduct.id,
    sampleProduct.id,
    sampleProduct.id,
    '   ',
    'non-existent-id',
  ]);
  if (wishlistResult.length !== 1 || wishlistResult[0].id !== sampleProduct.id) {
    throw new Error(`Wishlist deduplication failed: expected 1 item, got ${wishlistResult.length}`);
  }
  console.log(`✓ Wishlist deduplication verified: [duplicate, duplicate] -> 1 unique item.`);

  // Clean up test orders and restore stock
  console.log('\n[Check 4] Cleanup test artifacts & restore stock:');
  await prisma.product.update({
    where: { id: sampleProduct.id },
    data: { stockQuantity: { increment: qty + 1 } },
  });
  await prisma.orderItem.deleteMany({
    where: { orderId: { in: [orderResult.orderId, rzpOrderResult.orderId] } },
  });
  await prisma.order.deleteMany({
    where: { id: { in: [orderResult.orderId, rzpOrderResult.orderId] } },
  });
  console.log('✓ Cleanup complete.');

  console.log('\n=== ALL FORENSIC AUDIT CHECKS PASSED EMPIRICALLY ===');
}

runForensicAudit()
  .catch((err) => {
    console.error('Forensic audit failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
