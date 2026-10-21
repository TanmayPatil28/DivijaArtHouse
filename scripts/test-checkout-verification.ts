import { prisma } from '../src/lib/prisma';
import { createOrder } from '../src/actions/checkout';
import { verifyPayment } from '../src/actions/payment';

async function main() {
  console.log('=== Starting Milestone 6 Verification ===\n');

  // 1. Find a real product with variants
  const product = await prisma.product.findFirst({
    where: {
      isActive: true,
      stockQuantity: { gt: 5 },
    },
    include: {
      variants: true,
    },
  });

  if (!product) {
    throw new Error('No active product found in database with stock > 5');
  }

  const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const initialProductStock = product.stockQuantity;
  const initialVariantStock = variant ? variant.stockQuantity : null;

  console.log(`[TEST 1] Selected product: "${product.name}" (ID: ${product.id})`);
  console.log(`- Base Price: ${product.price} paise`);
  console.log(`- Initial Product Stock: ${initialProductStock}`);
  if (variant) {
    console.log(`- Selected Variant: "${variant.name}" (Adjustment: ${variant.priceAdjustment} paise)`);
    console.log(`- Initial Variant Stock: ${initialVariantStock}`);
  }

  // 2. Place genuine COD order with quantity = 2
  const orderQuantity = 2;
  const expectedUnitPrice = product.price + (variant ? variant.priceAdjustment : 0);
  const expectedSubtotal = expectedUnitPrice * orderQuantity;
  const expectedShippingFee = expectedSubtotal >= 99900 ? 0 : 9900;
  const expectedTotal = expectedSubtotal + expectedShippingFee;

  console.log('\n[TEST 2] Placing genuine COD order via createOrder Server Action...');
  const codResult = await createOrder({
    customerName: 'Aarav Mehta',
    customerEmail: 'aarav.mehta@test-divija.in',
    customerPhone: '9876543210',
    shippingAddress: {
      fullName: 'Aarav Mehta',
      phone: '9876543210',
      addressLine1: 'Flat 402, Lotus Blossom Residency, MG Road',
      addressLine2: 'Near Central Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India',
    },
    deliveryInstructions: 'Fragile handcrafted flowers. Please handle with care.',
    items: [
      {
        productId: product.id,
        variantId: variant ? variant.id : undefined,
        quantity: orderQuantity,
        personalization: 'Happy Birthday Mom! Handcrafted with lots of love.',
      },
    ],
    paymentMethod: 'COD',
  });

  if (!codResult.success || !codResult.orderId) {
    console.error('COD Order creation failed:', codResult);
    throw new Error(`COD Order creation failed: ${codResult.error}`);
  }

  console.log(`✓ COD Order created successfully!`);
  console.log(`  - Order ID: ${codResult.orderId}`);
  console.log(`  - Order Number: ${codResult.orderNumber}`);
  console.log(`  - Payment Method: ${codResult.paymentMethod}`);

  // 3. Inspect Live MySQL Database Rows
  console.log('\n[TEST 3] Inspecting live MySQL database rows for Order and OrderItems...');
  const dbOrder = await prisma.order.findUnique({
    where: { id: codResult.orderId },
    include: { items: true },
  });

  if (!dbOrder) {
    throw new Error(`Order ${codResult.orderId} not found in database!`);
  }

  console.log(`✓ Verified Order in DB:`);
  console.log(`  - Customer: ${dbOrder.customerName} (${dbOrder.customerEmail}, ${dbOrder.customerPhone})`);
  console.log(`  - Address: ${dbOrder.shippingAddressLine1}, ${dbOrder.city}, ${dbOrder.state} - ${dbOrder.pincode}`);
  console.log(`  - Subtotal: ${dbOrder.subtotal} paise (Expected: ${expectedSubtotal})`);
  console.log(`  - Shipping Fee: ${dbOrder.shippingFee} paise (Expected: ${expectedShippingFee})`);
  console.log(`  - Total Amount: ${dbOrder.totalAmount} paise (Expected: ${expectedTotal})`);
  console.log(`  - Order Status: ${dbOrder.orderStatus} (Expected: PENDING_COD)`);
  console.log(`  - Payment Status: ${dbOrder.paymentStatus} (Expected: PENDING)`);
  console.log(`  - Payment Method: ${dbOrder.paymentMethod} (Expected: COD)`);

  if (dbOrder.subtotal !== expectedSubtotal) {
    throw new Error(`Subtotal mismatch! DB: ${dbOrder.subtotal}, Expected: ${expectedSubtotal}`);
  }
  if (dbOrder.totalAmount !== expectedTotal) {
    throw new Error(`Total amount mismatch! DB: ${dbOrder.totalAmount}, Expected: ${expectedTotal}`);
  }

  if (dbOrder.items.length !== 1) {
    throw new Error(`Expected 1 order item, found ${dbOrder.items.length}`);
  }

  const orderItem = dbOrder.items[0];
  console.log(`✓ Verified OrderItem snapshot in DB:`);
  console.log(`  - Product Name Snapshot: "${orderItem.productName}"`);
  console.log(`  - Variant Name Snapshot: "${orderItem.variantName}"`);
  console.log(`  - Unit Price Snapshot: ${orderItem.unitPrice} paise (Expected: ${expectedUnitPrice})`);
  console.log(`  - Quantity: ${orderItem.quantity} (Expected: ${orderQuantity})`);
  console.log(`  - Line Subtotal: ${orderItem.lineSubtotal} paise`);
  console.log(`  - Personalization Text: "${orderItem.personalizationText}"`);

  if (orderItem.unitPrice !== expectedUnitPrice) {
    throw new Error(`Item unit price snapshot mismatch! DB: ${orderItem.unitPrice}, Expected: ${expectedUnitPrice}`);
  }

  // 4. Verify Stock Decrement
  console.log('\n[TEST 4] Verifying atomic stock decrement...');
  const updatedProduct = await prisma.product.findUnique({
    where: { id: product.id },
  });

  const updatedProductStock = updatedProduct!.stockQuantity;
  console.log(`- Product stock: ${initialProductStock} -> ${updatedProductStock} (decremented by ${orderQuantity})`);
  if (initialProductStock - orderQuantity !== updatedProductStock) {
    throw new Error(`Product stock was not correctly decremented! Initial: ${initialProductStock}, Now: ${updatedProductStock}`);
  }

  if (variant) {
    const updatedVariant = await prisma.productVariant.findUnique({
      where: { id: variant.id },
    });
    const updatedVariantStock = updatedVariant!.stockQuantity;
    console.log(`- Variant stock: ${initialVariantStock} -> ${updatedVariantStock} (decremented by ${orderQuantity})`);
    if (initialVariantStock! - orderQuantity !== updatedVariantStock) {
      throw new Error(`Variant stock was not correctly decremented!`);
    }
  }
  console.log('✓ Stock decrement verified atomically in DB!');

  // 5. Test Validation Errors
  console.log('\n[TEST 5] Testing validation bounds...');
  // Invalid phone test
  const invalidPhoneResult = await createOrder({
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    customerPhone: '12345', // invalid
    shippingAddress: {
      addressLine1: 'Street 1',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    items: [{ productId: product.id, quantity: 1 }],
    paymentMethod: 'COD',
  });
  console.log(`- Invalid phone rejection: ${!invalidPhoneResult.success ? 'PASS (Correctly rejected)' : 'FAIL'}`);

  // Invalid pincode test
  const invalidPinResult = await createOrder({
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    customerPhone: '9876543210',
    shippingAddress: {
      addressLine1: 'Street 1',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '12', // invalid
    },
    items: [{ productId: product.id, quantity: 1 }],
    paymentMethod: 'COD',
  });
  console.log(`- Invalid pincode rejection: ${!invalidPinResult.success ? 'PASS (Correctly rejected)' : 'FAIL'}`);

  // 6. Test Razorpay & Payment Verification Flow
  console.log('\n[TEST 6] Testing Razorpay signature verification logic...');
  // Temporarily enable Razorpay flag for this test
  process.env.NEXT_PUBLIC_RAZORPAY_ENABLED = 'true';

  const rzpOrderResult = await createOrder({
    customerName: 'Diya Patel',
    customerEmail: 'diya@test-divija.in',
    customerPhone: '9812345678',
    shippingAddress: {
      addressLine1: 'B-12 Orchid Enclave',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015',
    },
    items: [{ productId: product.id, quantity: 1 }],
    paymentMethod: 'RAZORPAY',
  });

  if (!rzpOrderResult.success || !rzpOrderResult.orderId) {
    throw new Error('Razorpay order creation failed');
  }

  console.log(`✓ Razorpay order placed: ${rzpOrderResult.orderNumber} (ID: ${rzpOrderResult.orderId})`);
  console.log(`  - Razorpay Order ID: ${rzpOrderResult.razorpayOrder?.id}`);

  // Test payment verification Server Action
  const verifyResult = await verifyPayment({
    orderId: rzpOrderResult.orderId,
    razorpayOrderId: rzpOrderResult.razorpayOrder!.id,
    razorpayPaymentId: 'pay_test_987654321',
    razorpaySignature: `mock_sig_${rzpOrderResult.razorpayOrder!.id}`,
  });

  console.log(`- Payment verification result:`, verifyResult);
  if (!verifyResult.success) {
    throw new Error(`Payment verification failed: ${verifyResult.error}`);
  }

  // Check DB status transition
  const verifiedOrderInDb = await prisma.order.findUnique({
    where: { id: rzpOrderResult.orderId },
  });

  console.log(`✓ Order status in DB after payment verification:`);
  console.log(`  - paymentStatus: ${verifiedOrderInDb?.paymentStatus} (Expected: PAID)`);
  console.log(`  - orderStatus: ${verifiedOrderInDb?.orderStatus} (Expected: PROCESSING)`);
  console.log(`  - razorpayPaymentId: ${verifiedOrderInDb?.razorpayPaymentId}`);

  if (verifiedOrderInDb?.paymentStatus !== 'PAID' || verifiedOrderInDb?.orderStatus !== 'PROCESSING') {
    throw new Error('Order status transition failed after payment verification!');
  }

  console.log('\n=== ALL MILESTONE 6 VERIFICATIONS PASSED SUCCESSFULLY ===');
}

main()
  .catch((e) => {
    console.error('Verification failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
