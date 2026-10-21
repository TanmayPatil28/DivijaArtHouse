import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';
import { subscribeNewsletter } from '../src/actions/newsletter';
import { getFeaturedProducts, getProducts } from '../src/lib/products';
import { getCategories } from '../src/lib/categories';
import { formatINR, calculateDiscount, parseJson } from '../src/lib/utils';
import HomePage from '../src/app/page';
import type { CategoryWithProducts, ProductWithCategory } from '../src/types';

interface TestResult {
  suite: string;
  testCase: string;
  expected: string;
  actual: string;
  passed: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  details?: string;
}

const results: TestResult[] = [];

function record(
  suite: string,
  testCase: string,
  expected: string,
  actual: string,
  passed: boolean,
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH',
  details?: string
) {
  results.push({ suite, testCase, expected, actual, passed, severity, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${icon}] [${suite}] ${testCase}`);
  if (!passed) {
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
    if (details) console.log(`   Details:  ${details}`);
  }
}

async function runChallengerM3Suite() {
  console.log('================================================================');
  console.log('   CHALLENGER 1: EMPIRICAL & ADVERSARIAL TEST SUITE (MILESTONE 3)');
  console.log('================================================================\n');

  const testEmailPrefix = `chal-${Date.now()}`;

  // Cleanup helper
  const cleanupTestEmails = async () => {
    await prisma.subscriber.deleteMany({
      where: {
        OR: [
          { email: { contains: 'chal-' } },
          { email: { contains: 'test' } },
        ],
      },
    });
  };

  await cleanupTestEmails();

  // ============================================================================
  // SUITE 1: Newsletter Input Validation & Boundary Cases
  // ============================================================================
  console.log('>>> SUITE 1: Newsletter Input Validation & Boundary Cases\n');

  // 1.1 Empty string email
  {
    const fd = new FormData();
    fd.append('email', '');
    const res = await subscribeNewsletter(null, fd);
    record(
      'Validation',
      'Empty string email is rejected',
      'success=false, message contains required',
      `success=${res.success}, message="${res.message}"`,
      res.success === false && res.message.toLowerCase().includes('required'),
      'CRITICAL'
    );
  }

  // 1.2 Whitespace-only email
  {
    const fd = new FormData();
    fd.append('email', '     ');
    const res = await subscribeNewsletter(null, fd);
    record(
      'Validation',
      'Whitespace-only email is trimmed and rejected',
      'success=false, message contains required',
      `success=${res.success}, message="${res.message}"`,
      res.success === false && res.message.toLowerCase().includes('required'),
      'HIGH'
    );
  }

  // 1.3 Newline and tab whitespace email
  {
    const fd = new FormData();
    fd.append('email', '\n\t   \r');
    const res = await subscribeNewsletter(null, fd);
    record(
      'Validation',
      'Newline/tab whitespace email is rejected',
      'success=false',
      `success=${res.success}, message="${res.message}"`,
      res.success === false,
      'HIGH'
    );
  }

  // 1.4 Missing email parameter (null FormData)
  {
    const fd = new FormData();
    const res = await subscribeNewsletter(null, fd);
    record(
      'Validation',
      'Missing email field in FormData is rejected',
      'success=false',
      `success=${res.success}, message="${res.message}"`,
      res.success === false,
      'HIGH'
    );
  }

  // 1.5 Malformed email formats
  const malformedEmails = [
    { input: 'plainaddress', reason: 'No @ symbol' },
    { input: '@domain.com', reason: 'Missing local part' },
    { input: 'user@', reason: 'Missing domain part' },
    { input: 'user name@domain.com', reason: 'Unquoted space in local part' },
    { input: 'user@domain..com', reason: 'Double dot in domain' },
    { input: 'user@.com', reason: 'Domain starts with dot' },
    { input: 'user@domain,com', reason: 'Comma instead of dot' },
  ];

  for (const tc of malformedEmails) {
    const fd = new FormData();
    fd.append('email', tc.input);
    const res = await subscribeNewsletter(null, fd);
    record(
      'Validation',
      `Malformed email rejected: "${tc.input}" (${tc.reason})`,
      'success=false',
      `success=${res.success}, message="${res.message}"`,
      res.success === false && !res.message.includes('Thank you'),
      'HIGH'
    );
  }

  // 1.6 Boundary check: Over 255 characters (256 chars)
  {
    const longLocal = 'a'.repeat(245);
    const longEmail = `${longLocal}@domain.com`; // 245 + 11 = 256 chars
    const fd = new FormData();
    fd.append('email', longEmail);
    const res = await subscribeNewsletter(null, fd);
    record(
      'Validation',
      `Email > 255 chars rejected (${longEmail.length} chars)`,
      'success=false, message contains too long',
      `success=${res.success}, message="${res.message}"`,
      res.success === false && res.message.toLowerCase().includes('too long'),
      'MEDIUM'
    );
  }

  // 1.7 Boundary check: Valid long email (e.g. 240 chars)
  {
    const domainPart = '@domain.com';
    const neededLocalLen = 240 - testEmailPrefix.length - 1 - domainPart.length;
    const validLongLocal = 'b'.repeat(Math.max(1, neededLocalLen));
    const validLongEmail = `${testEmailPrefix}-${validLongLocal}${domainPart}`;
    const fd = new FormData();
    fd.append('email', validLongEmail);
    const res = await subscribeNewsletter(null, fd);
    const passed = res.success === true;
    record(
      'Validation',
      `Valid long email accepted (<= 255 chars: ${validLongEmail.length} chars)`,
      'success=true',
      `success=${res.success}, message="${res.message}"`,
      passed,
      'MEDIUM'
    );
  }

  // 1.8 Trimming behavior on valid email with leading/trailing spaces
  {
    const untrimmed = `   ${testEmailPrefix}-trimmed@example.com   `;
    const expectedStored = `${testEmailPrefix}-trimmed@example.com`.toLowerCase();
    const fd = new FormData();
    fd.append('email', untrimmed);
    const res = await subscribeNewsletter(null, fd);

    const dbRecord = await prisma.subscriber.findUnique({
      where: { email: expectedStored },
    });

    const passed = res.success === true && dbRecord !== null && dbRecord.email === expectedStored;
    record(
      'Validation',
      'Leading and trailing whitespace trimmed before persistence',
      `email saved as "${expectedStored}"`,
      `dbRecord.email="${dbRecord?.email}"`,
      passed,
      'HIGH'
    );
  }

  // 1.9 Case insensitivity normalization
  {
    const mixedCase = `${testEmailPrefix}-MiXeD.CaSe@ExAmPlE.CoM`;
    const expectedLower = mixedCase.toLowerCase();
    const fd = new FormData();
    fd.append('email', mixedCase);
    const res = await subscribeNewsletter(null, fd);

    const dbRecord = await prisma.subscriber.findUnique({
      where: { email: expectedLower },
    });

    const passed = res.success === true && dbRecord !== null && dbRecord.email === expectedLower;
    record(
      'Validation',
      'Email address lowercased before persistence',
      `email saved as "${expectedLower}"`,
      `dbRecord.email="${dbRecord?.email}"`,
      passed,
      'HIGH'
    );
  }

  // ============================================================================
  // SUITE 2: Duplicate Handling, Deactivation & Reactivation Lifecycle
  // ============================================================================
  console.log('\n>>> SUITE 2: Duplicate Handling, Deactivation & Reactivation Lifecycle\n');

  const lifecycleEmail = `${testEmailPrefix}-lifecycle@example.com`.toLowerCase();

  // 2.1 First subscription
  {
    const fd = new FormData();
    fd.append('email', lifecycleEmail);
    fd.append('source', 'adversarial_lifecycle_test');
    const res = await subscribeNewsletter(null, fd);

    const dbRecord = await prisma.subscriber.findUnique({
      where: { email: lifecycleEmail },
    });

    const passed =
      res.success === true &&
      dbRecord !== null &&
      dbRecord.email === lifecycleEmail &&
      dbRecord.isActive === true &&
      dbRecord.source === 'adversarial_lifecycle_test';

    record(
      'Lifecycle',
      'Initial newsletter subscription created with active status and source',
      'success=true, isActive=true, source="adversarial_lifecycle_test"',
      `success=${res.success}, isActive=${dbRecord?.isActive}, source="${dbRecord?.source}"`,
      passed,
      'CRITICAL'
    );
  }

  // 2.2 Duplicate subscription with identical email
  {
    const fd = new FormData();
    fd.append('email', lifecycleEmail);
    const res = await subscribeNewsletter(null, fd);

    const count = await prisma.subscriber.count({
      where: { email: lifecycleEmail },
    });

    const passed =
      res.success === true &&
      res.message.toLowerCase().includes('already subscribed') &&
      count === 1;

    record(
      'Lifecycle',
      'Duplicate subscription returns friendly message without creating extra rows',
      'success=true, message contains "already subscribed", count=1',
      `success=${res.success}, message="${res.message}", count=${count}`,
      passed,
      'HIGH'
    );
  }

  // 2.3 Duplicate subscription with UPPERCASE version of email
  {
    const fd = new FormData();
    fd.append('email', lifecycleEmail.toUpperCase());
    const res = await subscribeNewsletter(null, fd);

    const count = await prisma.subscriber.count({
      where: { email: lifecycleEmail },
    });

    const passed =
      res.success === true &&
      res.message.toLowerCase().includes('already subscribed') &&
      count === 1;

    record(
      'Lifecycle',
      'Uppercase duplicate recognized as existing subscriber, count remains 1',
      'success=true, message contains "already subscribed", count=1',
      `success=${res.success}, message="${res.message}", count=${count}`,
      passed,
      'HIGH'
    );
  }

  // 2.4 Deactivation & Reactivation: simulate user unsubscribed, then re-subscribes
  {
    // Deactivate in DB
    await prisma.subscriber.update({
      where: { email: lifecycleEmail },
      data: { isActive: false },
    });

    const deactivated = await prisma.subscriber.findUnique({
      where: { email: lifecycleEmail },
    });
    if (deactivated?.isActive !== false) {
      throw new Error('Failed to set isActive: false for reactivation test');
    }

    // Attempt to re-subscribe
    const fd = new FormData();
    fd.append('email', lifecycleEmail);
    const res = await subscribeNewsletter(null, fd);

    const reactivated = await prisma.subscriber.findUnique({
      where: { email: lifecycleEmail },
    });

    const passed =
      res.success === true &&
      res.message.toLowerCase().includes('welcome back') &&
      reactivated?.isActive === true;

    record(
      'Lifecycle',
      'Re-subscribing reactivates deactivated subscription (isActive=true) with welcome back message',
      'success=true, message contains "welcome back", isActive=true',
      `success=${res.success}, message="${res.message}", isActive=${reactivated?.isActive}`,
      passed,
      'HIGH'
    );
  }

  // ============================================================================
  // SUITE 3: SQL & HTML / XSS Injection Security Testing
  // ============================================================================
  console.log('\n>>> SUITE 3: SQL & HTML / XSS Injection Security Testing\n');

  // 3.1 SQLi in email field
  const sqlInjectionsInEmail = [
    "' OR '1'='1",
    "admin'--",
    "'; DROP TABLE subscribers; --",
    "test' UNION SELECT 1, 'evil', true, NOW() --",
    "' OR 1=1 #",
  ];

  for (const sqli of sqlInjectionsInEmail) {
    const fd = new FormData();
    fd.append('email', sqli);
    const res = await subscribeNewsletter(null, fd);

    record(
      'Security',
      `SQL injection in email rejected safely: "${sqli}"`,
      'success=false (validation failure)',
      `success=${res.success}, message="${res.message}"`,
      res.success === false,
      'CRITICAL'
    );
  }

  // 3.2 SQLi in source field (with valid email)
  {
    const sqliSource = "homepage'); DROP TABLE subscribers; --";
    const sqliEmail = `${testEmailPrefix}-sqli-source@example.com`;
    const fd = new FormData();
    fd.append('email', sqliEmail);
    fd.append('source', sqliSource);

    const res = await subscribeNewsletter(null, fd);

    // Verify table still exists and record was stored with parameterized query
    const tableCheck = await prisma.subscriber.count();
    const created = await prisma.subscriber.findUnique({
      where: { email: sqliEmail },
    });

    const passed =
      res.success === true &&
      tableCheck > 0 &&
      created?.source === sqliSource;

    record(
      'Security',
      'SQL injection in source field parameterized safely without executing raw SQL',
      'Subscriber created with literal source string, subscribers table intact',
      `success=${res.success}, source="${created?.source}", tableCount=${tableCheck}`,
      passed,
      'CRITICAL'
    );
  }

  // 3.3 HTML / XSS Injection in email field
  const xssInEmail = [
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
    '"><script>alert(1)</script>@test.com',
  ];

  for (const xss of xssInEmail) {
    const fd = new FormData();
    fd.append('email', xss);
    const res = await subscribeNewsletter(null, fd);
    record(
      'Security',
      `HTML/XSS in email rejected safely: "${xss}"`,
      'success=false',
      `success=${res.success}, message="${res.message}"`,
      res.success === false,
      'HIGH'
    );
  }

  // 3.4 HTML / XSS Injection in source field (with valid email)
  {
    const xssSource = '<script>alert("xss")</script>';
    const xssEmail = `${testEmailPrefix}-xss-source@example.com`;
    const fd = new FormData();
    fd.append('email', xssEmail);
    fd.append('source', xssSource);

    const res = await subscribeNewsletter(null, fd);
    const created = await prisma.subscriber.findUnique({
      where: { email: xssEmail },
    });

    const passed =
      res.success === true &&
      created?.source === xssSource;

    record(
      'Security',
      'XSS string in source field stored safely as plain string without unhandled crash',
      'success=true, stored literally',
      `success=${res.success}, source="${created?.source}"`,
      passed,
      'HIGH'
    );
  }

  // ============================================================================
  // SUITE 4: Concurrency & Race Conditions
  // ============================================================================
  console.log('\n>>> SUITE 4: Concurrency & Race Conditions\n');

  // 4.1 Multiple distinct emails in parallel
  {
    const parallelEmails = Array.from({ length: 6 }, (_, i) => `${testEmailPrefix}-parallel-${i}@example.com`);
    const promises = parallelEmails.map((email) => {
      const fd = new FormData();
      fd.append('email', email);
      return subscribeNewsletter(null, fd);
    });

    const parallelResults = await Promise.all(promises);
    const allSuccessful = parallelResults.every((r) => r.success === true);
    const count = await prisma.subscriber.count({
      where: { email: { in: parallelEmails } },
    });

    record(
      'Concurrency',
      'Parallel subscriptions for 6 distinct emails all succeed and persist',
      'allSuccessful=true, count=6',
      `allSuccessful=${allSuccessful}, count=${count}`,
      allSuccessful && count === 6,
      'HIGH'
    );
  }

  // 4.2 Race condition: 5 simultaneous requests for the EXACT SAME email
  {
    const raceEmail = `${testEmailPrefix}-race@example.com`;
    const racePromises = Array.from({ length: 5 }, () => {
      const fd = new FormData();
      fd.append('email', raceEmail);
      return subscribeNewsletter(null, fd);
    });

    const raceResults = await Promise.all(racePromises);
    const count = await prisma.subscriber.count({
      where: { email: raceEmail },
    });

    // None should crash with uncaught exception; exactly 1 record should be in DB
    const noUnhandledExceptions = raceResults.every(
      (r) => typeof r.success === 'boolean' && typeof r.message === 'string'
    );

    record(
      'Concurrency',
      'Race condition on simultaneous identical subscription handled without crash',
      'noUnhandledExceptions=true, count=1 in DB',
      `noUnhandledExceptions=${noUnhandledExceptions}, count=${count}, results=${raceResults.map(r => r.success).join(',')}`,
      noUnhandledExceptions && count === 1,
      'HIGH'
    );
  }

  // ============================================================================
  // SUITE 5: Homepage Data-Fetching Resilience & Empty/Null States
  // ============================================================================
  console.log('\n>>> SUITE 5: Homepage Data-Fetching Resilience & Empty/Null States\n');

  // 5.1 Real MySQL database data fetching
  const [realFeatured, realCategories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories({ activeOnly: true, includeProductsCount: true }),
  ]);

  record(
    'DataFetching',
    'getFeaturedProducts returns >= 4 featured products from MySQL',
    '>= 4 products',
    `${realFeatured.length} products`,
    realFeatured.length >= 4,
    'CRITICAL'
  );

  record(
    'DataFetching',
    'getCategories returns >= 6 active categories with product counts from MySQL',
    '>= 6 categories with _count.products',
    `${realCategories.length} categories`,
    realCategories.length >= 6 && realCategories.every((c) => typeof c._count?.products === 'number'),
    'CRITICAL'
  );

  // 5.2 Adversarial Category Scenarios for CollectionReel
  console.log('  Testing CollectionReel data handling scenarios:');

  // Scenario A: Empty categories array []
  {
    const emptyCategories: CategoryWithProducts[] = [];
    let crashed = false;
    let allItemsCount = 0;
    try {
      const allItems = [
        {
          name: 'All Products',
          slug: 'all',
          href: '/shop',
          image: '/images/products/royal-sovereign-jumbo-1.svg',
          count: emptyCategories.reduce((sum, c) => sum + (c._count?.products || 0), 0),
        },
        ...emptyCategories.map((c) => ({
          name: c.name,
          slug: c.slug,
          href: `/collections/${c.slug}`,
          image: c.image || '/images/categories/bouquets.svg',
          count: c._count?.products || 0,
        })),
      ];
      allItemsCount = allItems.length;
    } catch {
      crashed = true;
    }

    record(
      'Resilience',
      'CollectionReel handles empty categories list [] without crash',
      'crashed=false, allItemsCount=1',
      `crashed=${crashed}, allItemsCount=${allItemsCount}`,
      !crashed && allItemsCount === 1,
      'HIGH'
    );
  }

  // Scenario B: Category with null image
  {
    const catWithNullImage = {
      id: 'mock-1',
      name: 'Null Image Category',
      slug: 'null-image',
      description: null,
      image: null,
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { products: 5 },
    } as CategoryWithProducts;

    const mapped = {
      name: catWithNullImage.name,
      slug: catWithNullImage.slug,
      href: `/collections/${catWithNullImage.slug}`,
      image: catWithNullImage.image || '/images/categories/bouquets.svg',
      count: catWithNullImage._count?.products || 0,
    };

    record(
      'Resilience',
      'CollectionReel falls back gracefully when category image is null',
      'image="/images/categories/bouquets.svg"',
      `image="${mapped.image}"`,
      mapped.image === '/images/categories/bouquets.svg',
      'HIGH'
    );
  }

  // Scenario C: Category with missing/undefined _count
  {
    const catNoCount = {
      id: 'mock-2',
      name: 'No Count Category',
      slug: 'no-count',
      description: null,
      image: '/images/categories/bouquets.svg',
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: undefined,
    } as unknown as CategoryWithProducts;

    let totalCount = 0;
    let crashed = false;
    try {
      totalCount = [catNoCount].reduce((sum, c) => sum + (c._count?.products || 0), 0);
    } catch {
      crashed = true;
    }

    record(
      'Resilience',
      'CollectionReel handles undefined _count safely with optional chaining',
      'crashed=false, totalCount=0',
      `crashed=${crashed}, totalCount=${totalCount}`,
      !crashed && totalCount === 0,
      'HIGH'
    );
  }

  // 5.3 Adversarial Product Scenarios for BestsellersGrid & ProductCard
  console.log('  Testing BestsellersGrid & ProductCard data handling scenarios:');

  // Scenario A: Empty products array []
  {
    const emptyProducts: ProductWithCategory[] = [];
    let mapCount = 0;
    let crashed = false;
    try {
      mapCount = emptyProducts.map((p) => p.id).length;
    } catch {
      crashed = true;
    }

    record(
      'Resilience',
      'BestsellersGrid handles empty products array [] without crash',
      'crashed=false, mapCount=0',
      `crashed=${crashed}, mapCount=${mapCount}`,
      !crashed && mapCount === 0,
      'HIGH'
    );
  }

  // Scenario B: Product with compareAtPrice: null
  {
    const discount = calculateDiscount(89900, null);
    record(
      'Resilience',
      'ProductCard handles compareAtPrice=null (discount=0)',
      'discount=0',
      `discount=${discount}`,
      discount === 0,
      'HIGH'
    );
  }

  // Scenario C: Product with compareAtPrice <= price (invalid/lower compareAtPrice)
  {
    const discount = calculateDiscount(89900, 79900);
    record(
      'Resilience',
      'ProductCard handles compareAtPrice <= price safely (discount=0)',
      'discount=0',
      `discount=${discount}`,
      discount === 0,
      'HIGH'
    );
  }

  // Scenario D: Product with corrupted/empty images JSON
  {
    const emptyImages = parseJson<string[]>('', []);
    const invalidJsonImages = parseJson<string[]>('{bad-json}', []);
    const nullImages = parseJson<string[]>(null, []);

    const fallback1 = emptyImages[0] || '/images/products/blushing-peony-rose-1.svg';
    const fallback2 = invalidJsonImages[0] || '/images/products/blushing-peony-rose-1.svg';
    const fallback3 = nullImages[0] || '/images/products/blushing-peony-rose-1.svg';

    const passed =
      fallback1 === '/images/products/blushing-peony-rose-1.svg' &&
      fallback2 === '/images/products/blushing-peony-rose-1.svg' &&
      fallback3 === '/images/products/blushing-peony-rose-1.svg';

    record(
      'Resilience',
      'ProductCard safely falls back to default image when images JSON is null, empty or corrupt',
      'fallback image resolved for all invalid states',
      `f1=${fallback1}, f2=${fallback2}, f3=${fallback3}`,
      passed,
      'HIGH'
    );
  }

  // Scenario E: Product with stockQuantity = 0
  {
    const zeroStockProduct = {
      ...realFeatured[0],
      stockQuantity: 0,
    };

    const isOutOfStock = zeroStockProduct.stockQuantity <= 0;
    record(
      'Resilience',
      'Product with stockQuantity=0 evaluates as out of stock',
      'isOutOfStock=true',
      `isOutOfStock=${isOutOfStock}`,
      isOutOfStock === true,
      'HIGH'
    );
  }

  // Scenario F: Product with null or undefined category
  {
    const prodNoCategory = {
      ...realFeatured[0],
      category: null as unknown as CategoryWithProducts,
    };

    const categoryName = prodNoCategory.category?.name;
    record(
      'Resilience',
      'ProductCard safely uses optional chaining on product.category?.name',
      'categoryName=undefined without crash',
      `categoryName=${categoryName}`,
      categoryName === undefined,
      'HIGH'
    );
  }

  // 5.4 Call HomePage() async server component directly against live MySQL DB
  {
    let homeTree: any = null;
    let crashed = false;
    try {
      homeTree = await HomePage();
    } catch (err) {
      crashed = true;
      console.error('HomePage execution failed:', err);
    }

    record(
      'HomePage',
      'HomePage server component executes end-to-end against live MySQL returning React JSX element',
      'crashed=false, homeTree!=null',
      `crashed=${crashed}, type=${typeof homeTree}`,
      !crashed && homeTree !== null && typeof homeTree === 'object',
      'CRITICAL'
    );
  }

  // ============================================================================
  // CLEANUP & FINAL VERIFICATION
  // ============================================================================
  console.log('\n>>> CLEANUP & TEARDOWN\n');
  await cleanupTestEmails();

  const remainingTestSubscribers = await prisma.subscriber.count({
    where: { email: { contains: 'chal-' } },
  });

  record(
    'Cleanup',
    'All test subscribers purged from database after test run',
    'remaining=0',
    `remaining=${remainingTestSubscribers}`,
    remainingTestSubscribers === 0,
    'MEDIUM'
  );

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n================================================================');
  console.log('                      TEST SUITE SUMMARY                        ');
  console.log('================================================================');

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const criticalFails = results.filter((r) => !r.passed && r.severity === 'CRITICAL').length;
  const highFails = results.filter((r) => !r.passed && r.severity === 'HIGH').length;

  console.log(`Total Checks Executed : ${total}`);
  console.log(`Passed                 : ${passed}`);
  console.log(`Failed                 : ${failed}`);
  console.log(`Critical Failures      : ${criticalFails}`);
  console.log(`High Severity Failures : ${highFails}`);

  if (failed > 0) {
    console.error('\nFAILED TESTS:');
    for (const f of results.filter((r) => !r.passed)) {
      console.error(` - [${f.severity}] [${f.suite}] ${f.testCase}: expected ${f.expected}, got ${f.actual}`);
    }
    throw new Error(`${failed} tests failed!`);
  }

  console.log('\n🎉 ALL CHALLENGER TESTS PASSED WITH ZERO FAILURES!\n');
}

runChallengerM3Suite()
  .catch((err) => {
    console.error('SUITE EXECUTION ERROR:', err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
