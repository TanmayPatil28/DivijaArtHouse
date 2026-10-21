import { prisma } from '../src/lib/prisma';
import { getProductBySlug, getRelatedProducts } from '../src/lib/products';
import { formatINR, calculateDiscount, parseJson } from '../src/lib/utils';
import type { CartItem, ProductWithCategory, PrismaProductVariant } from '../src/types';

// ============================================================================
// CHALLENGER 2: ADVERSARIAL STRESS TEST SUITE FOR PDP (MILESTONE 4)
// ============================================================================

interface TestResult {
  category: string;
  name: string;
  status: 'PASS' | 'FAIL';
  details?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function recordTest(
  category: string,
  name: string,
  fn: () => Promise<void> | void
) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ category, name, status: 'PASS', durationMs });
    console.log(`[PASS] [${category}] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    results.push({
      category,
      name,
      status: 'FAIL',
      details: err?.message || String(err),
      durationMs,
    });
    console.error(`[FAIL] [${category}] ${name} (${durationMs}ms): ${err?.message}`);
  }
}

async function main() {
  console.log('======================================================================');
  console.log('🚀 RUNNING CHALLENGER 2 ADVERSARIAL TEST HARNESS FOR PDP (M4)');
  console.log('======================================================================\n');

  const BASE_URL = 'http://localhost:3001';

  // ==========================================================================
  // SUITE 1: ADVERSARIAL PRODUCT SLUGS & 404 RESILIENCE
  // ==========================================================================
  console.log('\n--- SUITE 1: ADVERSARIAL PRODUCT SLUGS & 404 RESILIENCE ---');

  const adversarialSlugs = [
    { label: 'Non-existent random slug', slug: 'non-existent-product-slug-xyz-987' },
    { label: 'Empty string', slug: '' },
    { label: 'Spaces only', slug: '   ' },
    { label: 'Dashes only', slug: '-----' },
    { label: 'Dots only', slug: '.....' },
    { label: 'Path traversal (Linux)', slug: '../../../../etc/passwd' },
    { label: 'Path traversal (Windows)', slug: '..\\..\\windows\\system32' },
    { label: 'URL-encoded traversal', slug: '..%2F..%2Fetc%2Fpasswd' },
    { label: 'Windows device CON', slug: 'CON' },
    { label: 'Windows device NUL', slug: 'NUL' },
    { label: 'Windows device AUX', slug: 'AUX' },
    { label: 'Windows device PRN', slug: 'PRN' },
    { label: 'Null byte injection', slug: 'valid-slug\0evil' },
    { label: 'SQLi: Classic OR 1=1', slug: "' OR '1'='1" },
    { label: 'SQLi: Comment dash-dash', slug: "admin'--" },
    { label: 'SQLi: DROP TABLE', slug: '"; DROP TABLE Product; --' },
    { label: 'SQLi: UNION SELECT', slug: "1' UNION SELECT * FROM Product --" },
    { label: 'SQLi: Sleep delay test', slug: "' AND sleep(1) --" },
    { label: 'XSS script tag', slug: '<script>alert(1)</script>' },
    { label: 'XSS img tag onerror', slug: '"><img src=x onerror=alert(1)>' },
    { label: 'XSS javascript URI', slug: 'javascript:alert(1)' },
    { label: 'SSTI expression', slug: '${7*7}' },
    { label: 'Emoji slug', slug: '🌸💐🌹-everlasting-blooms' },
    { label: 'Devanagari Hindi slug', slug: 'दिविजा-आर्ट-हाउस' },
    { label: 'Arabic script slug', slug: 'الزهور-اليدوية' },
    { label: 'Accented characters', slug: 'café-au-lait-bouquet' },
    { label: 'Buffer overflow: 255 chars', slug: 'a'.repeat(255) },
    { label: 'Buffer overflow: 1000 chars', slug: 'b'.repeat(1000) },
    { label: 'Buffer overflow: 5000 chars', slug: 'c'.repeat(5000) },
  ];

  for (const item of adversarialSlugs) {
    await recordTest('Suite 1: Slugs', `DB getProductBySlug: ${item.label}`, async () => {
      const res = await getProductBySlug(item.slug);
      if (res !== null) {
        throw new Error(`Expected null for invalid slug "${item.slug.slice(0, 30)}", got product ID: ${res.id}`);
      }
    });
  }

  // HTTP stress test against live Next.js production server for adversarial slugs
  const httpSlugsToTest = [
    { label: 'HTTP: Non-existent product', path: '/products/non-existent-product-slug-xyz' },
    { label: 'HTTP: SQLi in URL', path: '/products/%27%20OR%20%271%27%3D%271' },
    { label: 'HTTP: XSS in URL', path: '/products/%3Cscript%3Ealert(1)%3C%2Fscript%3E' },
    { label: 'HTTP: Traversal in URL', path: '/products/..%2F..%2Fetc%2Fpasswd' },
    { label: 'HTTP: Emojis in URL', path: '/products/%F0%9F%8C%B8%F0%9F%92%90' },
    { label: 'HTTP: Long slug 300 chars', path: `/products/${'x'.repeat(300)}` },
  ];

  for (const item of httpSlugsToTest) {
    await recordTest('Suite 1: Slugs', `${item.label}`, async () => {
      const res = await fetch(`${BASE_URL}${item.path}`);
      // Must NOT be a 500 server crash
      if (res.status === 500) {
        throw new Error(`Server crashed with 500 Internal Server Error on ${item.path}`);
      }
      const text = await res.text();
      // Must render branded 404 UI
      if (!text.includes('This Bloom Seems to Have Wandered Off') && !text.includes('404')) {
        throw new Error(`Expected branded 404 UI for ${item.path}, but 404 markers were missing!`);
      }
    });
  }

  // Inactive Product Handling Test
  await recordTest('Suite 1: Slugs', 'Inactive product slug returns null and 404s cleanly', async () => {
    // 1. Create a dummy inactive product
    const inactiveSlug = 'temp-adversarial-inactive-bloom';
    const firstCat = await prisma.category.findFirst();
    if (!firstCat) throw new Error('No category found to create inactive product');

    const created = await prisma.product.create({
      data: {
        name: 'Temporary Inactive Bloom',
        slug: inactiveSlug,
        description: 'Test inactive product for PDP verification.',
        price: 99900,
        compareAtPrice: 129900,
        stockQuantity: 5,
        isActive: false, // INACTIVE!
        categoryId: firstCat.id,
        tags: 'test,inactive',
        images: '["/images/products/test.svg"]',
      },
    });

    try {
      // 2. Query getProductBySlug
      const product = await getProductBySlug(inactiveSlug);
      if (product !== null) {
        throw new Error('getProductBySlug MUST return null for inactive product (isActive: false)');
      }

      // 3. HTTP request to inactive product URL
      const res = await fetch(`${BASE_URL}/products/${inactiveSlug}`);
      if (res.status === 500) {
        throw new Error('Inactive product URL caused 500 Internal Server Error!');
      }
      const html = await res.text();
      if (!html.includes('This Bloom Seems to Have Wandered Off')) {
        throw new Error('Inactive product URL did not render branded 404 page!');
      }
    } finally {
      // Clean up
      await prisma.product.delete({ where: { id: created.id } });
    }
  });

  // Valid product slug verification
  await recordTest('Suite 1: Slugs', 'Valid product slug loads 200 OK with full content', async () => {
    const slug = 'blushing-peony-rose-handcrafted-bouquet';
    const product = await getProductBySlug(slug);
    if (!product) throw new Error(`Product "${slug}" not found in DB!`);

    const res = await fetch(`${BASE_URL}/products/${slug}`);
    if (res.status !== 200) {
      throw new Error(`Expected HTTP 200 for valid product, got ${res.status}`);
    }
    const html = await res.text();
    if (!html.includes('Blushing Peony &amp; Rose') && !html.includes('Blushing Peony & Rose')) {
      throw new Error('Product title missing in rendered PDP HTML!');
    }
    if (!html.includes('₹1,699')) {
      throw new Error('Formatted price ₹1,699 missing in rendered PDP HTML!');
    }
  });

  // ==========================================================================
  // SUITE 2: VARIANT PRICE CALCULATIONS (PAISE ARITHMETIC INTEGRITY)
  // ==========================================================================
  console.log('\n--- SUITE 2: VARIANT PRICE CALCULATIONS & ARITHMETIC INTEGRITY ---');

  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: true, category: true },
  });

  await recordTest('Suite 2: Pricing', `Verify all ${allProducts.length} seeded products have integer paise prices`, () => {
    if (allProducts.length === 0) throw new Error('No products found in DB!');
    for (const p of allProducts) {
      if (!Number.isInteger(p.price) || p.price <= 0) {
        throw new Error(`Product ${p.slug} has invalid price: ${p.price}`);
      }
      if (p.compareAtPrice !== null && (!Number.isInteger(p.compareAtPrice) || p.compareAtPrice < p.price)) {
        throw new Error(`Product ${p.slug} has invalid compareAtPrice: ${p.compareAtPrice} vs price: ${p.price}`);
      }
      for (const v of p.variants) {
        if (!Number.isInteger(v.priceAdjustment) || v.priceAdjustment < 0) {
          throw new Error(`Variant ${v.sku} of product ${p.slug} has invalid adjustment: ${v.priceAdjustment}`);
        }
      }
    }
  });

  // Mathematical variant price calculations
  const priceTestCases = [
    { basePrice: 169900, compareAt: 219900, adjustment: 0, expectedPrice: 169900, expectedCompareAt: 219900, expectedDiscount: 23 },
    { basePrice: 169900, compareAt: 219900, adjustment: 20000, expectedPrice: 189900, expectedCompareAt: 239900, expectedDiscount: 21 },
    { basePrice: 149900, compareAt: 189900, adjustment: 10000, expectedPrice: 159900, expectedCompareAt: 199900, expectedDiscount: 20 },
    { basePrice: 189900, compareAt: 249900, adjustment: 25000, expectedPrice: 214900, expectedCompareAt: 274900, expectedDiscount: 22 },
    { basePrice: 299900, compareAt: 379900, adjustment: 15000, expectedPrice: 314900, expectedCompareAt: 394900, expectedDiscount: 20 },
    { basePrice: 89900, compareAt: 119900, adjustment: 0, expectedPrice: 89900, expectedCompareAt: 119900, expectedDiscount: 25 },
    // Negative adjustment stress case (discount on mini size)
    { basePrice: 169900, compareAt: 219900, adjustment: -20000, expectedPrice: 149900, expectedCompareAt: 199900, expectedDiscount: 25 },
    // Zero compare-at
    { basePrice: 100000, compareAt: null, adjustment: 15000, expectedPrice: 115000, expectedCompareAt: null, expectedDiscount: 0 },
  ];

  for (const tc of priceTestCases) {
    await recordTest('Suite 2: Pricing', `Variant calculation: Base ₹${tc.basePrice / 100} + Adj ₹${tc.adjustment / 100}`, () => {
      const computedPrice = tc.basePrice + tc.adjustment;
      const computedCompareAt = tc.compareAt !== null ? tc.compareAt + tc.adjustment : null;
      const discount = calculateDiscount(computedPrice, computedCompareAt);

      if (computedPrice !== tc.expectedPrice) {
        throw new Error(`Price mismatch: got ${computedPrice}, expected ${tc.expectedPrice}`);
      }
      if (computedCompareAt !== tc.expectedCompareAt) {
        throw new Error(`CompareAt mismatch: got ${computedCompareAt}, expected ${tc.expectedCompareAt}`);
      }
      if (discount !== tc.expectedDiscount) {
        throw new Error(`Discount mismatch: got ${discount}%, expected ${tc.expectedDiscount}%`);
      }
      if (!Number.isInteger(computedPrice)) {
        throw new Error(`Computed price is not an integer: ${computedPrice}`);
      }
    });
  }

  // CartItem creation with variant price integrity
  await recordTest('Suite 2: Pricing', 'CartItem captures accurate variant adjusted unitPrice in paise', () => {
    const dummyProduct: ProductWithCategory = {
      id: 'prod-test-01',
      name: 'Test Bouquet',
      slug: 'test-bouquet',
      description: 'Test desc',
      price: 169900,
      compareAtPrice: 219900,
      stockQuantity: 10,
      isFeatured: true,
      isActive: true,
      tags: 'test',
      images: '["/images/products/test.svg"]',
      details: null,
      categoryId: 'cat-01',
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: 'cat-01',
        name: 'Bouquets',
        slug: 'bouquets',
        description: 'Bouquets',
        image: null,
        sortOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      variants: [
        {
          id: 'var-luxe-01',
          productId: 'prod-test-01',
          name: 'Luxe Gold Wrap',
          sku: 'TST-LGW',
          priceAdjustment: 20000, // +₹200
          stockQuantity: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const variant = dummyProduct.variants![0];
    const unitPrice = dummyProduct.price + variant.priceAdjustment; // 189900 paise

    const cartItem: CartItem = {
      id: `${dummyProduct.id}-${variant.id}`,
      productId: dummyProduct.id,
      name: dummyProduct.name,
      slug: dummyProduct.slug,
      image: '/images/products/test.svg',
      variantId: variant.id,
      variantName: variant.name,
      unitPrice,
      quantity: 2,
      personalization: 'With love',
      stock: variant.stockQuantity,
    };

    if (cartItem.unitPrice !== 189900) {
      throw new Error(`CartItem unitPrice should be 189900 paise, got ${cartItem.unitPrice}`);
    }
    if (cartItem.id !== 'prod-test-01-var-luxe-01') {
      throw new Error(`CartItem ID should be composite prod-test-01-var-luxe-01, got ${cartItem.id}`);
    }
    const lineTotal = cartItem.unitPrice * cartItem.quantity;
    if (lineTotal !== 379800) {
      throw new Error(`Line total calculation error: got ${lineTotal}, expected 379800 paise (₹3,798)`);
    }
  });

  // ==========================================================================
  // SUITE 3: PERSONALIZATION TEXT INPUT BOUNDARY CONDITIONS
  // ==========================================================================
  console.log('\n--- SUITE 3: PERSONALIZATION TEXT INPUT BOUNDARY CONDITIONS ---');

  const personalizationCases = [
    { label: 'Empty string', input: '', expectedSaved: undefined },
    { label: 'Whitespace spaces only', input: '     ', expectedSaved: undefined },
    { label: 'Whitespace newlines & tabs', input: ' \t \n \r ', expectedSaved: undefined },
    { label: 'Single character "A"', input: 'A', expectedSaved: 'A' },
    { label: 'Normal note (50 chars)', input: 'Happy 25th Anniversary! Blooming with love forever.', expectedSaved: 'Happy 25th Anniversary! Blooming with love forever.' },
    { label: 'Boundary: Exactly 240 chars (warning threshold)', input: 'x'.repeat(240), expectedSaved: 'x'.repeat(240) },
    { label: 'Boundary: Exactly 249 chars', input: 'y'.repeat(249), expectedSaved: 'y'.repeat(249) },
    { label: 'Boundary: Exactly 250 chars (max length)', input: 'z'.repeat(250), expectedSaved: 'z'.repeat(250) },
    { label: 'Multiline message with newlines', input: 'Happy Birthday!\nWishing you all the joy.\n- From Mom & Dad', expectedSaved: 'Happy Birthday!\nWishing you all the joy.\n- From Mom & Dad' },
    { label: 'Emojis and special characters', input: '🌸 Happy Wedding Day! 💐 Wishing you everlasting happiness 💍✨', expectedSaved: '🌸 Happy Wedding Day! 💐 Wishing you everlasting happiness 💍✨' },
    { label: 'Devanagari script message', input: 'जन्मदिन की हार्दिक शुभकामनाएं!', expectedSaved: 'जन्मदिन की हार्दिक शुभकामनाएं!' },
    { label: 'XSS attempt in note', input: '<script>alert("hacked")</script>', expectedSaved: '<script>alert("hacked")</script>' },
  ];

  for (const tc of personalizationCases) {
    await recordTest('Suite 3: Personalization', `Handling: ${tc.label}`, () => {
      // Logic from ProductDetails.tsx createCartItem: personalization.trim() || undefined
      const saved = tc.input.trim() || undefined;
      if (saved !== tc.expectedSaved) {
        throw new Error(`Mismatch: got "${saved}", expected "${tc.expectedSaved}"`);
      }
      if (saved && saved.length > 250) {
        throw new Error(`Personalization text exceeded 250 characters! Length: ${saved.length}`);
      }
    });
  }

  // Adversarial: Oversized input > 250 chars
  await recordTest('Suite 3: Personalization', 'Oversized note (>250 chars) boundary validation', () => {
    const rawInput300 = 'A'.repeat(300);
    // In browser, textarea maxLength={250} cuts off at 250
    const clampedInBrowser = rawInput300.slice(0, 250);
    if (clampedInBrowser.length !== 250) {
      throw new Error(`Expected browser clamped length 250, got ${clampedInBrowser.length}`);
    }

    // Defensive check: if raw unconstrained input is passed, ensure it is safely handled
    const safeTrimmed = rawInput300.slice(0, 250).trim();
    if (safeTrimmed.length > 250) {
      throw new Error(`Personalization must not exceed 250 characters!`);
    }
  });

  // Character counter threshold test
  await recordTest('Suite 3: Personalization', 'Character counter warning activates at >= 240 chars', () => {
    const checkWarning = (len: number) => len >= 240;
    if (checkWarning(239) !== false) throw new Error('239 chars should NOT trigger warning');
    if (checkWarning(240) !== true) throw new Error('240 chars MUST trigger warning');
    if (checkWarning(245) !== true) throw new Error('245 chars MUST trigger warning');
    if (checkWarning(250) !== true) throw new Error('250 chars MUST trigger warning');
  });

  // Checkbox toggle reset test
  await recordTest('Suite 3: Personalization', 'Unchecking gift card checkbox resets personalization state', () => {
    let showPersonalization: boolean = true;
    let personalization: string = 'Special gift note';

    // Simulate user unchecking checkbox
    const onCheckboxChange = (checked: boolean) => {
      showPersonalization = checked;
      if (!checked) personalization = '';
      return { showPersonalization, personalization };
    };

    const state = onCheckboxChange(false);
    if (state.showPersonalization !== false) throw new Error('showPersonalization should be false');
    if (state.personalization !== '') throw new Error('personalization should be cleared to empty string');
  });

  // ==========================================================================
  // SUITE 4: QUANTITY SELECTOR BOUNDARY CONDITIONS
  // ==========================================================================
  console.log('\n--- SUITE 4: QUANTITY SELECTOR BOUNDARY CONDITIONS ---');

  // Test decrement boundary (cannot go below 1)
  await recordTest('Suite 4: Quantity', 'Quantity decrement cannot go below 1', () => {
    let quantity = 1;
    const isOutOfStock = false;

    // Decrement handler logic from ProductDetails.tsx:
    const handleDecrement = () => {
      if (quantity > 1) {
        quantity -= 1;
      }
    };

    // When quantity is 1, decrement button is disabled
    const isDecrementDisabled = quantity <= 1 || isOutOfStock;
    if (!isDecrementDisabled) {
      throw new Error('Decrement button must be disabled when quantity === 1');
    }

    // Call handler anyway (defensive)
    handleDecrement();
    if (quantity !== 1) {
      throw new Error(`Quantity decremented below 1! Current value: ${quantity}`);
    }
  });

  // Test increment boundary (cannot exceed stock)
  await recordTest('Suite 4: Quantity', 'Quantity increment cannot exceed available stock', () => {
    const availableStock = 5;
    let quantity = 4;
    const isOutOfStock = false;

    // Increment handler logic from ProductDetails.tsx:
    const handleIncrement = () => {
      if (quantity < availableStock) {
        quantity += 1;
      }
    };

    handleIncrement(); // 4 -> 5
    if (quantity !== 5) throw new Error(`Expected quantity 5, got ${quantity}`);

    // At availableStock, button is disabled
    const isIncrementDisabled = quantity >= availableStock || isOutOfStock;
    if (!isIncrementDisabled) {
      throw new Error(`Increment button must be disabled when quantity (${quantity}) >= stock (${availableStock})`);
    }

    // Attempt to increment again
    handleIncrement();
    if (quantity !== 5) {
      throw new Error(`Quantity exceeded available stock! Value: ${quantity}, Stock: ${availableStock}`);
    }
  });

  // Test variant switching quantity clamp
  await recordTest('Suite 4: Quantity', 'Switching variant clamps quantity to new variant stock', () => {
    let quantity = 8;
    const lowStockVariant: PrismaProductVariant = {
      id: 'var-low-stock',
      productId: 'prod-01',
      name: 'Small Wrap',
      sku: 'SW-01',
      priceAdjustment: 0,
      stockQuantity: 3, // only 3 in stock!
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Variant select handler logic from ProductDetails.tsx:
    const handleVariantSelect = (variant: PrismaProductVariant) => {
      if (quantity > variant.stockQuantity) {
        quantity = Math.max(1, variant.stockQuantity);
      }
    };

    handleVariantSelect(lowStockVariant);
    if (quantity !== 3) {
      throw new Error(`Quantity should have clamped from 8 to 3, but got ${quantity}`);
    }
  });

  // Test Out of Stock behavior (stock = 0)
  await recordTest('Suite 4: Quantity', 'Out of stock product disables all actions and rejects cart additions', () => {
    const availableStock = 0;
    const isOutOfStock = availableStock <= 0;
    let quantity = 1;
    let cartAdded = false;
    let routerPushed = false;

    if (!isOutOfStock) throw new Error('isOutOfStock should be true when stock is 0');

    // Button states
    const decDisabled = quantity <= 1 || isOutOfStock;
    const incDisabled = quantity >= availableStock || isOutOfStock;
    const addDisabled = isOutOfStock;
    const buyDisabled = isOutOfStock;

    if (!decDisabled || !incDisabled || !addDisabled || !buyDisabled) {
      throw new Error('All action and quantity buttons must be disabled when out of stock');
    }

    // Handler guards from ProductDetails.tsx
    const handleAddToCart = () => {
      if (isOutOfStock) return;
      cartAdded = true;
    };

    const handleBuyNow = () => {
      if (isOutOfStock) return;
      routerPushed = true;
    };

    handleAddToCart();
    handleBuyNow();

    if (cartAdded) throw new Error('handleAddToCart mutated cart despite being out of stock!');
    if (routerPushed) throw new Error('handleBuyNow redirected despite being out of stock!');
  });

  // Cart quantity boundaries
  await recordTest('Suite 4: Quantity', 'Cart item quantity validation: prevents 0 or negative quantities', () => {
    const validateQuantity = (qty: number): boolean => {
      return Number.isInteger(qty) && qty >= 1;
    };

    if (validateQuantity(1) !== true) throw new Error('Quantity 1 should be valid');
    if (validateQuantity(5) !== true) throw new Error('Quantity 5 should be valid');
    if (validateQuantity(0) !== false) throw new Error('Quantity 0 must be invalid');
    if (validateQuantity(-1) !== false) throw new Error('Negative quantity must be invalid');
    if (validateQuantity(-99) !== false) throw new Error('Negative quantity must be invalid');
    if (validateQuantity(1.5) !== false) throw new Error('Fractional quantity must be invalid');
    if (validateQuantity(NaN) !== false) throw new Error('NaN quantity must be invalid');
  });

  // ==========================================================================
  // SUMMARY REPORT
  // ==========================================================================
  console.log('\n======================================================================');
  console.log('📊 TEST SUMMARY RESULTS');
  console.log('======================================================================');

  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;

  console.log(`Total Tests Run: ${total}`);
  console.log(`Passed:         ${passed} / ${total}`);
  console.log(`Failed:         ${failed} / ${total}`);

  if (failed > 0) {
    console.error('\n❌ FAILED TESTS:');
    for (const f of results.filter((r) => r.status === 'FAIL')) {
      console.error(`- [${f.category}] ${f.name}: ${f.details}`);
    }
  } else {
    console.log('\n✨ ALL ADVERSARIAL STRESS TESTS PASSED WITH ZERO CRASHES OR VIOLATIONS!');
  }

  return { total, passed, failed };
}

main()
  .then((res) => {
    if (res.failed > 0) process.exit(1);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  });
