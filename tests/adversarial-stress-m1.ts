import prisma from '../src/lib/prisma';

interface StressResult {
  dimension: string;
  scenario: string;
  expected: string;
  actual: string;
  passed: boolean;
  notes?: string;
}

const stressResults: StressResult[] = [];

function recordStress(
  dimension: string,
  scenario: string,
  expected: string,
  actual: string,
  passed: boolean,
  notes?: string
) {
  stressResults.push({ dimension, scenario, expected, actual, passed, notes });
  const status = passed ? 'PASS' : 'WARN/FAIL';
  console.log(`[${status}] [${dimension}] ${scenario}`);
  console.log(`  Expected: ${expected}`);
  console.log(`  Actual:   ${actual}`);
  if (notes) console.log(`  Notes:    ${notes}`);
}

async function runAdversarialSuite() {
  console.log('=== STARTING ADVERSARIAL STRESS TEST HARNESS ===\n');

  // Clean slate for stress testing
  await prisma.account.deleteMany({ where: { provider: 'test-oauth' } });
  await prisma.session.deleteMany({ where: { sessionToken: { startsWith: 'test-session-' } } });
  await prisma.orderItem.deleteMany({ where: { productName: { startsWith: 'STRESS_' } } });
  await prisma.order.deleteMany({ where: { orderNumber: { startsWith: 'STRESS-ORD-' } } });
  await prisma.productVariant.deleteMany({ where: { name: { startsWith: 'STRESS_' } } });
  await prisma.product.deleteMany({ where: { slug: { startsWith: 'stress-' } } });
  await prisma.category.deleteMany({ where: { slug: { startsWith: 'stress-' } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: 'stress_' } } });

  // -------------------------------------------------------------
  // DIMENSION 1: NextAuth Relation & Cascade Stress
  // -------------------------------------------------------------
  try {
    const user = await prisma.user.create({
      data: {
        email: 'stress_oauth_user@example.com',
        name: 'OAuth User',
      },
    });

    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider: 'test-oauth',
        providerAccountId: 'google-oauth2|1234567890',
        access_token: 'dummy_access_token_xyz',
        id_token: 'dummy_id_token_jwt_stress_testing_large_string_'.repeat(10),
      },
    });

    const session = await prisma.session.create({
      data: {
        sessionToken: 'test-session-token-uuid-1234',
        userId: user.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Delete user -> verify Account & Session cascade
    await prisma.user.delete({ where: { id: user.id } });

    const accountAfter = await prisma.account.findUnique({ where: { id: account.id } });
    const sessionAfter = await prisma.session.findUnique({ where: { id: session.id } });

    recordStress(
      'NextAuth Relations',
      'User deletion cascades to Account and Session tables',
      'Both Account and Session deleted',
      accountAfter === null && sessionAfter === null ? 'Both deleted' : 'Orphan records remain',
      accountAfter === null && sessionAfter === null
    );
  } catch (err: any) {
    recordStress('NextAuth Relations', 'User deletion cascades', 'Success', err.message, false);
  }

  // -------------------------------------------------------------
  // DIMENSION 2: Variant Deletion & OrderItem SetNull
  // -------------------------------------------------------------
  try {
    const cat = await prisma.category.create({
      data: { name: 'STRESS_Cat', slug: 'stress-cat-variant-test' },
    });
    const prod = await prisma.product.create({
      data: {
        name: 'STRESS_Product',
        slug: 'stress-prod-variant-test',
        description: 'desc',
        categoryId: cat.id,
        price: 99900,
        images: '[]',
      },
    });
    const variant = await prisma.productVariant.create({
      data: {
        name: 'STRESS_Variant_A',
        productId: prod.id,
        priceAdjustment: 20000,
      },
    });
    const order = await prisma.order.create({
      data: {
        orderNumber: 'STRESS-ORD-VAR-1',
        customerName: 'Var Tester',
        customerEmail: 'stress_var@example.com',
        customerPhone: '9000000000',
        shippingAddressLine1: 'Road 1',
        city: 'City',
        state: 'State',
        pincode: '123456',
        subtotal: 119900,
        totalAmount: 119900,
        items: {
          create: [
            {
              productId: prod.id,
              variantId: variant.id,
              productName: 'STRESS_Product',
              productSlug: 'stress-prod-variant-test',
              variantName: 'STRESS_Variant_A',
              unitPrice: 119900,
              quantity: 1,
              lineSubtotal: 119900,
            },
          ],
        },
      },
      include: { items: true },
    });

    const orderItemId = order.items[0].id;

    // Delete variant -> OrderItem.variantId must become null, product & order intact
    await prisma.productVariant.delete({ where: { id: variant.id } });
    const orderItemAfterVariantDelete = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });

    recordStress(
      'Foreign Key Cascades',
      'ProductVariant deletion sets OrderItem variantId to NULL',
      'OrderItem exists with variantId = null',
      orderItemAfterVariantDelete?.variantId === null ? 'variantId is NULL' : `variantId is ${orderItemAfterVariantDelete?.variantId}`,
      Boolean(orderItemAfterVariantDelete && orderItemAfterVariantDelete.variantId === null)
    );

    // Clean up
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.product.delete({ where: { id: prod.id } });
    await prisma.category.delete({ where: { id: cat.id } });
  } catch (err: any) {
    recordStress('Foreign Key Cascades', 'ProductVariant deletion SetNull', 'Success', err.message, false);
  }

  // -------------------------------------------------------------
  // DIMENSION 3: Large Payloads and Text Boundaries
  // -------------------------------------------------------------
  try {
    const cat = await prisma.category.create({
      data: {
        name: 'STRESS_LargePayloads',
        slug: 'stress-cat-large-payloads',
        description: 'Large description text '.repeat(200), // ~4KB
      },
    });

    // 100 images JSON array string
    const largeImagesJson = JSON.stringify(
      Array.from({ length: 100 }, (_, i) => `/images/products/photo_${i}_${'x'.repeat(50)}.webp`)
    );

    const prod = await prisma.product.create({
      data: {
        name: 'STRESS_Large_Product',
        slug: 'stress-prod-large-payload',
        description: 'Detailed description paragraph.\n'.repeat(100),
        details: 'Extra details bullet points.\n'.repeat(50),
        categoryId: cat.id,
        price: 299900,
        images: largeImagesJson,
      },
    });

    const readProd = await prisma.product.findUnique({ where: { id: prod.id } });
    const parsedImages = JSON.parse(readProd?.images || '[]');

    recordStress(
      'Data Boundaries',
      'Store and parse large JSON array (100 URLs) in Product.images @db.Text',
      '100 image items parsed accurately',
      `${parsedImages.length} image items parsed`,
      parsedImages.length === 100
    );

    // OrderItem with 5000-char personalization message
    const longPersonalization = 'Happy 50th Anniversary! '.repeat(200); // 4800 chars
    const order = await prisma.order.create({
      data: {
        orderNumber: 'STRESS-ORD-MSG-1',
        customerName: 'Long Message Customer',
        customerEmail: 'stress_msg@example.com',
        customerPhone: '9000000000',
        shippingAddressLine1: 'Address 1',
        city: 'City',
        state: 'State',
        pincode: '123456',
        subtotal: 299900,
        totalAmount: 299900,
        items: {
          create: [
            {
              productName: 'STRESS_Large_Product',
              productSlug: 'stress-prod-large-payload',
              unitPrice: 299900,
              quantity: 1,
              lineSubtotal: 299900,
              personalizationText: longPersonalization,
            },
          ],
        },
      },
      include: { items: true },
    });

    recordStress(
      'Data Boundaries',
      'Store 4800-char personalizationText in OrderItem @db.Text',
      'Preserved verbatim with exact length 4800',
      `Preserved length ${order.items[0].personalizationText?.length}`,
      order.items[0].personalizationText?.length === 4800
    );

    // Clean up
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.product.delete({ where: { id: prod.id } });
    await prisma.category.delete({ where: { id: cat.id } });
  } catch (err: any) {
    recordStress('Data Boundaries', 'Large payload handling', 'Success', err.message, false);
  }

  // -------------------------------------------------------------
  // DIMENSION 4: Integer Range & Boundary Values in Paise
  // -------------------------------------------------------------
  try {
    const cat = await prisma.category.create({
      data: { name: 'STRESS_Numbers', slug: 'stress-cat-numbers' },
    });

    // Zero price product (e.g., gift promotion)
    const zeroPriceProd = await prisma.product.create({
      data: {
        name: 'STRESS_Free_Product',
        slug: 'stress-prod-zero-price',
        description: 'Free sample promo',
        categoryId: cat.id,
        price: 0,
        stockQuantity: 0, // out of stock
        images: '[]',
      },
    });
    recordStress(
      'Arithmetic & Integer Boundaries',
      'Zero paise price and zero stock quantity',
      'Product created with price=0, stock=0',
      `price=${zeroPriceProd.price}, stock=${zeroPriceProd.stockQuantity}`,
      zeroPriceProd.price === 0 && zeroPriceProd.stockQuantity === 0
    );

    // High value integer (e.g. ₹5,00,000.00 = 50,000,000 paise)
    const highPriceProd = await prisma.product.create({
      data: {
        name: 'STRESS_Luxury_Installation',
        slug: 'stress-prod-high-price',
        description: 'Large commercial crochet floral installation',
        categoryId: cat.id,
        price: 50000000, // 50 million paise = ₹5,00,000
        compareAtPrice: 60000000,
        images: '[]',
      },
    });
    recordStress(
      'Arithmetic & Integer Boundaries',
      'High paise price within 32-bit signed INT (50,000,000 paise)',
      'Product created with price=50000000',
      `price=${highPriceProd.price}`,
      highPriceProd.price === 50000000
    );

    // Clean up
    await prisma.product.deleteMany({ where: { categoryId: cat.id } });
    await prisma.category.delete({ where: { id: cat.id } });
  } catch (err: any) {
    recordStress('Arithmetic & Integer Boundaries', 'Price boundary testing', 'Success', err.message, false);
  }

  // -------------------------------------------------------------
  // DIMENSION 5: Concurrency and Race Condition on Unique Keys
  // -------------------------------------------------------------
  try {
    console.log('\nTesting concurrent writes on unique constraints...');
    const duplicateEmail = 'stress_concurrent@example.com';

    // Fire 5 simultaneous user creations with identical email
    const promises = Array.from({ length: 5 }, (_, i) =>
      prisma.user
        .create({
          data: {
            email: duplicateEmail,
            name: `User Concurrent ${i}`,
          },
        })
        .then(() => ({ success: true, error: null }))
        .catch((e) => ({ success: false, error: e.code }))
    );

    const outcomes = await Promise.all(promises);
    const successes = outcomes.filter((o) => o.success).length;
    const p2002Failures = outcomes.filter((o) => o.error === 'P2002').length;

    recordStress(
      'Concurrency & Race Conditions',
      '5 concurrent user creation requests with identical email',
      'Exactly 1 success, exactly 4 P2002 unique constraint violations',
      `Successes: ${successes}, P2002 errors: ${p2002Failures}`,
      successes === 1 && p2002Failures === 4
    );

    // Clean up
    await prisma.user.deleteMany({ where: { email: duplicateEmail } });
  } catch (err: any) {
    recordStress('Concurrency & Race Conditions', 'Concurrent user creation', 'Success', err.message, false);
  }

  // -------------------------------------------------------------
  // DIMENSION 6: Invalid Enum Value Rejection
  // -------------------------------------------------------------
  try {
    let enumRejected = false;
    try {
      await prisma.user.create({
        data: {
          email: 'stress_invalid_role@example.com',
          name: 'Invalid Role User',
          role: 'SUPERADMIN_INVALID' as any,
        },
      });
    } catch (e: any) {
      // Prisma validates enums before/during query execution
      enumRejected = true;
    }
    recordStress(
      'Type & Enum Validation',
      'Runtime rejection of invalid enum value for Role',
      'Rejected by Prisma client/MySQL schema',
      enumRejected ? 'Rejected cleanly' : 'Unexpectedly allowed',
      enumRejected
    );
  } catch (err: any) {
    recordStress('Type & Enum Validation', 'Enum rejection', 'Success', err.message, false);
  }

  console.log('\n=== ADVERSARIAL STRESS TEST SUMMARY ===');
  const total = stressResults.length;
  const passedCount = stressResults.filter((r) => r.passed).length;
  const failedCount = total - passedCount;

  console.log(`Total Stress Scenarios: ${total}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed/Warn: ${failedCount}`);

  if (failedCount > 0) {
    console.error('\nFAILED SCENARIOS:');
    stressResults.filter((r) => !r.passed).forEach((r) => console.error(`- [${r.dimension}] ${r.scenario}: ${r.actual}`));
    process.exit(1);
  } else {
    console.log('\nALL ADVERSARIAL STRESS TESTS PASSED!');
    process.exit(0);
  }
}

runAdversarialSuite().catch((e) => {
  console.error('Fatal stress error:', e);
  process.exit(1);
});
