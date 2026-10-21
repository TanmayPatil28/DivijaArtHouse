import prisma from '../src/lib/prisma';

interface TestResult {
  suite: string;
  test: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

function record(suite: string, test: string, passed: boolean, error?: string, details?: any) {
  results.push({ suite, test, passed, error, details });
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] [${suite}] ${test}${error ? ` -> Error: ${error}` : ''}`);
}

async function runTests() {
  console.log('=== STARTING EMPIRICAL DATABASE VERIFICATION ===\n');

  // Clean slate before tests
  console.log('Cleaning any previous test artifacts...');
  await prisma.orderItem.deleteMany({ where: { productName: { startsWith: 'TEST_' } } });
  await prisma.order.deleteMany({ where: { orderNumber: { startsWith: 'TEST-ORD-' } } });
  await prisma.wishlistItem.deleteMany({ where: { user: { email: { startsWith: 'test_' } } } });
  await prisma.address.deleteMany({ where: { fullName: { startsWith: 'TEST_' } } });
  await prisma.productVariant.deleteMany({ where: { name: { startsWith: 'TEST_' } } });
  await prisma.product.deleteMany({ where: { slug: { startsWith: 'test-' } } });
  await prisma.category.deleteMany({ where: { slug: { startsWith: 'test-' } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: 'test_' } } });
  await prisma.subscriber.deleteMany({ where: { email: { startsWith: 'test_' } } });
  await prisma.contactInquiry.deleteMany({ where: { email: { startsWith: 'test_' } } });

  // -------------------------------------------------------------
  // SUITE 1: User CRUD
  // -------------------------------------------------------------
  let userId1 = '';
  try {
    const createdUser = await prisma.user.create({
      data: {
        name: 'Test Customer',
        email: 'test_user1@example.com',
        phone: '9876543210',
        role: 'CUSTOMER',
        passwordHash: '$2a$12$eXampleHashedPasswordStringForEmpiricalTest',
      },
    });
    userId1 = createdUser.id;
    record('User CRUD', 'Create User', Boolean(createdUser.id && createdUser.role === 'CUSTOMER'));

    const readUser = await prisma.user.findUnique({
      where: { id: userId1 },
    });
    record('User CRUD', 'Read User', Boolean(readUser && readUser.email === 'test_user1@example.com'));

    const updatedUser = await prisma.user.update({
      where: { id: userId1 },
      data: { name: 'Test Customer Updated', role: 'ADMIN' },
    });
    record('User CRUD', 'Update User (name & role)', Boolean(updatedUser.name === 'Test Customer Updated' && updatedUser.role === 'ADMIN'));

    // Unique email enforcement
    let uniqueConstraintCaught = false;
    try {
      await prisma.user.create({
        data: {
          email: 'test_user1@example.com',
          name: 'Duplicate Email User',
        },
      });
    } catch (e: any) {
      uniqueConstraintCaught = e.code === 'P2002';
    }
    record('User CRUD', 'Unique Email Constraint Violation', uniqueConstraintCaught);
  } catch (err: any) {
    record('User CRUD', 'User CRUD Suite Failure', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 2: Category CRUD
  // -------------------------------------------------------------
  let categoryId1 = '';
  try {
    const createdCat = await prisma.category.create({
      data: {
        name: 'Test Bouquets',
        slug: 'test-bouquets',
        description: 'Handcrafted floral bouquets for tests',
        sortOrder: 1,
        isActive: true,
      },
    });
    categoryId1 = createdCat.id;
    record('Category CRUD', 'Create Category', Boolean(createdCat.id && createdCat.slug === 'test-bouquets'));

    const readCat = await prisma.category.findUnique({
      where: { slug: 'test-bouquets' },
    });
    record('Category CRUD', 'Read Category by Slug', Boolean(readCat && readCat.name === 'Test Bouquets'));

    const updatedCat = await prisma.category.update({
      where: { id: categoryId1 },
      data: { name: 'Test Bouquets Updated', sortOrder: 5 },
    });
    record('Category CRUD', 'Update Category', Boolean(updatedCat.sortOrder === 5));

    // Unique slug enforcement
    let duplicateSlugCaught = false;
    try {
      await prisma.category.create({
        data: {
          name: 'Another Cat',
          slug: 'test-bouquets',
        },
      });
    } catch (e: any) {
      duplicateSlugCaught = e.code === 'P2002';
    }
    record('Category CRUD', 'Unique Category Slug Constraint', duplicateSlugCaught);
  } catch (err: any) {
    record('Category CRUD', 'Category CRUD Suite Failure', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 3: Product & ProductVariant CRUD
  // -------------------------------------------------------------
  let productId1 = '';
  let variantId1 = '';
  try {
    const createdProduct = await prisma.product.create({
      data: {
        name: 'TEST_Crochet Rose Bouquet',
        slug: 'test-crochet-rose-bouquet',
        description: 'Everlasting handmade yarn roses',
        details: '100% milk cotton yarn. Height: 30cm.',
        categoryId: categoryId1,
        price: 149900, // ₹1,499.00 in paise
        compareAtPrice: 199900, // ₹1,999.00 in paise
        stockQuantity: 25,
        isActive: true,
        isFeatured: true,
        tags: 'rose,bouquet,handcrafted,pink',
        images: JSON.stringify(['/images/products/rose-1.webp', '/images/products/rose-2.webp']),
      },
    });
    productId1 = createdProduct.id;
    record('Product CRUD', 'Create Product with Paise Pricing', Boolean(createdProduct.id && createdProduct.price === 149900));

    // Read Product with relations
    const readProduct = await prisma.product.findUnique({
      where: { id: productId1 },
      include: { category: true },
    });
    record('Product CRUD', 'Read Product with Category Relation', Boolean(readProduct && readProduct.category.slug === 'test-bouquets'));

    // Update Product
    const updatedProduct = await prisma.product.update({
      where: { id: productId1 },
      data: { price: 159900, stockQuantity: 20 },
    });
    record('Product CRUD', 'Update Product Price and Stock', Boolean(updatedProduct.price === 159900 && updatedProduct.stockQuantity === 20));

    // Unique slug enforcement
    let duplicateProductSlugCaught = false;
    try {
      await prisma.product.create({
        data: {
          name: 'Duplicate Product',
          slug: 'test-crochet-rose-bouquet',
          description: 'desc',
          categoryId: categoryId1,
          price: 99900,
          images: '[]',
        },
      });
    } catch (e: any) {
      duplicateProductSlugCaught = e.code === 'P2002';
    }
    record('Product CRUD', 'Unique Product Slug Constraint', duplicateProductSlugCaught);

    // Foreign Key constraint: non-existent categoryId
    let invalidCategoryCaught = false;
    try {
      await prisma.product.create({
        data: {
          name: 'Invalid Cat Product',
          slug: 'test-invalid-cat-prod',
          description: 'desc',
          categoryId: 'non-existent-category-cuid-999',
          price: 99900,
          images: '[]',
        },
      });
    } catch (e: any) {
      invalidCategoryCaught = e.code === 'P2003';
    }
    record('Product CRUD', 'Invalid CategoryId FK Rejection', invalidCategoryCaught);

    // Create Product Variant
    const createdVariant = await prisma.productVariant.create({
      data: {
        productId: productId1,
        name: 'TEST_Blush Pink',
        sku: 'TEST-ROSE-PINK',
        priceAdjustment: 0,
        stockQuantity: 15,
      },
    });
    variantId1 = createdVariant.id;
    record('ProductVariant CRUD', 'Create Product Variant', Boolean(createdVariant.id && createdVariant.productId === productId1));

    // Read Variant
    const readVariant = await prisma.productVariant.findUnique({
      where: { id: variantId1 },
      include: { product: true },
    });
    record('ProductVariant CRUD', 'Read Variant with Product Relation', Boolean(readVariant && readVariant.product.id === productId1));

    // Update Variant
    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId1 },
      data: { priceAdjustment: 10000, stockQuantity: 12 }, // +₹100
    });
    record('ProductVariant CRUD', 'Update Variant Price Adjustment', Boolean(updatedVariant.priceAdjustment === 10000));
  } catch (err: any) {
    record('Product CRUD', 'Product CRUD Suite Failure', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 4: Order & OrderItem CRUD
  // -------------------------------------------------------------
  let orderId1 = '';
  let orderItemId1 = '';
  try {
    const createdOrder = await prisma.order.create({
      data: {
        orderNumber: 'TEST-ORD-2026-0001',
        userId: userId1,
        customerName: 'Test Customer',
        customerEmail: 'test_user1@example.com',
        customerPhone: '9876543210',
        shippingAddressLine1: 'Flat 402, Lotus Bloom Apartments',
        shippingAddressLine2: 'Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        deliveryInstructions: 'Leave with security guard',
        subtotal: 159900,
        shippingFee: 0,
        taxAmount: 0,
        totalAmount: 159900,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING_COD',
        items: {
          create: [
            {
              productId: productId1,
              variantId: variantId1,
              productName: 'TEST_Crochet Rose Bouquet',
              productSlug: 'test-crochet-rose-bouquet',
              variantName: 'TEST_Blush Pink',
              unitPrice: 159900,
              quantity: 1,
              lineSubtotal: 159900,
              personalizationText: 'Happy Birthday Mom! With love.',
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });
    orderId1 = createdOrder.id;
    orderItemId1 = createdOrder.items[0]?.id;
    record('Order CRUD', 'Create Order with Nested OrderItem Snapshot', Boolean(createdOrder.id && createdOrder.items.length === 1 && createdOrder.items[0].unitPrice === 159900));

    // Read Order with items and user
    const readOrder = await prisma.order.findUnique({
      where: { id: orderId1 },
      include: { items: true, user: true },
    });
    record('Order CRUD', 'Read Order with Items and User Relation', Boolean(readOrder && readOrder.user?.id === userId1 && readOrder.items[0].personalizationText?.includes('Happy Birthday')));

    // Update Order Status & Payment Status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId1 },
      data: {
        orderStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
        trackingNumber: 'TEST-BLUEDART-889900',
        trackingCourier: 'BlueDart',
      },
    });
    record('Order CRUD', 'Update Order Status & Tracking', Boolean(updatedOrder.orderStatus === 'CONFIRMED' && updatedOrder.paymentStatus === 'PAID'));

    // Unique orderNumber constraint
    let duplicateOrderNumberCaught = false;
    try {
      await prisma.order.create({
        data: {
          orderNumber: 'TEST-ORD-2026-0001',
          customerName: 'Duplicate Order',
          customerEmail: 'dup@example.com',
          customerPhone: '9999999999',
          shippingAddressLine1: 'Line 1',
          city: 'City',
          state: 'State',
          pincode: '123456',
          subtotal: 50000,
          totalAmount: 50000,
        },
      });
    } catch (e: any) {
      duplicateOrderNumberCaught = e.code === 'P2002';
    }
    record('Order CRUD', 'Unique orderNumber Constraint', duplicateOrderNumberCaught);

    // Guest checkout order (userId = null)
    const guestOrder = await prisma.order.create({
      data: {
        orderNumber: 'TEST-ORD-2026-GUEST1',
        userId: null,
        customerName: 'Guest Shopper',
        customerEmail: 'test_guest@example.com',
        customerPhone: '9123456789',
        shippingAddressLine1: '123 Guest Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        subtotal: 99900,
        shippingFee: 9900,
        totalAmount: 109800,
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
      },
    });
    record('Order CRUD', 'Create Guest Order without User Account', Boolean(guestOrder.id && guestOrder.userId === null));
  } catch (err: any) {
    record('Order CRUD', 'Order CRUD Suite Failure', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 5: Wishlist, Address, Subscriber, ContactInquiry
  // -------------------------------------------------------------
  let addressId1 = '';
  let wishlistId1 = '';
  try {
    // Address
    const address = await prisma.address.create({
      data: {
        userId: userId1,
        fullName: 'TEST_Customer Default Address',
        phone: '9876543210',
        addressLine1: '402 Lotus Bloom',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        isDefault: true,
      },
    });
    addressId1 = address.id;
    record('Address & Wishlist', 'Create User Address', Boolean(address.id && address.userId === userId1));

    // WishlistItem
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: userId1,
        productId: productId1,
      },
    });
    wishlistId1 = wishlistItem.id;
    record('Address & Wishlist', 'Create WishlistItem Relation', Boolean(wishlistItem.id && wishlistItem.userId === userId1));

    // Duplicate Wishlist Item compound unique check
    let duplicateWishlistCaught = false;
    try {
      await prisma.wishlistItem.create({
        data: {
          userId: userId1,
          productId: productId1,
        },
      });
    } catch (e: any) {
      duplicateWishlistCaught = e.code === 'P2002';
    }
    record('Address & Wishlist', 'Compound Unique Wishlist [userId, productId]', duplicateWishlistCaught);

    // Subscriber
    const sub = await prisma.subscriber.create({
      data: { email: 'test_sub1@example.com', source: 'homepage' },
    });
    record('Engagement', 'Create Subscriber', Boolean(sub.id));

    let dupSubCaught = false;
    try {
      await prisma.subscriber.create({
        data: { email: 'test_sub1@example.com', source: 'footer' },
      });
    } catch (e: any) {
      dupSubCaught = e.code === 'P2002';
    }
    record('Engagement', 'Unique Subscriber Email', dupSubCaught);

    // Contact Inquiry
    const inq = await prisma.contactInquiry.create({
      data: {
        name: 'Test Inquirer',
        email: 'test_inq1@example.com',
        phone: '9888877777',
        subject: 'Custom Bouquet Inquiry',
        message: 'Do you take orders for 100 crochet daisies?',
        status: 'NEW',
      },
    });
    record('Engagement', 'Create Contact Inquiry', Boolean(inq.id && inq.status === 'NEW'));

    const updatedInq = await prisma.contactInquiry.update({
      where: { id: inq.id },
      data: { status: 'RESOLVED' },
    });
    record('Engagement', 'Update Contact Inquiry Status', Boolean(updatedInq.status === 'RESOLVED'));
  } catch (err: any) {
    record('Address & Wishlist', 'Address/Wishlist Suite Failure', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 6: RELATIONAL FOREIGN KEYS & CASCADE RULES
  // -------------------------------------------------------------
  console.log('\n--- Testing Cascade & Foreign Key Rules ---');

  // Cascade Rule 1: Category deletion with existing Product
  // Expected: Should be RESTRICTED (prevented) by default since category has products attached
  try {
    let catDeleteFailedAsExpected = false;
    try {
      await prisma.category.delete({
        where: { id: categoryId1 },
      });
    } catch (e: any) {
      // P2003 or P2014: Foreign key constraint violation on relation
      catDeleteFailedAsExpected = e.code === 'P2003' || e.code === 'P2014';
    }
    record('Cascade & FK Rules', 'Prevent Category Deletion when Products Exist (Restrict)', catDeleteFailedAsExpected);
  } catch (err: any) {
    record('Cascade & FK Rules', 'Category Restrict Test Failure', false, err.message);
  }

  // Cascade Rule 2: Product deletion -> Cascade to ProductVariant & WishlistItem, SetNull on OrderItem
  try {
    // Check variant & wishlist exist before
    const variantBefore = await prisma.productVariant.findUnique({ where: { id: variantId1 } });
    const wishlistBefore = await prisma.wishlistItem.findUnique({ where: { id: wishlistId1 } });
    const orderItemBefore = await prisma.orderItem.findUnique({ where: { id: orderItemId1 } });

    // Delete product
    await prisma.product.delete({
      where: { id: productId1 },
    });

    // Check variant is cascade-deleted
    const variantAfter = await prisma.productVariant.findUnique({ where: { id: variantId1 } });
    record('Cascade & FK Rules', 'Product Delete cascades to ProductVariant', variantBefore !== null && variantAfter === null);

    // Check wishlist is cascade-deleted
    const wishlistAfter = await prisma.wishlistItem.findUnique({ where: { id: wishlistId1 } });
    record('Cascade & FK Rules', 'Product Delete cascades to WishlistItem', wishlistBefore !== null && wishlistAfter === null);

    // Check orderItem has productId SET NULL (retaining historical line item & price snapshot)
    const orderItemAfter = await prisma.orderItem.findUnique({ where: { id: orderItemId1 } });
    record(
      'Cascade & FK Rules',
      'Product Delete sets OrderItem productId to NULL (historical snapshot retained)',
      Boolean(orderItemAfter !== null && orderItemAfter.productId === null && orderItemAfter.unitPrice === 159900 && orderItemAfter.productName === 'TEST_Crochet Rose Bouquet')
    );
  } catch (err: any) {
    record('Cascade & FK Rules', 'Product Cascade Test Failure', false, err.message);
  }

  // Now that products for categoryId1 are deleted, category delete should succeed
  try {
    await prisma.category.delete({
      where: { id: categoryId1 },
    });
    const catAfter = await prisma.category.findUnique({ where: { id: categoryId1 } });
    record('Cascade & FK Rules', 'Category Delete succeeds when no products reference it', catAfter === null);
  } catch (err: any) {
    record('Cascade & FK Rules', 'Category Delete empty failed', false, err.message);
  }

  // Cascade Rule 3: User deletion -> Cascade to Address, SetNull on Order
  try {
    // Check address and order before user deletion
    const addressBefore = await prisma.address.findUnique({ where: { id: addressId1 } });
    const orderBefore = await prisma.order.findUnique({ where: { id: orderId1 } });

    // Delete user
    await prisma.user.delete({
      where: { id: userId1 },
    });

    // Address should be cascade-deleted
    const addressAfter = await prisma.address.findUnique({ where: { id: addressId1 } });
    record('Cascade & FK Rules', 'User Delete cascades to Address', addressBefore !== null && addressAfter === null);

    // Order should NOT be deleted, but userId should be SET NULL
    const orderAfter = await prisma.order.findUnique({ where: { id: orderId1 } });
    record(
      'Cascade & FK Rules',
      'User Delete sets Order userId to NULL (order preserved for fulfillment)',
      Boolean(orderAfter !== null && orderAfter.userId === null && orderAfter.customerEmail === 'test_user1@example.com')
    );
  } catch (err: any) {
    record('Cascade & FK Rules', 'User Cascade Test Failure', false, err.message);
  }

  // Cascade Rule 4: Order deletion -> Cascade to OrderItem
  try {
    // Order still exists from above
    await prisma.order.delete({
      where: { id: orderId1 },
    });

    // Check orderItem is deleted
    const orderItemAfterOrderDelete = await prisma.orderItem.findUnique({ where: { id: orderItemId1 } });
    record('Cascade & FK Rules', 'Order Delete cascades to OrderItem', orderItemAfterOrderDelete === null);
  } catch (err: any) {
    record('Cascade & FK Rules', 'Order Cascade Test Failure', false, err.message);
  }

  // Clean up remaining guest order and subscribers
  await prisma.order.deleteMany({ where: { orderNumber: { startsWith: 'TEST-ORD-' } } });
  await prisma.subscriber.deleteMany({ where: { email: { startsWith: 'test_' } } });
  await prisma.contactInquiry.deleteMany({ where: { email: { startsWith: 'test_' } } });

  console.log('\n=== EMPIRICAL TEST SUMMARY ===');
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = total - passedCount;

  console.log(`Total tests: ${total}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);

  if (failedCount > 0) {
    console.error('\nFAILED TESTS:');
    results.filter((r) => !r.passed).forEach((r) => console.error(`- [${r.suite}] ${r.test}: ${r.error}`));
    process.exit(1);
  } else {
    console.log('\nALL EMPIRICAL TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
