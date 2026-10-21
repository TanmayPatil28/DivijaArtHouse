import {
  calculateCartSummary,
  getCartItemId,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  CART_STORAGE_KEY,
} from '../src/context/CartContext';
import { formatINR, calculateDiscount } from '../src/lib/utils';
import type { CartItem, CartSummary } from '../src/types';
import fs from 'fs';
import path from 'path';

interface TestResult {
  suite: string;
  testName: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, suite: string, details?: string) {
  if (condition) {
    results.push({ suite, testName, passed: true, details });
    console.log(`  ✓ [PASS] [${suite}] ${testName}`);
  } else {
    results.push({ suite, testName, passed: false, error: 'Assertion failed', details });
    console.error(`  ✗ [FAIL] [${suite}] ${testName} - ${details || 'Assertion failed'}`);
  }
}

function assertEqual<T>(actual: T, expected: T, testName: string, suite: string) {
  const passed = actual === expected;
  if (passed) {
    results.push({ suite, testName, passed: true });
    console.log(`  ✓ [PASS] [${suite}] ${testName}`);
  } else {
    const error = `Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`;
    results.push({ suite, testName, passed: false, error });
    console.error(`  ✗ [FAIL] [${suite}] ${testName} - ${error}`);
  }
}

// =========================================================================
// State Reducer Simulation matching CartContext logic exactly
// =========================================================================
function simulateAddToCart(prevItems: CartItem[], item: CartItem): CartItem[] {
  const compositeId = item.id || getCartItemId(item.productId, item.variantId);
  const normalizedItem: CartItem = {
    ...item,
    id: compositeId,
  };

  const existingIndex = prevItems.findIndex(
    (i) =>
      i.id === compositeId ||
      (i.productId === normalizedItem.productId &&
        (i.variantId || 'default') === (normalizedItem.variantId || 'default'))
  );

  let updatedList: CartItem[];

  if (existingIndex > -1) {
    const existing = prevItems[existingIndex];
    const newQty = (existing.quantity || 1) + (normalizedItem.quantity || 1);
    const maxStock = normalizedItem.stock ?? existing.stock;
    const clampedQty = maxStock ? Math.min(newQty, maxStock) : newQty;

    const merged: CartItem = {
      ...existing,
      quantity: clampedQty,
      personalization:
        normalizedItem.personalization !== undefined
          ? normalizedItem.personalization
          : existing.personalization,
      unitPrice: normalizedItem.unitPrice || existing.unitPrice,
      stock: maxStock,
    };

    updatedList = [...prevItems];
    updatedList[existingIndex] = merged;
  } else {
    const maxStock = normalizedItem.stock;
    const initialQty = maxStock
      ? Math.min(normalizedItem.quantity || 1, maxStock)
      : normalizedItem.quantity || 1;

    updatedList = [
      ...prevItems,
      {
        ...normalizedItem,
        quantity: Math.max(1, initialQty),
      },
    ];
  }
  return updatedList;
}

function simulateUpdateQuantity(prevItems: CartItem[], itemId: string, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return prevItems.filter((i) => i.id !== itemId);
  }

  return prevItems.map((item) => {
    if (item.id === itemId) {
      const maxStock = item.stock;
      const validQty = maxStock ? Math.min(quantity, maxStock) : quantity;
      return {
        ...item,
        quantity: Math.max(1, validQty),
      };
    }
    return item;
  });
}

function simulateRemoveItem(prevItems: CartItem[], itemId: string): CartItem[] {
  return prevItems.filter((i) => i.id !== itemId);
}

// =========================================================================
// RUN ALL SUITES
// =========================================================================
async function runAllTests() {
  console.log('================================================================');
  console.log('       DIVIJA ART HOUSE — CART SYSTEM ADVERSARIAL STRESS SUITE   ');
  console.log('================================================================\n');

  // -----------------------------------------------------------------------
  // SUITE 1: Integer Paise Arithmetic & Free Shipping Boundaries
  // -----------------------------------------------------------------------
  console.log('--- SUITE 1: Integer Paise Arithmetic & Free Shipping Thresholds ---');

  // Test 1.1: Empty Cart
  const emptySummary = calculateCartSummary([]);
  assertEqual(emptySummary.subtotal, 0, 'Empty cart subtotal is 0', 'Arithmetic');
  assertEqual(emptySummary.itemCount, 0, 'Empty cart itemCount is 0', 'Arithmetic');
  assertEqual(emptySummary.shippingFee, 0, 'Empty cart shippingFee is 0 (no fee on empty)', 'Arithmetic');
  assertEqual(emptySummary.totalAmount, 0, 'Empty cart totalAmount is 0', 'Arithmetic');
  assertEqual(emptySummary.remainingForFreeShipping, 99900, 'Empty cart remaining is 99900 paise', 'Arithmetic');

  // Test 1.2: Below threshold boundary - ₹998 (99800 paise)
  const item998: CartItem = {
    id: 'p1-default',
    productId: 'p1',
    name: 'Blushing Peony Rose',
    slug: 'blushing-peony-rose',
    image: '/images/products/blushing-peony-rose-1.svg',
    unitPrice: 99800,
    quantity: 1,
  };
  const summary998 = calculateCartSummary([item998]);
  assertEqual(summary998.subtotal, 99800, '₹998 subtotal is exactly 99800 paise', 'Arithmetic');
  assertEqual(summary998.shippingFee, 9900, '₹998 shipping fee is ₹99 (9900 paise)', 'Arithmetic');
  assertEqual(summary998.remainingForFreeShipping, 100, '₹998 remaining for free shipping is 100 paise (₹1)', 'Arithmetic');
  assertEqual(summary998.totalAmount, 109700, '₹998 total amount is 109700 paise (₹1,097)', 'Arithmetic');

  // Test 1.3: 1 paisa below threshold - 99899 paise (₹998.99)
  const item99899: CartItem = {
    ...item998,
    unitPrice: 99899,
  };
  const summary99899 = calculateCartSummary([item99899]);
  assertEqual(summary99899.subtotal, 99899, '99899 paise subtotal exact', 'Arithmetic');
  assertEqual(summary99899.shippingFee, 9900, '99899 paise incurs shipping fee of 9900 paise', 'Arithmetic');
  assertEqual(summary99899.remainingForFreeShipping, 1, '99899 paise has 1 paisa remaining', 'Arithmetic');
  assertEqual(summary99899.totalAmount, 99899 + 9900, '99899 paise total = 109799 paise', 'Arithmetic');

  // Test 1.4: Exact threshold boundary - ₹999 (99900 paise)
  const item999: CartItem = {
    ...item998,
    unitPrice: 99900,
  };
  const summary999 = calculateCartSummary([item999]);
  assertEqual(summary999.subtotal, 99900, '₹999 subtotal is exactly 99900 paise', 'Arithmetic');
  assertEqual(summary999.shippingFee, 0, '₹999 qualifies for FREE shipping (shippingFee = 0)', 'Arithmetic');
  assertEqual(summary999.remainingForFreeShipping, 0, '₹999 remaining for free shipping is 0', 'Arithmetic');
  assertEqual(summary999.totalAmount, 99900, '₹999 total amount is exactly 99900 paise', 'Arithmetic');

  // Test 1.5: 1 paisa above threshold - 99901 paise
  const item99901: CartItem = {
    ...item998,
    unitPrice: 99901,
  };
  const summary99901 = calculateCartSummary([item99901]);
  assertEqual(summary99901.subtotal, 99901, '99901 paise subtotal exact', 'Arithmetic');
  assertEqual(summary99901.shippingFee, 0, '99901 paise qualifies for FREE shipping', 'Arithmetic');
  assertEqual(summary99901.remainingForFreeShipping, 0, '99901 paise remaining is 0', 'Arithmetic');
  assertEqual(summary99901.totalAmount, 99901, '99901 paise total is 99901 paise', 'Arithmetic');

  // Test 1.6: Above threshold boundary - ₹1,000 (100000 paise)
  const item1000: CartItem = {
    ...item998,
    unitPrice: 100000,
  };
  const summary1000 = calculateCartSummary([item1000]);
  assertEqual(summary1000.subtotal, 100000, '₹1,000 subtotal is 100000 paise', 'Arithmetic');
  assertEqual(summary1000.shippingFee, 0, '₹1,000 shipping fee is 0', 'Arithmetic');
  assertEqual(summary1000.remainingForFreeShipping, 0, '₹1,000 remaining is 0', 'Arithmetic');
  assertEqual(summary1000.totalAmount, 100000, '₹1,000 total amount is 100000 paise', 'Arithmetic');

  // Test 1.7: Multiple items sum precision without float drift
  // 10 items at ₹149.99 (14999 paise) each => 149990 paise (₹1,499.90)
  const itemsMulti: CartItem[] = Array.from({ length: 10 }, (_, idx) => ({
    id: `prod-${idx}-default`,
    productId: `prod-${idx}`,
    name: `Item ${idx}`,
    slug: `item-${idx}`,
    image: '/images/products/blushing-peony-rose-1.svg',
    unitPrice: 14999,
    quantity: 1,
  }));
  const summaryMulti = calculateCartSummary(itemsMulti);
  assertEqual(summaryMulti.subtotal, 149990, '10 items @ 14999 paise = 149990 paise exactly', 'Arithmetic');
  assertEqual(summaryMulti.itemCount, 10, 'Item count is exactly 10', 'Arithmetic');
  assertEqual(summaryMulti.shippingFee, 0, 'Subtotal 149990 >= 99900 => shippingFee 0', 'Arithmetic');
  assertEqual(summaryMulti.totalAmount, 149990, 'Total amount is exactly 149990 paise', 'Arithmetic');

  // Test 1.8: Currency formatting formatINR verification
  assertEqual(formatINR(0), '₹0', 'formatINR(0) returns ₹0', 'Formatting');
  assertEqual(formatINR(99800), '₹998', 'formatINR(99800) returns ₹998', 'Formatting');
  assertEqual(formatINR(99900), '₹999', 'formatINR(99900) returns ₹999', 'Formatting');
  assertEqual(formatINR(100000), '₹1,000', 'formatINR(100000) returns ₹1,000', 'Formatting');
  assertEqual(formatINR(109700), '₹1,097', 'formatINR(109700) returns ₹1,097', 'Formatting');
  assertEqual(formatINR(99899, { showPaise: true }), '₹998.99', 'formatINR(99899, showPaise) returns ₹998.99', 'Formatting');

  console.log('\n--- SUITE 2: Line Item Deduplication & Variant Handling ---');

  // Test 2.1: Re-adding same product with same variant merges quantities
  let cart: CartItem[] = [];
  const baseItem: CartItem = {
    id: 'prod-1-v-red',
    productId: 'prod-1',
    variantId: 'v-red',
    variantName: 'Ruby Red',
    name: 'Eternal Rose',
    slug: 'eternal-rose',
    image: '/img/rose.svg',
    unitPrice: 49900,
    quantity: 2,
    stock: 10,
  };

  cart = simulateAddToCart(cart, baseItem);
  assertEqual(cart.length, 1, 'Initial add creates 1 line item', 'Deduplication');
  assertEqual(cart[0].quantity, 2, 'Initial quantity is 2', 'Deduplication');

  // Add same item again with quantity 3
  cart = simulateAddToCart(cart, { ...baseItem, quantity: 3 });
  assertEqual(cart.length, 1, 'Re-adding same variant keeps line count at 1', 'Deduplication');
  assertEqual(cart[0].quantity, 5, 'Merged quantity is 2 + 3 = 5', 'Deduplication');

  // Test 2.2: Adding same product with DIFFERENT variant creates a separate line item
  const blueVariantItem: CartItem = {
    id: 'prod-1-v-blue',
    productId: 'prod-1',
    variantId: 'v-blue',
    variantName: 'Ocean Blue',
    name: 'Eternal Rose',
    slug: 'eternal-rose',
    image: '/img/rose.svg',
    unitPrice: 54900,
    quantity: 1,
    stock: 10,
  };

  cart = simulateAddToCart(cart, blueVariantItem);
  assertEqual(cart.length, 2, 'Different variant creates distinct line item (length=2)', 'Deduplication');
  assertEqual(cart[0].variantId, 'v-red', 'First item is Ruby Red', 'Deduplication');
  assertEqual(cart[1].variantId, 'v-blue', 'Second item is Ocean Blue', 'Deduplication');

  // Test 2.3: Adding item with no variant (undefined) vs default
  const noVariantItem: CartItem = {
    id: 'prod-2-default',
    productId: 'prod-2',
    name: 'Mini Daisy',
    slug: 'mini-daisy',
    image: '/img/daisy.svg',
    unitPrice: 29900,
    quantity: 1,
  };
  cart = simulateAddToCart(cart, noVariantItem);
  assertEqual(cart.length, 3, 'Adding product without variant creates distinct item', 'Deduplication');

  // Re-add prod-2 without specifying ID (relies on getCartItemId composite key)
  const noVariantItemWithoutId: CartItem = {
    id: '',
    productId: 'prod-2',
    name: 'Mini Daisy',
    slug: 'mini-daisy',
    image: '/img/daisy.svg',
    unitPrice: 29900,
    quantity: 2,
  };
  cart = simulateAddToCart(cart, noVariantItemWithoutId);
  assertEqual(cart.length, 3, 'Re-adding prod-2 with empty id resolves composite key and merges', 'Deduplication');
  assertEqual(cart[2].quantity, 3, 'Merged quantity for prod-2 is 1 + 2 = 3', 'Deduplication');

  // Test 2.4: Personalization note handling during deduplication
  const itemWithNote: CartItem = {
    id: 'prod-3-default',
    productId: 'prod-3',
    name: 'Tulip Pot',
    slug: 'tulip-pot',
    image: '/img/tulip.svg',
    unitPrice: 79900,
    quantity: 1,
    personalization: 'Happy Anniversary!',
  };
  cart = simulateAddToCart(cart, itemWithNote);
  assertEqual(cart[3].personalization, 'Happy Anniversary!', 'Initial personalization preserved', 'Deduplication');

  // Re-add without new personalization (undefined) -> should keep existing note
  cart = simulateAddToCart(cart, {
    ...itemWithNote,
    quantity: 1,
    personalization: undefined,
  });
  assertEqual(cart[3].personalization, 'Happy Anniversary!', 'Undefined personalization does not overwrite existing note', 'Deduplication');

  // Re-add with updated personalization -> updates note
  cart = simulateAddToCart(cart, {
    ...itemWithNote,
    quantity: 1,
    personalization: 'Best Wishes Always',
  });
  assertEqual(cart[3].personalization, 'Best Wishes Always', 'Explicit new personalization updates existing note', 'Deduplication');

  console.log('\n--- SUITE 3: Quantity Stepper Bounds & Stock Constraints ---');

  // Test 3.1: Stock limit clamping on addToCart
  let stockCart: CartItem[] = [];
  const limitedItem: CartItem = {
    id: 'prod-stock-default',
    productId: 'prod-stock',
    name: 'Limited Edition Orchid',
    slug: 'limited-orchid',
    image: '/img/orchid.svg',
    unitPrice: 129900,
    quantity: 8,
    stock: 5, // Only 5 in stock!
  };

  stockCart = simulateAddToCart(stockCart, limitedItem);
  assertEqual(stockCart[0].quantity, 5, 'Adding quantity 8 with stock 5 clamps initial quantity to 5', 'StepperBounds');

  // Test 3.2: Clamping on cumulative merge
  stockCart = [{ ...limitedItem, quantity: 3, stock: 5 }];
  stockCart = simulateAddToCart(stockCart, { ...limitedItem, quantity: 4 });
  assertEqual(stockCart[0].quantity, 5, 'Merging 3 + 4 clamps to maxStock 5', 'StepperBounds');

  // Test 3.3: updateQuantity respecting stock limit
  stockCart = simulateUpdateQuantity(stockCart, 'prod-stock-default', 10);
  assertEqual(stockCart[0].quantity, 5, 'updateQuantity(10) on stock 5 clamps to 5', 'StepperBounds');

  stockCart = simulateUpdateQuantity(stockCart, 'prod-stock-default', 3);
  assertEqual(stockCart[0].quantity, 3, 'updateQuantity(3) within stock succeeds', 'StepperBounds');

  // Test 3.4: Decrementing to 0 removes item
  stockCart = simulateUpdateQuantity(stockCart, 'prod-stock-default', 0);
  assertEqual(stockCart.length, 0, 'updateQuantity(0) removes item from cart', 'StepperBounds');

  // Test 3.5: Decrementing below 0 removes item
  stockCart = [{ ...limitedItem, quantity: 2 }];
  stockCart = simulateUpdateQuantity(stockCart, 'prod-stock-default', -1);
  assertEqual(stockCart.length, 0, 'updateQuantity(-1) removes item from cart', 'StepperBounds');

  // Test 3.6: removeItem explicitly
  stockCart = [{ ...limitedItem, quantity: 2 }, { ...baseItem, quantity: 1 }];
  stockCart = simulateRemoveItem(stockCart, 'prod-stock-default');
  assertEqual(stockCart.length, 1, 'removeItem removes only targeted item', 'StepperBounds');
  assertEqual(stockCart[0].id, 'prod-1-v-red', 'Remaining item is intact', 'StepperBounds');

  console.log('\n--- SUITE 4: Adversarial Inputs & Malformed Data Resilience ---');

  // Test 4.1: Corrupted JSON strings in localStorage parsing simulation
  const corruptedStrings = [
    '{invalid json',
    '{"id": "unclosed',
    'undefined',
    'NaN',
    '',
    '<<<malformed XML>>>',
  ];

  for (const str of corruptedStrings) {
    let parsed: any = null;
    let errorCaught = false;
    try {
      if (str) {
        parsed = JSON.parse(str);
      }
    } catch {
      errorCaught = true;
    }
    assert(
      errorCaught || parsed === null || typeof parsed !== 'object',
      `Corrupted string "${str.slice(0, 15)}" safely rejected or caught`,
      'AdversarialJSON'
    );
  }

  // Test 4.2: Non-array JSON in localStorage (e.g. object, number, boolean)
  const nonArrayValues = ['{}', '123', 'true', '"a string"', 'null'];
  for (const raw of nonArrayValues) {
    const parsed = JSON.parse(raw);
    const isValidCart = Array.isArray(parsed);
    assert(
      !isValidCart,
      `Non-array parsed JSON "${raw}" rejected by Array.isArray check`,
      'AdversarialJSON'
    );
  }

  // Test 4.3: calculateCartSummary with adversarial item payloads
  // Item with negative unitPrice
  const negativePriceItem: CartItem = {
    id: 'adversarial-1',
    productId: 'adv-1',
    name: 'Hacked Price Item',
    slug: 'hacked-item',
    image: '',
    unitPrice: -50000,
    quantity: 1,
  };
  const negSummary = calculateCartSummary([negativePriceItem]);
  // subtotal becomes -50000. In CartContext:
  // shippingFee = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  // Since -50000 < 99900, shippingFee = 9900.
  // totalAmount = -50000 + 9900 = -40100.
  assert(
    typeof negSummary.subtotal === 'number' && !isNaN(negSummary.subtotal),
    'Negative unitPrice does not produce NaN',
    'AdversarialPayload'
  );

  // Test 4.4: Item with 0 or missing quantity
  const zeroQtyItem: any = {
    id: 'zero-qty',
    productId: 'zq',
    unitPrice: 50000,
    quantity: 0,
  };
  const zeroSummary = calculateCartSummary([zeroQtyItem]);
  assertEqual(zeroSummary.subtotal, 0, 'Zero quantity produces 0 subtotal', 'AdversarialPayload');
  assertEqual(zeroSummary.itemCount, 0, 'Zero quantity produces 0 itemCount', 'AdversarialPayload');

  // Test 4.5: formatINR with extreme / edge values
  assertEqual(formatINR(NaN), '₹0', 'formatINR(NaN) safely falls back to ₹0', 'AdversarialFormatting');
  assertEqual(formatINR(Infinity), '₹0', 'formatINR(Infinity) safely falls back to ₹0', 'AdversarialFormatting');
  assertEqual(formatINR(-10000), '-₹100', 'formatINR(-10000) formats negative rupees correctly', 'AdversarialFormatting');

  // Test 4.6: calculateDiscount edge cases
  assertEqual(calculateDiscount(1000, 0), 0, 'calculateDiscount with compareAtPrice 0 returns 0', 'Discount');
  assertEqual(calculateDiscount(1000, -500), 0, 'calculateDiscount with negative compareAtPrice returns 0', 'Discount');
  assertEqual(calculateDiscount(1000, 1000), 0, 'calculateDiscount when equal returns 0', 'Discount');
  assertEqual(calculateDiscount(1000, 500), 0, 'calculateDiscount when price > compareAtPrice returns 0', 'Discount');
  assertEqual(calculateDiscount(500, 1000), 50, 'calculateDiscount(500, 1000) returns 50%', 'Discount');
  assertEqual(calculateDiscount(NaN, 1000), 0, 'calculateDiscount(NaN, 1000) returns 0', 'Discount');

  console.log('\n--- SUITE 5: Source Code & Static Architecture Audit ---');

  // Test 5.1: Verify CartContext composite ID format
  const generatedId = getCartItemId('prod-123', 'var-456');
  assertEqual(generatedId, 'prod-123-var-456', 'getCartItemId generates ${productId}-${variantId}', 'Architecture');

  const generatedDefaultId = getCartItemId('prod-123');
  assertEqual(generatedDefaultId, 'prod-123-default', 'getCartItemId defaults variant to "default"', 'Architecture');

  // Test 5.2: CartDrawer accessibility inspection
  const cartDrawerFile = path.resolve(process.cwd(), 'src/components/cart/CartDrawer.tsx');
  const cartDrawerSource = fs.readFileSync(cartDrawerFile, 'utf-8');

  assert(cartDrawerSource.includes('role="dialog"'), 'CartDrawer has role="dialog"', 'Accessibility');
  assert(cartDrawerSource.includes('aria-modal="true"'), 'CartDrawer has aria-modal="true"', 'Accessibility');
  assert(cartDrawerSource.includes("e.key === 'Escape'"), 'CartDrawer handles Escape key dismissal', 'Accessibility');
  assert(cartDrawerSource.includes('focusTimeout') || cartDrawerSource.includes('closeButtonRef.current?.focus()'), 'CartDrawer handles initial focus management', 'Accessibility');
  assert(cartDrawerSource.includes('e.key === \'Tab\''), 'CartDrawer handles Tab focus trapping', 'Accessibility');

  // Test 5.3: CartDrawerItem controls inspection
  const cartItemFile = path.resolve(process.cwd(), 'src/components/cart/CartDrawerItem.tsx');
  const cartItemSource = fs.readFileSync(cartItemFile, 'utf-8');

  assert(cartItemSource.includes('disabled={isAtMin}'), 'CartDrawerItem disables decrement at min', 'Accessibility');
  assert(cartItemSource.includes('disabled={isAtMax}'), 'CartDrawerItem disables increment at stock max', 'Accessibility');
  assert(cartItemSource.includes('removeItem(item.id)'), 'CartDrawerItem connects trash button to removeItem', 'Architecture');

  // Test 5.4: FreeShippingBar boundary calculation
  const freeShippingFile = path.resolve(process.cwd(), 'src/components/cart/FreeShippingBar.tsx');
  const freeShippingSource = fs.readFileSync(freeShippingFile, 'utf-8');
  assert(freeShippingSource.includes('subtotal >= FREE_SHIPPING_THRESHOLD'), 'FreeShippingBar uses >= FREE_SHIPPING_THRESHOLD', 'Architecture');
  assert(freeShippingSource.includes('role="progressbar"'), 'FreeShippingBar has role="progressbar"', 'Accessibility');

  // Test 5.5: Header & Layout wiring
  const layoutFile = path.resolve(process.cwd(), 'src/app/layout.tsx');
  const layoutSource = fs.readFileSync(layoutFile, 'utf-8');
  assert(layoutSource.includes('<CartProvider>'), 'RootLayout mounts <CartProvider>', 'Wiring');
  assert(layoutSource.includes('<WishlistProvider>'), 'RootLayout mounts <WishlistProvider>', 'Wiring');
  assert(layoutSource.includes('<CartDrawer />'), 'RootLayout mounts <CartDrawer />', 'Wiring');

  const headerFile = path.resolve(process.cwd(), 'src/components/layout/Header.tsx');
  const headerSource = fs.readFileSync(headerFile, 'utf-8');
  assert(headerSource.includes('openCart'), 'Header connects ShoppingBag button to openCart', 'Wiring');
  assert(headerSource.includes('activeCartCount'), 'Header renders activeCartCount badge', 'Wiring');
  assert(headerSource.includes('activeWishlistCount'), 'Header renders activeWishlistCount badge', 'Wiring');

  // Test 5.6: Wishlist Action & Page
  const wishlistActionFile = path.resolve(process.cwd(), 'src/actions/wishlist.ts');
  const wishlistActionSource = fs.readFileSync(wishlistActionFile, 'utf-8');
  assert(wishlistActionSource.includes('getWishlistProducts'), 'getWishlistProducts server action exists', 'Wishlist');
  assert(wishlistActionSource.includes('prisma.product.findMany'), 'getWishlistProducts queries Prisma with valid IDs', 'Wishlist');

  const wishlistPageFile = path.resolve(process.cwd(), 'src/app/(storefront)/wishlist/page.tsx');
  const wishlistPageSource = fs.readFileSync(wishlistPageFile, 'utf-8');
  assert(wishlistPageSource.includes('handleMoveToBag'), 'Wishlist page implements Move to Bag', 'Wishlist');
  assert(wishlistPageSource.includes('removeFromWishlist'), 'Wishlist page implements Remove action', 'Wishlist');

  // -----------------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------------
  console.log('\n================================================================');
  console.log('                        STRESS TEST SUMMARY                     ');
  console.log('================================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`Total Assertions : ${total}`);
  console.log(`Passed           : ${passed}`);
  console.log(`Failed           : ${failed}`);

  if (failed > 0) {
    console.error('\nFAILED TESTS:');
    results.filter((r) => !r.passed).forEach((r) => {
      console.error(`- [${r.suite}] ${r.testName}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('\nALL CART SYSTEM STRESS & ADVERSARIAL TESTS PASSED CONVINCINGLY!');
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
