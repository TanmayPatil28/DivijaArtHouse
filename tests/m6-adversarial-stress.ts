import { prisma } from '../src/lib/prisma';
import { createOrder } from '../src/actions/checkout';
import { verifyPayment } from '../src/actions/payment';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function recordResult(suite: string, name: string, passed: boolean, details?: string) {
  results.push({ suite, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${suite}] ${name}${details ? ` -> ${details}` : ''}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('Starting M6 Adversarial & Empirical Stress Test Suite');
  console.log('====================================================\n');

  // Find a baseline active product
  const activeProduct = await prisma.product.findFirst({
    where: {
      isActive: true,
      stockQuantity: { gt: 5 },
    },
    include: {
      variants: true,
    },
  });

  if (!activeProduct) {
    throw new Error('No active product with stock > 5 found in database.');
  }

  const baseVariant = activeProduct.variants[0] || null;
  const genuineUnitPrice = activeProduct.price + (baseVariant ? baseVariant.priceAdjustment : 0);

  // ----------------------------------------------------
  // SUITE 1: Forged Client Price & Payload Tampering
  // ----------------------------------------------------
  console.log('\n--- SUITE 1: Forged Client Price & Tampering ---');

  // Malicious client payload injecting unitPrice: 1 paise (0.01 INR)
  const forgedPayload = {
    customerName: 'Adversary Hacker',
    customerEmail: 'adversary@exploit.test',
    customerPhone: '9876543210',
    shippingAddress: {
      fullName: 'Adversary Hacker',
      phone: '9876543210',
      addressLine1: '1337 Exploit Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
    },
    deliveryInstructions: 'Trying to buy ₹1,499 item for 1 paise',
    items: [
      {
        productId: activeProduct.id,
        variantId: baseVariant ? baseVariant.id : undefined,
        quantity: 1,
        personalization: 'Forged price attack',
        unitPrice: 1, // FORGED 1 paise
        price: 1,
        lineSubtotal: 1,
      } as any,
    ],
    paymentMethod: 'COD' as const,
    subtotal: 1, // FORGED
    totalAmount: 1, // FORGED
  };

  const forgedResult = await createOrder(forgedPayload as any);
  if (!forgedResult.success || !forgedResult.orderId) {
    recordResult(
      'Suite 1: Price Tampering',
      'Forged payload rejected or failed',
      false,
      forgedResult.error
    );
  } else {
    // Inspect created order in DB
    const dbOrder = await prisma.order.findUnique({
      where: { id: forgedResult.orderId },
      include: { items: true },
    });

    const itemSnapshot = dbOrder?.items[0];
    const unitPriceMatchesGenuine = itemSnapshot?.unitPrice === genuineUnitPrice;
    const subtotalMatchesGenuine = dbOrder?.subtotal === genuineUnitPrice;
    const clientPriceIgnored = itemSnapshot?.unitPrice !== 1 && dbOrder?.subtotal !== 1;

    recordResult(
      'Suite 1: Price Tampering',
      'Client forged unitPrice (1 paise) ignored by server',
      clientPriceIgnored && unitPriceMatchesGenuine && subtotalMatchesGenuine,
      `Expected ${genuineUnitPrice} paise, DB stored: ${itemSnapshot?.unitPrice} paise (Subtotal: ${dbOrder?.subtotal} paise)`
    );
  }

  // ----------------------------------------------------
  // SUITE 2: Out of Stock & Excess Quantity
  // ----------------------------------------------------
  console.log('\n--- SUITE 2: Out of Stock & Excess Quantity ---');

  // 2a. Request quantity far exceeding stock
  const excessQtyResult = await createOrder({
    customerName: 'Greedy Buyer',
    customerEmail: 'greedy@test.in',
    customerPhone: '9876543210',
    shippingAddress: {
      addressLine1: 'Plot 99, Tech Park',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
    },
    items: [
      {
        productId: activeProduct.id,
        quantity: 9999, // way over stock
      },
    ],
    paymentMethod: 'COD',
  });

  recordResult(
    'Suite 2: Out of Stock',
    'Rejects order exceeding product stockQuantity',
    !excessQtyResult.success && (excessQtyResult.error?.includes('Insufficient stock') ?? false),
    `Result error: "${excessQtyResult.error}"`
  );

  // 2b. Non-existent product ID
  const invalidProductResult = await createOrder({
    customerName: 'Ghost Buyer',
    customerEmail: 'ghost@test.in',
    customerPhone: '9876543210',
    shippingAddress: {
      addressLine1: 'Phantom Street 404',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    },
    items: [
      {
        productId: 'cl_non_existent_fake_id_99999',
        quantity: 1,
      },
    ],
    paymentMethod: 'COD',
  });

  recordResult(
    'Suite 2: Out of Stock',
    'Rejects non-existent product ID',
    !invalidProductResult.success,
    `Result error: "${invalidProductResult.error}"`
  );

  // 2c. Inactive product order attempt
  // Find or temporarily create an inactive product
  const testCategory = await prisma.category.findFirst();
  const inactiveProduct = await prisma.product.create({
    data: {
      name: 'Temp Inactive Bouquet for Test',
      slug: `temp-inactive-${Date.now()}`,
      description: 'Temporary inactive product',
      categoryId: testCategory!.id,
      price: 99900,
      stockQuantity: 10,
      isActive: false, // INACTIVE
      images: '["/images/products/temp.svg"]',
    },
  });

  const inactiveOrderResult = await createOrder({
    customerName: 'Inactive Buyer',
    customerEmail: 'inactive@test.in',
    customerPhone: '9876543210',
    shippingAddress: {
      addressLine1: 'Test Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    items: [
      {
        productId: inactiveProduct.id,
        quantity: 1,
      },
    ],
    paymentMethod: 'COD',
  });

  recordResult(
    'Suite 2: Out of Stock',
    'Rejects inactive product order attempt',
    !inactiveOrderResult.success && (inactiveOrderResult.error?.includes('no longer available') ?? false),
    `Result error: "${inactiveOrderResult.error}"`
  );

  // Clean up temporary inactive product
  await prisma.product.delete({ where: { id: inactiveProduct.id } });

  // ----------------------------------------------------
  // SUITE 3: Input Validation Stress Matrix
  // ----------------------------------------------------
  console.log('\n--- SUITE 3: Input Validation Stress Matrix ---');

  const validAddress = {
    addressLine1: 'Flat 101, Green Heights',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
  };

  const validationScenarios = [
    // Emails
    {
      name: 'Malformed email (no domain)',
      payload: { customerEmail: 'notanemail' },
      expectedField: 'customerEmail',
    },
    {
      name: 'Malformed email (missing TLD)',
      payload: { customerEmail: 'test@example' },
      expectedField: 'customerEmail',
    },
    {
      name: 'Empty email',
      payload: { customerEmail: '' },
      expectedField: 'customerEmail',
    },
    // Phones
    {
      name: '9-digit phone (under length)',
      payload: { customerPhone: '987654321' },
      expectedField: 'customerPhone',
    },
    {
      name: '11-digit phone (over length)',
      payload: { customerPhone: '98765432101' },
      expectedField: 'customerPhone',
    },
    {
      name: 'Letters in phone',
      payload: { customerPhone: '98765abcde' },
      expectedField: 'customerPhone',
    },
    {
      name: 'Phone starting with 5 (invalid Indian mobile)',
      payload: { customerPhone: '5876543210' },
      expectedField: 'customerPhone',
    },
    {
      name: 'Empty phone',
      payload: { customerPhone: '' },
      expectedField: 'customerPhone',
    },
    // PIN codes
    {
      name: '5-digit PIN code (under length)',
      payload: { shippingAddress: { ...validAddress, pincode: '11000' } },
      expectedField: 'shippingAddress.pincode',
    },
    {
      name: '7-digit PIN code (over length)',
      payload: { shippingAddress: { ...validAddress, pincode: '1100001' } },
      expectedField: 'shippingAddress.pincode',
    },
    {
      name: 'Letters in PIN code',
      payload: { shippingAddress: { ...validAddress, pincode: '11000A' } },
      expectedField: 'shippingAddress.pincode',
    },
    {
      name: 'Empty PIN code',
      payload: { shippingAddress: { ...validAddress, pincode: '' } },
      expectedField: 'shippingAddress.pincode',
    },
    // Address fields
    {
      name: 'Empty address line 1',
      payload: { shippingAddress: { ...validAddress, addressLine1: '' } },
      expectedField: 'shippingAddress.addressLine1',
    },
    {
      name: 'Address line 1 under 3 characters',
      payload: { shippingAddress: { ...validAddress, addressLine1: 'Hi' } },
      expectedField: 'shippingAddress.addressLine1',
    },
    {
      name: 'Empty city',
      payload: { shippingAddress: { ...validAddress, city: '' } },
      expectedField: 'shippingAddress.city',
    },
    {
      name: 'Empty state',
      payload: { shippingAddress: { ...validAddress, state: '' } },
      expectedField: 'shippingAddress.state',
    },
    // Customer Name
    {
      name: 'Empty customer name',
      payload: { customerName: '' },
      expectedField: 'customerName',
    },
    {
      name: 'Customer name 1 character',
      payload: { customerName: 'A' },
      expectedField: 'customerName',
    },
    // Items
    {
      name: 'Empty items array',
      payload: { items: [] },
      expectedField: 'items',
    },
    {
      name: 'Item with 0 quantity',
      payload: { items: [{ productId: activeProduct.id, quantity: 0 }] },
      expectedField: 'items.0.quantity',
    },
    {
      name: 'Item with negative quantity',
      payload: { items: [{ productId: activeProduct.id, quantity: -2 }] },
      expectedField: 'items.0.quantity',
    },
    {
      name: 'Item with float quantity',
      payload: { items: [{ productId: activeProduct.id, quantity: 1.5 }] },
      expectedField: 'items.0.quantity',
    },
  ];

  for (const scenario of validationScenarios) {
    const basePayload = {
      customerName: 'Priya Nair',
      customerEmail: 'priya@example.in',
      customerPhone: '9876543210',
      shippingAddress: { ...validAddress },
      items: [{ productId: activeProduct.id, quantity: 1 }],
      paymentMethod: 'COD' as const,
      ...scenario.payload,
    };

    const res = await createOrder(basePayload as any);
    const failed = !res.success;
    const hasFieldError = res.errors && (res.errors[scenario.expectedField] !== undefined || Object.keys(res.errors).length > 0);

    recordResult(
      'Suite 3: Validation Matrix',
      `Reject: ${scenario.name}`,
      failed && (hasFieldError ?? false),
      `Rejected: ${failed}, Field Error: ${res.errors ? JSON.stringify(res.errors) : res.error}`
    );
  }

  // ----------------------------------------------------
  // SUITE 4: Atomic Stock Decrement & Transaction Snapshot
  // ----------------------------------------------------
  console.log('\n--- SUITE 4: Atomic Stock Decrement & Snapshots ---');

  // Create a temporary dedicated test product
  const initialStock = 12;
  const unitPricePaise = 149900; // ₹1,499
  const testStockProduct = await prisma.product.create({
    data: {
      name: 'Atomic Stock Test Bouquet',
      slug: `atomic-stock-test-${Date.now()}`,
      description: 'Dedicated product for atomic stock decrement testing',
      categoryId: testCategory!.id,
      price: unitPricePaise,
      stockQuantity: initialStock,
      isActive: true,
      images: '["/images/products/test-stock.svg"]',
      variants: {
        create: [
          {
            name: 'Deluxe Pink',
            priceAdjustment: 20000, // +₹200
            stockQuantity: 8,
          },
        ],
      },
    },
    include: {
      variants: true,
    },
  });

  const testVariant = testStockProduct.variants[0];
  const orderQty = 3;

  // Genuine Order placement
  const genuineOrder = await createOrder({
    customerName: 'Vikram Sengupta',
    customerEmail: 'vikram.sengupta@kolkata.in',
    customerPhone: '9123456789',
    shippingAddress: {
      addressLine1: 'B-44 Park Street',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
    },
    deliveryInstructions: 'Handle delicately with silk wrap',
    items: [
      {
        productId: testStockProduct.id,
        variantId: testVariant.id,
        quantity: orderQty,
        personalization: 'Golden anniversary tribute',
      },
    ],
    paymentMethod: 'COD',
  });

  if (!genuineOrder.success || !genuineOrder.orderId) {
    recordResult('Suite 4: Atomic Stock', 'Place genuine order', false, genuineOrder.error);
  } else {
    // 4a. Check Product Stock Decrement
    const postProduct = await prisma.product.findUnique({
      where: { id: testStockProduct.id },
    });
    const expectedProductStock = initialStock - orderQty;
    recordResult(
      'Suite 4: Atomic Stock',
      'Exact product stock decrement',
      postProduct?.stockQuantity === expectedProductStock,
      `Initial: ${initialStock}, Order: ${orderQty}, Post: ${postProduct?.stockQuantity} (Expected: ${expectedProductStock})`
    );

    // 4b. Check Variant Stock Decrement
    const postVariant = await prisma.productVariant.findUnique({
      where: { id: testVariant.id },
    });
    const expectedVariantStock = 8 - orderQty;
    recordResult(
      'Suite 4: Atomic Stock',
      'Exact variant stock decrement',
      postVariant?.stockQuantity === expectedVariantStock,
      `Initial: 8, Order: ${orderQty}, Post: ${postVariant?.stockQuantity} (Expected: ${expectedVariantStock})`
    );

    // 4c. Check DB Snapshot and Financial Integrity
    const dbOrder = await prisma.order.findUnique({
      where: { id: genuineOrder.orderId },
      include: { items: true },
    });

    const expectedItemUnitPrice = unitPricePaise + 20000; // 169900 paise
    const expectedSubtotal = expectedItemUnitPrice * orderQty; // 509700 paise
    const expectedShipping = expectedSubtotal >= 99900 ? 0 : 9900; // 0
    const expectedTotal = expectedSubtotal + expectedShipping;

    const snapshotValid =
      dbOrder?.items.length === 1 &&
      dbOrder.items[0].unitPrice === expectedItemUnitPrice &&
      dbOrder.items[0].quantity === orderQty &&
      dbOrder.items[0].lineSubtotal === expectedSubtotal &&
      dbOrder.items[0].personalizationText === 'Golden anniversary tribute' &&
      dbOrder.items[0].productName === 'Atomic Stock Test Bouquet' &&
      dbOrder.items[0].variantName === 'Deluxe Pink';

    recordResult(
      'Suite 4: Atomic Stock',
      'Immutable OrderItem snapshot integrity',
      Boolean(snapshotValid),
      `Snapshot UnitPrice: ${dbOrder?.items[0]?.unitPrice}, Subtotal: ${dbOrder?.subtotal}, Total: ${dbOrder?.totalAmount}`
    );

    recordResult(
      'Suite 4: Atomic Stock',
      'Financial arithmetic & free shipping threshold',
      dbOrder?.subtotal === expectedSubtotal &&
        dbOrder?.shippingFee === expectedShipping &&
        dbOrder?.totalAmount === expectedTotal,
      `Subtotal: ${dbOrder?.subtotal}/${expectedSubtotal}, Shipping: ${dbOrder?.shippingFee}/${expectedShipping}, Total: ${dbOrder?.totalAmount}/${expectedTotal}`
    );
  }

  // ----------------------------------------------------
  // SUITE 5: Stock Race Condition Stress Test
  // ----------------------------------------------------
  console.log('\n--- SUITE 5: Stock Race Condition Stress Test ---');

  // Create a product with stock = 1
  const raceProduct = await prisma.product.create({
    data: {
      name: 'Race Condition Single Unit Item',
      slug: `race-item-${Date.now()}`,
      description: 'Single item to test concurrent race condition oversell',
      categoryId: testCategory!.id,
      price: 149900,
      stockQuantity: 1, // EXACTLY 1 IN STOCK
      isActive: true,
      images: '["/images/products/race.svg"]',
    },
  });

  console.log(`Created test race item with stockQuantity = 1 (ID: ${raceProduct.id})`);

  // Fire 2 simultaneous order requests, each requesting 1 unit
  const req1 = createOrder({
    customerName: 'Racer One',
    customerEmail: 'racer1@test.in',
    customerPhone: '9876543210',
    shippingAddress: {
      addressLine1: 'Race Track 1',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
    },
    items: [{ productId: raceProduct.id, quantity: 1 }],
    paymentMethod: 'COD',
  });

  const req2 = createOrder({
    customerName: 'Racer Two',
    customerEmail: 'racer2@test.in',
    customerPhone: '9876543211',
    shippingAddress: {
      addressLine1: 'Race Track 2',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
    },
    items: [{ productId: raceProduct.id, quantity: 1 }],
    paymentMethod: 'COD',
  });

  const [res1, res2] = await Promise.all([req1, req2]);

  const postRaceProduct = await prisma.product.findUnique({
    where: { id: raceProduct.id },
  });

  console.log(`Race Results:`);
  console.log(`- Request 1: success=${res1.success}, orderId=${res1.orderId}, error=${res1.error}`);
  console.log(`- Request 2: success=${res2.success}, orderId=${res2.orderId}, error=${res2.error}`);
  console.log(`- Post-Race stock in DB: ${postRaceProduct?.stockQuantity}`);

  // Did both succeed when only 1 existed?
  const bothSucceeded = res1.success && res2.success;
  const stockWentNegative = (postRaceProduct?.stockQuantity ?? 0) < 0;

  if (bothSucceeded || stockWentNegative) {
    recordResult(
      'Suite 5: Concurrency Race Condition',
      'Overselling detected under concurrent requests (VULNERABILITY)',
      false,
      `CRITICAL FLAW: Both requests succeeded (${res1.orderId}, ${res2.orderId}) and DB stock reached ${postRaceProduct?.stockQuantity}. Server does not guard against race condition inside transaction!`
    );
  } else {
    recordResult(
      'Suite 5: Concurrency Race Condition',
      'Race condition prevented, exactly 1 order succeeded',
      true,
      `One request succeeded and one failed gracefully. Remaining stock: ${postRaceProduct?.stockQuantity}`
    );
  }

  // Clean up race product
  await prisma.product.delete({ where: { id: raceProduct.id } });
  // Clean up testStockProduct
  await prisma.product.delete({ where: { id: testStockProduct.id } });

  // ----------------------------------------------------
  // SUITE 6: Payment Security & Signature Tampering
  // ----------------------------------------------------
  console.log('\n--- SUITE 6: Payment Security & Signature Tampering ---');

  // Place a Razorpay order
  process.env.NEXT_PUBLIC_RAZORPAY_ENABLED = 'true';
  const rzpOrder = await createOrder({
    customerName: 'Kavita Chawla',
    customerEmail: 'kavita@test-divija.in',
    customerPhone: '9888877777',
    shippingAddress: {
      addressLine1: 'Villa 12, Palm Meadows',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    },
    items: [{ productId: activeProduct.id, quantity: 1 }],
    paymentMethod: 'RAZORPAY',
  });

  if (!rzpOrder.success || !rzpOrder.orderId || !rzpOrder.razorpayOrder) {
    recordResult('Suite 6: Payment Security', 'Create Razorpay order', false, rzpOrder.error);
  } else {
    // 6a. Tampered Signature
    const bogusVerification = await verifyPayment({
      orderId: rzpOrder.orderId,
      razorpayOrderId: rzpOrder.razorpayOrder.id,
      razorpayPaymentId: 'pay_tampered_123',
      razorpaySignature: 'totally_bogus_forged_signature_12345',
    });

    const orderAfterTamper = await prisma.order.findUnique({
      where: { id: rzpOrder.orderId },
    });

    recordResult(
      'Suite 6: Payment Security',
      'Rejects bogus/tampered Razorpay signature and marks FAILED',
      !bogusVerification.success && orderAfterTamper?.paymentStatus === 'FAILED',
      `Bogus signature rejected: ${!bogusVerification.success}, Status in DB: ${orderAfterTamper?.paymentStatus}`
    );

    // 6b. Non-existent order verification attempt
    const nonExistentVerify = await verifyPayment({
      orderId: 'cl_fake_order_9999999',
      razorpayOrderId: 'order_fake_123',
      razorpayPaymentId: 'pay_fake_123',
      razorpaySignature: 'sig_fake',
    });

    recordResult(
      'Suite 6: Payment Security',
      'Rejects non-existent order verification',
      Boolean(!nonExistentVerify.success && nonExistentVerify.error?.includes('Order record not found')),
      `Error: "${nonExistentVerify.error}"`
    );

    // 6c. Valid Signature verification
    const validVerify = await verifyPayment({
      orderId: rzpOrder.orderId,
      razorpayOrderId: rzpOrder.razorpayOrder.id,
      razorpayPaymentId: 'pay_valid_123',
      razorpaySignature: `mock_sig_${rzpOrder.razorpayOrder.id}`,
    });

    const orderAfterValid = await prisma.order.findUnique({
      where: { id: rzpOrder.orderId },
    });

    recordResult(
      'Suite 6: Payment Security',
      'Valid signature marks order PAID and PROCESSING',
      validVerify.success &&
        orderAfterValid?.paymentStatus === 'PAID' &&
        orderAfterValid?.orderStatus === 'PROCESSING',
      `Verify success: ${validVerify.success}, paymentStatus: ${orderAfterValid?.paymentStatus}, orderStatus: ${orderAfterValid?.orderStatus}`
    );
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log('STRESS TEST SUMMARY');
  console.log('====================================================');

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`Total Scenarios Tested: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed Scenarios:');
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`- [${r.suite}] ${r.name}: ${r.details}`);
    }
  }

  return { total, passed, failed, results };
}

runTests()
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  })
  .finally(async () => {
    console.log('\nCleaning up test artifacts from database...');
    const testEmails = [
      'adversary@exploit.test',
      'racer1@test.in',
      'racer2@test.in',
      'vikram.sengupta@kolkata.in',
      'kavita@test-divija.in',
    ];
    await prisma.orderItem.deleteMany({
      where: {
        order: {
          customerEmail: { in: testEmails },
        },
      },
    });
    await prisma.order.deleteMany({
      where: {
        customerEmail: { in: testEmails },
      },
    });
    console.log('Cleanup completed successfully.');
    await prisma.$disconnect();
  });
