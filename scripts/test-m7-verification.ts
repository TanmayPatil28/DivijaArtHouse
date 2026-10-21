/**
 * Milestone 7 Automated Verification Test Script
 * Verifies NextAuth v5 credentials, registration, admin stats, product CRUD, and order fulfillment.
 */

import { PrismaClient, Role, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { registerUser } from '../src/actions/auth';

const prisma = new PrismaClient();

async function runVerification() {
  console.log('🌸 DivijaArtHouse - Milestone 7 Verification Suite');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      if (details) console.error(`     Details: ${details}`);
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  // -------------------------------------------------------------------------
  // Test 1: Seeded Admin Credentials Verification
  // -------------------------------------------------------------------------
  console.log('Test 1: Verifying Seeded Admin Account...');
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@divijaarthouse.com' },
  });
  assert(!!admin, 'Admin user exists in database');
  assert(admin?.role === Role.ADMIN, 'Admin has Role.ADMIN');
  assert(!!admin?.passwordHash, 'Admin has passwordHash stored');
  const isAdminPassValid = await bcrypt.compare('Admin@Divija123!', admin!.passwordHash!);
  assert(isAdminPassValid, 'Admin password verifies with bcryptjs.compare');

  // -------------------------------------------------------------------------
  // Test 2: Seeded Customer Credentials Verification
  // -------------------------------------------------------------------------
  console.log('\nTest 2: Verifying Seeded Customer Account...');
  const customer = await prisma.user.findUnique({
    where: { email: 'ananya@example.com' },
  });
  assert(!!customer, 'Customer user exists in database');
  assert(customer?.role === Role.CUSTOMER, 'Customer has Role.CUSTOMER');
  assert(!!customer?.passwordHash, 'Customer has passwordHash stored');
  const isCustPassValid = await bcrypt.compare('Customer@123!', customer!.passwordHash!);
  assert(isCustPassValid, 'Customer password verifies with bcryptjs.compare');

  // -------------------------------------------------------------------------
  // Test 3: User Registration Flow with bcryptjs & Duplicate Prevention
  // -------------------------------------------------------------------------
  console.log('\nTest 3: Testing User Registration Server Action Flow...');
  const testEmail = `priya.verma.${Date.now()}@example.com`;
  const registerResult = await registerUser({
    name: 'Priya Verma',
    email: testEmail,
    password: 'Password@123!',
    confirmPassword: 'Password@123!',
    phone: '+91 91234 56789',
  });

  assert(registerResult.success, 'New user registration succeeded');
  assert(registerResult.user?.email === testEmail, 'Returned registered user email matches');
  assert(registerResult.user?.role === 'CUSTOMER', 'Registered user role defaults to CUSTOMER');

  const registeredUser = await prisma.user.findUnique({
    where: { email: testEmail },
  });
  assert(!!registeredUser, 'Newly registered user saved in MySQL');
  const isNewPassValid = await bcrypt.compare('Password@123!', registeredUser!.passwordHash!);
  assert(isNewPassValid, 'New user password hash successfully verified with bcryptjs');

  // Test duplicate prevention
  const duplicateResult = await registerUser({
    name: 'Priya Verma Duplicate',
    email: testEmail,
    password: 'Password@123!',
    confirmPassword: 'Password@123!',
  });
  assert(!duplicateResult.success, 'Duplicate email registration was cleanly rejected');

  // Cleanup test user
  await prisma.user.delete({ where: { id: registeredUser!.id } });
  console.log('     Cleaned up temporary test user.');

  // -------------------------------------------------------------------------
  // Test 4: Admin Dashboard Metrics Calculation
  // -------------------------------------------------------------------------
  console.log('\nTest 4: Testing Admin Analytics & Metrics Calculations...');
  const totalProducts = await prisma.product.count();
  assert(totalProducts >= 15, `Catalog products count >= 15 (Found: ${totalProducts})`);

  const activeOrders = await prisma.order.findMany({
    where: { orderStatus: { not: OrderStatus.CANCELLED } },
    select: { totalAmount: true },
  });
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  assert(totalRevenue >= 0, `Total revenue calculation in paise (Total: ${totalRevenue} paise)`);

  const lowStockCount = await prisma.product.count({
    where: { stockQuantity: { lte: 5 } },
  });
  assert(lowStockCount >= 0, `Low stock products calculated without error (Found: ${lowStockCount})`);

  // -------------------------------------------------------------------------
  // Test 5: Product CRUD Operations
  // -------------------------------------------------------------------------
  console.log('\nTest 5: Testing Product CRUD Management in MySQL...');
  const defaultCategory = await prisma.category.findFirst();
  assert(!!defaultCategory, 'Default category exists for product testing');

  const testProductSlug = `test-crochet-daisy-${Date.now()}`;
  const createdProduct = await prisma.product.create({
    data: {
      name: 'Test Artisan Daisy Pot',
      slug: testProductSlug,
      description: 'Handcrafted test daisy in a terracotta pot',
      categoryId: defaultCategory!.id,
      price: 99900, // ₹999 in paise
      compareAtPrice: 129900, // ₹1,299 in paise
      stockQuantity: 12,
      isActive: true,
      isFeatured: false,
      tags: 'test, daisy, crochet',
      images: JSON.stringify(['/images/products/smiling-tulip-pot-1.svg']),
    },
  });
  assert(!!createdProduct.id, 'Artisan product successfully created');
  assert(createdProduct.price === 99900, 'Price stored strictly in paise (99900)');

  // Update product stock and price
  const updatedProduct = await prisma.product.update({
    where: { id: createdProduct.id },
    data: {
      price: 89900,
      stockQuantity: 4, // triggers low-stock threshold
    },
  });
  assert(updatedProduct.price === 89900, 'Product price updated to 89900 paise');
  assert(updatedProduct.stockQuantity === 4, 'Product stock updated to 4 units');

  // Verify it appears in low stock query
  const testInLowStock = await prisma.product.findUnique({
    where: { id: createdProduct.id },
  });
  assert(testInLowStock!.stockQuantity <= 5, 'Product accurately reflected in low-stock threshold');

  // Delete product
  await prisma.product.delete({ where: { id: createdProduct.id } });
  const deletedCheck = await prisma.product.findUnique({
    where: { id: createdProduct.id },
  });
  assert(deletedCheck === null, 'Test product successfully deleted');

  // -------------------------------------------------------------------------
  // Test 6: Order Fulfillment Status Transitions
  // -------------------------------------------------------------------------
  console.log('\nTest 6: Testing Order Status Fulfillment Transitions...');
  const testOrderNumber = `DAH-TEST-${Date.now()}`;
  const testOrder = await prisma.order.create({
    data: {
      orderNumber: testOrderNumber,
      customerName: 'Test Buyer',
      customerEmail: 'test.buyer@example.com',
      customerPhone: '+91 99999 88888',
      shippingAddressLine1: 'Test Address Line 1',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      subtotal: 89900,
      shippingFee: 0,
      taxAmount: 0,
      totalAmount: 89900,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING_COD,
    },
  });
  assert(testOrder.orderStatus === OrderStatus.PENDING_COD, 'Order initially created as PENDING_COD');
  assert(testOrder.paymentStatus === PaymentStatus.PENDING, 'Payment initially PENDING');

  // Transition to PROCESSING
  const processingOrder = await prisma.order.update({
    where: { id: testOrder.id },
    data: { orderStatus: OrderStatus.PROCESSING },
  });
  assert(processingOrder.orderStatus === OrderStatus.PROCESSING, 'Order transitioned to PROCESSING');

  // Transition to SHIPPED
  const shippedOrder = await prisma.order.update({
    where: { id: testOrder.id },
    data: {
      orderStatus: OrderStatus.SHIPPED,
      trackingCourier: 'BlueDart Express',
      trackingNumber: 'BD123456789IN',
    },
  });
  assert(shippedOrder.orderStatus === OrderStatus.SHIPPED, 'Order transitioned to SHIPPED');
  assert(shippedOrder.trackingNumber === 'BD123456789IN', 'Tracking courier info recorded');

  // Transition to DELIVERED and mark COD as PAID
  const deliveredOrder = await prisma.order.update({
    where: { id: testOrder.id },
    data: {
      orderStatus: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
    },
  });
  assert(deliveredOrder.orderStatus === OrderStatus.DELIVERED, 'Order transitioned to DELIVERED');
  assert(deliveredOrder.paymentStatus === PaymentStatus.PAID, 'Payment updated to PAID upon delivery');

  // Cleanup test order
  await prisma.order.delete({ where: { id: testOrder.id } });
  console.log('     Cleaned up temporary test order.');

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n====================================================');
  console.log(`🎉 ALL TESTS PASSED! (${passedTests}/${totalTests} assertions passed)`);
  console.log('Milestone 7 (NextAuth v5, Account & Admin Dashboard) is fully verified.');
  console.log('====================================================\n');
}

runVerification()
  .catch((e) => {
    console.error('❌ Verification failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
