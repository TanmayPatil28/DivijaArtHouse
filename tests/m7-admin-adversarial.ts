/**
 * DivijaArtHouse - Milestone 7 Adversarial & Empirical Test Suite
 * Challenger 2: Admin CRUD, Category Management, Order Fulfillment & Analytics Stress Testing
 *
 * This test suite performs empirical, hostile-environment stress testing against:
 * 1. Role-Based Authorization & Session Guarding (unauthenticated, customer, admin)
 * 2. Product CRUD Boundary Testing (price 0, negative price, float paise conversion, stock 0, negative stock, slug collisions, invalid category)
 * 3. Category CRUD & Referential Integrity (slug collisions, deletion guard with attached products)
 * 4. Order Fulfillment State Machine (PENDING_COD -> PROCESSING -> SHIPPED -> DELIVERED, COD auto-PAID, invalid transitions, non-existent order ID)
 * 5. Admin Analytics Calculations (revenue in paise, CANCELLED exclusion, orders count, low stock query precision <= 5)
 */

import { PrismaClient, OrderStatus, PaymentStatus, PaymentMethod, Role } from '@prisma/client';
import nextCache from 'next/cache';

// ---------------------------------------------------------------------------
// Mocking Next.js Server Action Context & NextAuth Session
// ---------------------------------------------------------------------------
(nextCache as any).revalidatePath = () => {};

// Setup require.cache mock for auth BEFORE loading admin actions
let mockSessionUser: { id: string; role: Role; name?: string; email?: string } | null = {
  id: 'mock-admin-id',
  role: Role.ADMIN,
  name: 'Admin Challenger',
  email: 'admin@divijaarthouse.com',
};

const authPath = require.resolve('../src/auth');
require.cache[authPath] = {
  id: authPath,
  filename: authPath,
  loaded: true,
  exports: {
    auth: async () => (mockSessionUser ? { user: mockSessionUser } : null),
  },
} as any;

// Now require admin actions dynamically
const adminActions = require('../src/actions/admin');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
} = adminActions;

const prisma = new PrismaClient();

interface TestAssertion {
  suite: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

const assertions: TestAssertion[] = [];

function record(
  suite: string,
  name: string,
  condition: boolean,
  expected: string,
  actual: string,
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' = 'HIGH',
  details?: string
) {
  assertions.push({ suite, name, passed: condition, expected, actual, severity, details });
  const status = condition ? '✅ PASS' : '❌ FAIL';
  console.log(`[${status}] [${suite}] ${name}`);
  if (!condition) {
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
    if (details) console.log(`   Details:  ${details}`);
  }
}

// Track IDs for post-test database cleanup
const cleanupProductIds: string[] = [];
const cleanupCategoryIds: string[] = [];
const cleanupOrderIds: string[] = [];

async function runAdversarialSuite() {
  console.log('========================================================================');
  console.log('🌸 DivijaArtHouse - Milestone 7 Adversarial Admin Stress Test Suite');
  console.log('   Challenger 2: Admin CRUD, Fulfillment State Machine & Analytics');
  console.log('========================================================================\n');

  // Baseline category setup
  const baselineCategory = await prisma.category.findFirst();
  if (!baselineCategory) {
    throw new Error('Database lacks baseline category. Ensure seed script has been run.');
  }

  // =========================================================================
  // SUITE 1: Role-Based Authorization & Session Guarding
  // =========================================================================
  console.log('--- SUITE 1: Role-Based Authorization & Session Guarding ---');

  // 1.1 Unauthenticated Caller (mockSessionUser = null)
  mockSessionUser = null;
  const unauthTests = [
    { name: 'createProduct rejects unauthenticated', action: () => createProduct({ name: 'Unauth', description: 'desc', categoryId: baselineCategory.id, priceInRupees: 100, stockQuantity: 10 }) },
    { name: 'updateProduct rejects unauthenticated', action: () => updateProduct({ id: 'any-id', name: 'Unauth' }) },
    { name: 'deleteProduct rejects unauthenticated', action: () => deleteProduct('any-id') },
    { name: 'createCategory rejects unauthenticated', action: () => createCategory({ name: 'Unauth' }) },
    { name: 'updateCategory rejects unauthenticated', action: () => updateCategory({ id: 'any-id', name: 'Unauth' }) },
    { name: 'deleteCategory rejects unauthenticated', action: () => deleteCategory('any-id') },
    { name: 'updateOrderStatus rejects unauthenticated', action: () => updateOrderStatus('any-id', OrderStatus.PROCESSING) },
  ];

  for (const t of unauthTests) {
    let rejected = false;
    let errMessage = '';
    try {
      await t.action();
    } catch (e: any) {
      rejected = true;
      errMessage = e?.message || '';
    }
    record(
      'Suite 1: Authorization',
      t.name,
      rejected && errMessage.includes('Unauthorized'),
      'Reject with Unauthorized',
      rejected ? `Rejected: "${errMessage}"` : 'Allowed unauthenticated call!',
      'CRITICAL'
    );
  }

  // 1.2 Customer Caller (mockSessionUser = CUSTOMER)
  mockSessionUser = {
    id: 'mock-customer-id',
    role: Role.CUSTOMER,
    name: 'Customer Intruder',
    email: 'customer@example.com',
  };

  const customerTests = [
    { name: 'createProduct rejects CUSTOMER role', action: () => createProduct({ name: 'Cust', description: 'desc', categoryId: baselineCategory.id, priceInRupees: 100, stockQuantity: 10 }) },
    { name: 'deleteProduct rejects CUSTOMER role', action: () => deleteProduct('any-id') },
    { name: 'createCategory rejects CUSTOMER role', action: () => createCategory({ name: 'Cust' }) },
    { name: 'updateOrderStatus rejects CUSTOMER role', action: () => updateOrderStatus('any-id', OrderStatus.SHIPPED) },
  ];

  for (const t of customerTests) {
    let rejected = false;
    let errMessage = '';
    try {
      await t.action();
    } catch (e: any) {
      rejected = true;
      errMessage = e?.message || '';
    }
    record(
      'Suite 1: Authorization',
      t.name,
      rejected && errMessage.includes('Unauthorized'),
      'Reject with Unauthorized',
      rejected ? `Rejected: "${errMessage}"` : 'Allowed customer privilege escalation!',
      'CRITICAL'
    );
  }

  // Restore Admin session for remaining tests
  mockSessionUser = {
    id: 'mock-admin-id',
    role: Role.ADMIN,
    name: 'Admin Authorized',
    email: 'admin@divijaarthouse.com',
  };

  // =========================================================================
  // SUITE 2: Product CRUD Boundary & Adversarial Stress Testing
  // =========================================================================
  console.log('\n--- SUITE 2: Product CRUD Boundary & Adversarial Testing ---');

  // 2.1 Float Price Conversion to Exact Integer Paise
  const floatScenarios = [
    { rupees: 899.99, expectedPaise: 89999, label: 'Float with .99 paise' },
    { rupees: 1499.50, expectedPaise: 149950, label: 'Float with .50 paise' },
    { rupees: 0.01, expectedPaise: 1, label: 'Minimum 1 paise float (0.01 INR)' },
    { rupees: 1299.999, expectedPaise: 130000, label: 'Sub-paise float rounded cleanly (1299.999 INR)' },
    { rupees: 2499.00, expectedPaise: 249900, label: 'Standard round currency' },
  ];

  for (const scenario of floatScenarios) {
    const slug = `adv-float-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const res = await createProduct({
      name: `Float Test ${scenario.rupees}`,
      slug,
      description: 'Testing float price conversion to exact integer paise',
      categoryId: baselineCategory.id,
      priceInRupees: scenario.rupees,
      compareAtPriceInRupees: scenario.rupees + 200,
      stockQuantity: 10,
    });

    if (res.success && res.product) {
      cleanupProductIds.push(res.product.id);
      const dbProd = await prisma.product.findUnique({ where: { id: res.product.id } });
      const expectedComparePaise = Math.round((scenario.rupees + 200) * 100);

      record(
        'Suite 2: Product CRUD',
        `Price conversion: ${scenario.label} (₹${scenario.rupees} -> ${scenario.expectedPaise} paise)`,
        dbProd?.price === scenario.expectedPaise && dbProd?.compareAtPrice === expectedComparePaise,
        `${scenario.expectedPaise} paise`,
        `${dbProd?.price} paise (CompareAt: ${dbProd?.compareAtPrice})`
      );
    }
  }

  // 2.2 Price Boundaries: Zero Price & Negative Price
  // Test zero price
  const zeroPriceSlug = `adv-zero-price-${Date.now()}`;
  const zeroPriceRes = await createProduct({
    name: 'Free Promotional Gift Bouquet',
    slug: zeroPriceSlug,
    description: 'Testing zero price behavior',
    categoryId: baselineCategory.id,
    priceInRupees: 0,
    stockQuantity: 5,
  });

  if (zeroPriceRes.success && zeroPriceRes.product) {
    cleanupProductIds.push(zeroPriceRes.product.id);
    const dbZero = await prisma.product.findUnique({ where: { id: zeroPriceRes.product.id } });
    record(
      'Suite 2: Product CRUD',
      'Zero price (₹0) converts strictly to 0 paise without NaN',
      dbZero?.price === 0,
      '0 paise',
      `${dbZero?.price} paise`
    );
  }

  // Test negative price
  const negPriceSlug = `adv-neg-price-${Date.now()}`;
  let negPriceAllowed = false;
  try {
    const negPriceRes = await createProduct({
      name: 'Adversarial Negative Price Item',
      slug: negPriceSlug,
      description: 'Adversary injecting negative price',
      categoryId: baselineCategory.id,
      priceInRupees: -50, // -₹50
      stockQuantity: 10,
    });
    if (negPriceRes.success && negPriceRes.product) {
      cleanupProductIds.push(negPriceRes.product.id);
      negPriceAllowed = true;
    }
  } catch {
    negPriceAllowed = false;
  }

  record(
    'Suite 2: Product CRUD',
    'Negative price input (-₹50) audit',
    !negPriceAllowed, // ideally should be rejected
    'Negative price rejected by validation',
    negPriceAllowed ? 'VULNERABILITY: Negative price was accepted into DB (-5000 paise)' : 'Rejected cleanly',
    'MEDIUM',
    negPriceAllowed ? 'Product price in DB is negative signed int without schema or server action validation guard' : undefined
  );

  // 2.3 Stock Boundaries: Zero Stock, Negative Stock & Low-Stock Classification
  // Zero Stock
  const zeroStockSlug = `adv-zero-stock-${Date.now()}`;
  const zeroStockRes = await createProduct({
    name: 'Out of Stock Bouquet',
    slug: zeroStockSlug,
    description: 'Testing 0 inventory units',
    categoryId: baselineCategory.id,
    priceInRupees: 799,
    stockQuantity: 0,
  });

  if (zeroStockRes.success && zeroStockRes.product) {
    cleanupProductIds.push(zeroStockRes.product.id);
    const dbZeroStock = await prisma.product.findUnique({ where: { id: zeroStockRes.product.id } });
    record(
      'Suite 2: Product CRUD',
      'Stock quantity 0 units handled accurately',
      dbZeroStock?.stockQuantity === 0,
      '0 units',
      `${dbZeroStock?.stockQuantity} units`
    );
  }

  // Negative Stock
  const negStockSlug = `adv-neg-stock-${Date.now()}`;
  let negStockAllowed = false;
  try {
    const negStockRes = await createProduct({
      name: 'Adversarial Negative Stock Item',
      slug: negStockSlug,
      description: 'Adversary injecting negative stock',
      categoryId: baselineCategory.id,
      priceInRupees: 799,
      stockQuantity: -5,
    });
    if (negStockRes.success && negStockRes.product) {
      cleanupProductIds.push(negStockRes.product.id);
      negStockAllowed = true;
    }
  } catch {
    negStockAllowed = false;
  }

  record(
    'Suite 2: Product CRUD',
    'Negative stock quantity (-5) audit',
    !negStockAllowed,
    'Negative stock rejected by validation',
    negStockAllowed ? 'VULNERABILITY: Negative stock was accepted into DB (-5 units)' : 'Rejected cleanly',
    'MEDIUM',
    negStockAllowed ? 'Number(input.stockQuantity) allows negative integers without bounds check' : undefined
  );

  // Low Stock Boundary Test: stock = 5 (included), stock = 6 (excluded)
  const lowStockBoundary5Slug = `adv-low-stock-5-${Date.now()}`;
  const lowStockBoundary6Slug = `adv-low-stock-6-${Date.now()}`;

  const prod5 = await createProduct({
    name: 'Low Stock Boundary 5 Units',
    slug: lowStockBoundary5Slug,
    description: 'Low stock boundary test item',
    categoryId: baselineCategory.id,
    priceInRupees: 999,
    stockQuantity: 5, // Exactly on threshold <= 5
  });
  if (prod5.product) cleanupProductIds.push(prod5.product.id);

  const prod6 = await createProduct({
    name: 'Low Stock Boundary 6 Units',
    slug: lowStockBoundary6Slug,
    description: 'Low stock boundary test item',
    categoryId: baselineCategory.id,
    priceInRupees: 999,
    stockQuantity: 6, // Above threshold
  });
  if (prod6.product) cleanupProductIds.push(prod6.product.id);

  // Query low stock items (<= 5)
  const lowStockQueryResults = await prisma.product.findMany({
    where: { stockQuantity: { lte: 5 } },
    select: { id: true, stockQuantity: true },
  });
  const lowStockIds = new Set(lowStockQueryResults.map((p) => p.id));

  record(
    'Suite 2: Product CRUD',
    'Product with stock = 5 is included in low-stock query (<= 5)',
    lowStockIds.has(prod5.product!.id),
    'Included in low-stock set',
    lowStockIds.has(prod5.product!.id) ? 'Included' : 'Missing from low stock'
  );

  record(
    'Suite 2: Product CRUD',
    'Product with stock = 6 is excluded from low-stock query (<= 5)',
    !lowStockIds.has(prod6.product!.id),
    'Excluded from low-stock set',
    !lowStockIds.has(prod6.product!.id) ? 'Excluded' : 'Inadvertently included in low stock'
  );

  // 2.4 Duplicate Product Slug Collision Handling
  const uniqueSlug = `adv-collision-${Date.now()}`;
  const originalProd = await createProduct({
    name: 'Collision Original Bloom',
    slug: uniqueSlug,
    description: 'Original bloom with unique slug',
    categoryId: baselineCategory.id,
    priceInRupees: 599,
    stockQuantity: 10,
  });
  if (originalProd.product) cleanupProductIds.push(originalProd.product.id);

  let collisionRejected = false;
  let collisionError = '';
  try {
    await createProduct({
      name: 'Collision Duplicate Bloom',
      slug: uniqueSlug, // DUPLICATE SLUG
      description: 'Second bloom colliding on slug',
      categoryId: baselineCategory.id,
      priceInRupees: 699,
      stockQuantity: 10,
    });
  } catch (err: any) {
    collisionRejected = true;
    collisionError = err?.message || '';
  }

  record(
    'Suite 2: Product CRUD',
    'Product slug collision rejected by MySQL unique constraint',
    collisionRejected && (collisionError.includes('Unique constraint') || collisionError.includes('P2002')),
    'Rejection on unique constraint (P2002)',
    collisionRejected ? `Rejected: ${collisionError.slice(0, 80)}...` : 'Allowed duplicate slug!'
  );

  // 2.5 Invalid Category ID Foreign Key Handling
  let invalidCatRejected = false;
  let invalidCatError = '';
  try {
    await createProduct({
      name: 'Invalid Category Bloom',
      slug: `adv-invalid-cat-${Date.now()}`,
      description: 'Bloom with non-existent category foreign key',
      categoryId: 'cl_nonexistent_category_id_99999',
      priceInRupees: 599,
      stockQuantity: 10,
    });
  } catch (err: any) {
    invalidCatRejected = true;
    invalidCatError = err?.message || '';
  }

  record(
    'Suite 2: Product CRUD',
    'Invalid categoryId rejected by MySQL foreign key constraint',
    invalidCatRejected && (invalidCatError.includes('Foreign key') || invalidCatError.includes('P2003')),
    'Rejection on foreign key constraint (P2003)',
    invalidCatRejected ? `Rejected: ${invalidCatError.slice(0, 80)}...` : 'Allowed non-existent category!'
  );

  // 2.6 Product Update & Partial Mutations
  const updateRes = await updateProduct({
    id: originalProd.product!.id,
    name: 'Collision Original Bloom Updated',
    priceInRupees: 749.50, // Float update
    stockQuantity: 3, // Now enters low stock
    isActive: false,
    isFeatured: true,
  });

  const updatedDbProd = await prisma.product.findUnique({ where: { id: originalProd.product!.id } });
  record(
    'Suite 2: Product CRUD',
    'Product update correctly mutates price, stock, isActive, isFeatured',
    updatedDbProd?.name === 'Collision Original Bloom Updated' &&
      updatedDbProd?.price === 74950 &&
      updatedDbProd?.stockQuantity === 3 &&
      updatedDbProd?.isActive === false &&
      updatedDbProd?.isFeatured === true,
    'All updated fields match in MySQL',
    `Name: ${updatedDbProd?.name}, Price: ${updatedDbProd?.price}, Stock: ${updatedDbProd?.stockQuantity}, Active: ${updatedDbProd?.isActive}, Featured: ${updatedDbProd?.isFeatured}`
  );

  // 2.7 Product Deletion
  const deleteRes = await deleteProduct(originalProd.product!.id);
  const deletedCheck = await prisma.product.findUnique({ where: { id: originalProd.product!.id } });
  record(
    'Suite 2: Product CRUD',
    'Product successfully deleted from catalog',
    deleteRes.success && deletedCheck === null,
    'Product record removed from MySQL',
    deletedCheck === null ? 'Removed cleanly' : 'Still exists in DB'
  );

  // =========================================================================
  // SUITE 3: Category CRUD & Referential Integrity Stress Testing
  // =========================================================================
  console.log('\n--- SUITE 3: Category CRUD & Referential Integrity ---');

  // 3.1 Category Creation
  const testCatSlug = `adv-cat-${Date.now()}`;
  const createdCatRes = await createCategory({
    name: 'Artisan Glass Vases',
    slug: testCatSlug,
    description: 'Hand-blown decorative vases for crochet arrangements',
    sortOrder: 99,
    isActive: true,
  });

  if (createdCatRes.success && createdCatRes.category) {
    cleanupCategoryIds.push(createdCatRes.category.id);
  }

  record(
    'Suite 3: Category CRUD',
    'Category successfully created in database',
    Boolean(createdCatRes.success && createdCatRes.category?.id),
    'Category record created',
    `Created ID: ${createdCatRes.category?.id}, Slug: ${createdCatRes.category?.slug}`
  );

  // 3.2 Duplicate Category Slug Collision
  let catCollisionRejected = false;
  let catCollisionError = '';
  try {
    await createCategory({
      name: 'Duplicate Vases Collection',
      slug: testCatSlug, // DUPLICATE SLUG
      description: 'Second category with duplicate slug',
    });
  } catch (err: any) {
    catCollisionRejected = true;
    catCollisionError = err?.message || '';
  }

  record(
    'Suite 3: Category CRUD',
    'Duplicate category slug rejected by MySQL unique constraint',
    catCollisionRejected && (catCollisionError.includes('Unique constraint') || catCollisionError.includes('P2002')),
    'Rejection on unique constraint (P2002)',
    catCollisionRejected ? `Rejected: ${catCollisionError.slice(0, 80)}...` : 'Allowed duplicate category slug!'
  );

  // 3.3 Referential Integrity: Deleting Category with Attached Products
  // Attach a temporary product to this category
  const attachedProduct = await prisma.product.create({
    data: {
      name: 'Attached Vase Rose',
      slug: `adv-attached-rose-${Date.now()}`,
      description: 'Rose attached to test category deletion constraint',
      categoryId: createdCatRes.category!.id,
      price: 129900,
      stockQuantity: 5,
      images: '["/images/products/test.svg"]',
    },
  });
  cleanupProductIds.push(attachedProduct.id);

  let deleteCatBlocked = false;
  let deleteCatError = '';
  try {
    await deleteCategory(createdCatRes.category!.id);
  } catch (err: any) {
    deleteCatBlocked = true;
    deleteCatError = err?.message || '';
  }

  record(
    'Suite 3: Category CRUD',
    'Category deletion BLOCKED when products are attached (Referential Integrity)',
    deleteCatBlocked && (deleteCatError.includes('Foreign key') || deleteCatError.includes('P2003')),
    'Deletion blocked by foreign key constraint (P2003)',
    deleteCatBlocked ? `Blocked: ${deleteCatError.slice(0, 80)}...` : 'VULNERABILITY: Category deleted while products attached!'
  );

  // Clean up attached product first, then delete category
  await prisma.product.delete({ where: { id: attachedProduct.id } });
  const deleteEmptyCatRes = await deleteCategory(createdCatRes.category!.id);
  const emptyCatCheck = await prisma.category.findUnique({ where: { id: createdCatRes.category!.id } });

  record(
    'Suite 3: Category CRUD',
    'Category cleanly deleted when no products are attached',
    deleteEmptyCatRes.success && emptyCatCheck === null,
    'Category removed from MySQL',
    emptyCatCheck === null ? 'Removed cleanly' : 'Still exists in DB'
  );

  // =========================================================================
  // SUITE 4: Order Fulfillment State Machine Stress Testing
  // =========================================================================
  console.log('\n--- SUITE 4: Order Fulfillment State Machine ---');

  // 4.1 Lifecycle Progression: PENDING_COD -> PROCESSING -> SHIPPED -> DELIVERED
  const testOrderNumber = `DAH-ADV-${Date.now()}`;
  const testOrder = await prisma.order.create({
    data: {
      orderNumber: testOrderNumber,
      customerName: 'Adversarial Test Customer',
      customerEmail: 'adversarial.buyer@example.com',
      customerPhone: '+91 98765 43210',
      shippingAddressLine1: '404 Resilience Blvd',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      subtotal: 149900,
      shippingFee: 0,
      taxAmount: 0,
      totalAmount: 149900,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING_COD,
    },
  });
  cleanupOrderIds.push(testOrder.id);

  record(
    'Suite 4: Fulfillment State Machine',
    'Order initialized as PENDING_COD with paymentStatus: PENDING',
    testOrder.orderStatus === OrderStatus.PENDING_COD && testOrder.paymentStatus === PaymentStatus.PENDING,
    'orderStatus=PENDING_COD, paymentStatus=PENDING',
    `orderStatus=${testOrder.orderStatus}, paymentStatus=${testOrder.paymentStatus}`
  );

  // 4.2 Transition to PROCESSING
  const processingRes = await updateOrderStatus(testOrder.id, OrderStatus.PROCESSING);
  record(
    'Suite 4: Fulfillment State Machine',
    'Transition to PROCESSING preserves paymentStatus: PENDING',
    processingRes.success &&
      processingRes.order.orderStatus === OrderStatus.PROCESSING &&
      processingRes.order.paymentStatus === PaymentStatus.PENDING,
    'orderStatus=PROCESSING, paymentStatus=PENDING',
    `orderStatus=${processingRes.order.orderStatus}, paymentStatus=${processingRes.order.paymentStatus}`
  );

  // 4.3 Transition to SHIPPED
  const shippedRes = await updateOrderStatus(testOrder.id, OrderStatus.SHIPPED);
  record(
    'Suite 4: Fulfillment State Machine',
    'Transition to SHIPPED preserves paymentStatus: PENDING',
    shippedRes.success &&
      shippedRes.order.orderStatus === OrderStatus.SHIPPED &&
      shippedRes.order.paymentStatus === PaymentStatus.PENDING,
    'orderStatus=SHIPPED, paymentStatus=PENDING',
    `orderStatus=${shippedRes.order.orderStatus}, paymentStatus=${shippedRes.order.paymentStatus}`
  );

  // 4.4 Transition to DELIVERED: Automatic COD Payment Settlement
  const deliveredRes = await updateOrderStatus(testOrder.id, OrderStatus.DELIVERED);
  const deliveredDbOrder = await prisma.order.findUnique({ where: { id: testOrder.id } });

  record(
    'Suite 4: Fulfillment State Machine',
    'Transition to DELIVERED automatically updates COD paymentStatus to PAID',
    deliveredRes.success &&
      deliveredRes.order.orderStatus === OrderStatus.DELIVERED &&
      deliveredRes.order.paymentStatus === PaymentStatus.PAID &&
      deliveredDbOrder?.paymentStatus === PaymentStatus.PAID,
    'orderStatus=DELIVERED, paymentStatus=PAID',
    `orderStatus=${deliveredDbOrder?.orderStatus}, paymentStatus=${deliveredDbOrder?.paymentStatus}`,
    'CRITICAL'
  );

  // 4.5 Non-Existent Order ID Handling
  let nonExistentRejected = false;
  let nonExistentError = '';
  try {
    await updateOrderStatus('cl_nonexistent_order_id_99999', OrderStatus.SHIPPED);
  } catch (err: any) {
    nonExistentRejected = true;
    nonExistentError = err?.message || '';
  }

  record(
    'Suite 4: Fulfillment State Machine',
    'Non-existent order ID rejected with RecordNotFound (P2025)',
    nonExistentRejected && (nonExistentError.includes('Record to update not found') || nonExistentError.includes('P2025')),
    'Rejection on non-existent ID (P2025)',
    nonExistentRejected ? `Rejected: ${nonExistentError.slice(0, 80)}...` : 'Failed to reject fake order ID!'
  );

  // 4.6 Invalid Enum / Status Value Handling
  let invalidEnumRejected = false;
  try {
    await updateOrderStatus(testOrder.id, 'MALICIOUS_UNREGISTERED_STATUS' as any);
  } catch {
    invalidEnumRejected = true;
  }

  record(
    'Suite 4: Fulfillment State Machine',
    'Invalid order status enum rejected by Prisma runtime',
    invalidEnumRejected,
    'Rejected invalid enum string',
    invalidEnumRejected ? 'Rejected cleanly' : 'Accepted invalid enum string!'
  );

  // 4.7 Backward State Transition Audit (DELIVERED -> PENDING_COD)
  // An adversarial admin or compromised client attempts to transition a DELIVERED order back to PENDING_COD
  let backwardTransitionAllowed = false;
  try {
    const backwardRes = await updateOrderStatus(testOrder.id, OrderStatus.PENDING_COD);
    if (backwardRes.success && backwardRes.order.orderStatus === OrderStatus.PENDING_COD) {
      backwardTransitionAllowed = true;
    }
  } catch {
    backwardTransitionAllowed = false;
  }

  record(
    'Suite 4: Fulfillment State Machine',
    'Fulfillment state machine backwards transition guard audit (DELIVERED -> PENDING_COD)',
    !backwardTransitionAllowed,
    'Backwards transitions guarded by state transition table',
    backwardTransitionAllowed
      ? 'OBSERVATION: updateOrderStatus allows arbitrary state transitions without monotonic finite-state machine enforcement'
      : 'Guarded',
    'LOW',
    backwardTransitionAllowed ? 'Admin UI dropdown allows selecting any status directly, server action does not restrict previous state' : undefined
  );

  // =========================================================================
  // SUITE 5: Admin Analytics Calculations Accuracy
  // =========================================================================
  console.log('\n--- SUITE 5: Admin Analytics Calculations Accuracy ---');

  // Baseline metrics
  const initialActiveOrders = await prisma.order.findMany({
    where: { orderStatus: { not: OrderStatus.CANCELLED } },
    select: { totalAmount: true },
  });
  const initialRevenuePaise = initialActiveOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const initialOrdersCount = await prisma.order.count();

  // Create an active test order with totalAmount = 249900 paise (₹2,499.00)
  const activeOrderRevenue = await prisma.order.create({
    data: {
      orderNumber: `DAH-METRIC-ACT-${Date.now()}`,
      customerName: 'Metric Active Customer',
      customerEmail: 'metric.active@example.com',
      customerPhone: '+91 91234 56789',
      shippingAddressLine1: 'Analytics Road 1',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      subtotal: 249900,
      totalAmount: 249900,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.DELIVERED,
    },
  });
  cleanupOrderIds.push(activeOrderRevenue.id);

  // Create a CANCELLED test order with totalAmount = 599900 paise (₹5,999.00)
  const cancelledOrderRevenue = await prisma.order.create({
    data: {
      orderNumber: `DAH-METRIC-CAN-${Date.now()}`,
      customerName: 'Metric Cancelled Customer',
      customerEmail: 'metric.cancelled@example.com',
      customerPhone: '+91 91234 56788',
      shippingAddressLine1: 'Analytics Road 2',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      subtotal: 599900,
      totalAmount: 599900,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.CANCELLED,
    },
  });
  cleanupOrderIds.push(cancelledOrderRevenue.id);

  // Recalculate metrics as done in src/app/admin/page.tsx
  const postActiveOrders = await prisma.order.findMany({
    where: { orderStatus: { not: OrderStatus.CANCELLED } },
    select: { totalAmount: true },
  });
  const postRevenuePaise = postActiveOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const postOrdersCount = await prisma.order.count();

  // Assertions on Analytics
  record(
    'Suite 5: Admin Analytics',
    'Total revenue strictly includes active orders and excludes CANCELLED orders',
    postRevenuePaise === initialRevenuePaise + 249900,
    `Initial (${initialRevenuePaise}) + 249900 = ${initialRevenuePaise + 249900} paise`,
    `${postRevenuePaise} paise (Diff: ${postRevenuePaise - initialRevenuePaise} paise)`
  );

  record(
    'Suite 5: Admin Analytics',
    'Total orders count increments by exactly 2 (both active and cancelled count towards total transactions)',
    postOrdersCount === initialOrdersCount + 2,
    `Initial (${initialOrdersCount}) + 2 = ${initialOrdersCount + 2} orders`,
    `${postOrdersCount} orders`
  );

  // Low stock query ordering and accuracy
  const lowStockAsc = await prisma.product.findMany({
    where: { stockQuantity: { lte: 5 } },
    orderBy: { stockQuantity: 'asc' },
    select: { id: true, stockQuantity: true },
  });

  let isStrictlySortedAsc = true;
  for (let i = 0; i < lowStockAsc.length - 1; i++) {
    if (lowStockAsc[i].stockQuantity > lowStockAsc[i + 1].stockQuantity) {
      isStrictlySortedAsc = false;
      break;
    }
  }

  record(
    'Suite 5: Admin Analytics',
    'Low stock query orders results ascending by stockQuantity',
    isStrictlySortedAsc,
    'Sorted ascending (e.g. 0, 1, 3, 4, 5)',
    isStrictlySortedAsc ? 'Strictly ascending' : 'Sorting mismatch'
  );

  // =========================================================================
  // CLEANUP & SUMMARY
  // =========================================================================
  console.log('\n--- Cleaning up test artifacts from database ---');
  if (cleanupProductIds.length > 0) {
    await prisma.product.deleteMany({ where: { id: { in: cleanupProductIds } } });
    console.log(`Cleaned up ${cleanupProductIds.length} test products.`);
  }
  if (cleanupCategoryIds.length > 0) {
    await prisma.category.deleteMany({ where: { id: { in: cleanupCategoryIds } } });
    console.log(`Cleaned up ${cleanupCategoryIds.length} test categories.`);
  }
  if (cleanupOrderIds.length > 0) {
    await prisma.order.deleteMany({ where: { id: { in: cleanupOrderIds } } });
    console.log(`Cleaned up ${cleanupOrderIds.length} test orders.`);
  }

  console.log('\n========================================================================');
  console.log('STRESS TEST SUMMARY');
  console.log('========================================================================');

  const total = assertions.length;
  const passed = assertions.filter((a) => a.passed).length;
  const failed = total - passed;
  const criticalFails = assertions.filter((a) => !a.passed && a.severity === 'CRITICAL').length;
  const highFails = assertions.filter((a) => !a.passed && a.severity === 'HIGH').length;
  const mediumFails = assertions.filter((a) => !a.passed && a.severity === 'MEDIUM').length;
  const lowFails = assertions.filter((a) => !a.passed && a.severity === 'LOW').length;

  console.log(`Total Scenarios Tested: ${total}`);
  console.log(`Passed:                 ${passed}`);
  console.log(`Failed:                 ${failed}`);
  if (failed > 0) {
    console.log(`  - Critical:           ${criticalFails}`);
    console.log(`  - High:               ${highFails}`);
    console.log(`  - Medium:             ${mediumFails}`);
    console.log(`  - Low:                ${lowFails}`);
    console.log('\nFailed Scenarios Breakdown:');
    for (const a of assertions.filter((a) => !a.passed)) {
      console.log(`❌ [${a.severity}] [${a.suite}] ${a.name}`);
      console.log(`     Expected: ${a.expected}`);
      console.log(`     Actual:   ${a.actual}`);
      if (a.details) console.log(`     Details:  ${a.details}`);
    }
  }

  console.log('========================================================================\n');
  return { total, passed, failed, criticalFails, highFails, mediumFails, lowFails };
}

runAdversarialSuite()
  .then((res) => {
    // If critical or high failures exist, exit with 1
    if (res.criticalFails > 0 || res.highFails > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error('Fatal execution error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
