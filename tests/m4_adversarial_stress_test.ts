import { getProducts, getProductBySlug, getRelatedProducts } from '../src/lib/products';
import { getCategories, getCategoryBySlug } from '../src/lib/categories';

interface TestCaseResult {
  name: string;
  passed: boolean;
  details: string;
  error?: string;
}

const results: TestCaseResult[] = [];

function record(name: string, passed: boolean, details: string, error?: string) {
  results.push({ name, passed, details, error });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} | ${name} | ${details}`);
  if (error) {
    console.error(`   Error trace: ${error}`);
  }
}

async function runSuite() {
  console.log('======================================================================');
  console.log('  MILESTONE 4 ADVERSARIAL STRESS TEST SUITE — DivijaArtHouse');
  console.log('======================================================================\n');

  // -------------------------------------------------------------------------
  // SUITE 1: Direct Backend & Prisma Stress Tests
  // -------------------------------------------------------------------------
  console.log('>>> [SUITE 1] In-Process Catalog & Discovery Logic Stress Tests\n');

  // 1.1 Non-numeric and NaN price handling
  try {
    const res = await getProducts({ minPrice: NaN, maxPrice: NaN });
    const passed = Array.isArray(res.products) && res.total > 0;
    record(
      '1.1 getProducts: minPrice=NaN, maxPrice=NaN',
      passed,
      `Returned ${res.products.length} items (total: ${res.total}). Handled NaN safely without database crash.`
    );
  } catch (err: any) {
    record('1.1 getProducts: minPrice=NaN, maxPrice=NaN', false, 'Threw exception', err.message);
  }

  // 1.2 Negative minPrice
  try {
    const res = await getProducts({ minPrice: -50000 });
    const passed = Array.isArray(res.products) && res.total > 0;
    record(
      '1.2 getProducts: negative minPrice (-₹500)',
      passed,
      `Returned ${res.products.length} items (total: ${res.total}). Negative price bound did not crash.`
    );
  } catch (err: any) {
    record('1.2 getProducts: negative minPrice (-₹500)', false, 'Threw exception', err.message);
  }

  // 1.3 Negative maxPrice (impossible condition)
  try {
    const res = await getProducts({ maxPrice: -50000 });
    const passed = Array.isArray(res.products) && res.total === 0 && res.products.length === 0;
    record(
      '1.3 getProducts: negative maxPrice (-₹500)',
      passed,
      `Returned clean empty array (${res.products.length} items, total: ${res.total}).`
    );
  } catch (err: any) {
    record('1.3 getProducts: negative maxPrice (-₹500)', false, 'Threw exception', err.message);
  }

  // 1.4 Inverted bounds: maxPrice < minPrice (min: ₹2,000, max: ₹500)
  try {
    const res = await getProducts({ minPrice: 200000, maxPrice: 50000 });
    const passed = Array.isArray(res.products) && res.total === 0 && res.products.length === 0;
    record(
      '1.4 getProducts: maxPrice < minPrice (₹2,000 to ₹500)',
      passed,
      `Returned clean empty state (total: ${res.total}). No constraint violation.`
    );
  } catch (err: any) {
    record('1.4 getProducts: maxPrice < minPrice', false, 'Threw exception', err.message);
  }

  // 1.5 Non-existent category slug
  try {
    const res = await getProducts({ category: 'non-existent-category-slug-xyz-987' });
    const passed = Array.isArray(res.products) && res.total === 0;
    record(
      '1.5 getProducts: non-existent category slug',
      passed,
      `Returned clean empty state (total: ${res.total}).`
    );
  } catch (err: any) {
    record('1.5 getProducts: non-existent category slug', false, 'Threw exception', err.message);
  }

  // 1.6 Special category 'all'
  try {
    const res = await getProducts({ category: 'all' });
    const passed = Array.isArray(res.products) && res.total > 0;
    record(
      '1.6 getProducts: category="all"',
      passed,
      `Treated "all" as unconstrained; returned ${res.total} total items.`
    );
  } catch (err: any) {
    record('1.6 getProducts: category="all"', false, 'Threw exception', err.message);
  }

  // 1.7 SQL Injection payload in search query 'q'
  try {
    const res = await getProducts({ q: "' OR '1'='1" });
    const passed = Array.isArray(res.products) && res.total === 0;
    record(
      '1.7 getProducts: SQL injection string in query ("\' OR \'1\'=\'1")',
      passed,
      `Safely parameterized query; returned ${res.total} matches, preventing unauthorized data disclosure.`
    );
  } catch (err: any) {
    record('1.7 getProducts: SQL injection in q', false, 'Threw exception', err.message);
  }

  // 1.8 XSS Script payload in search query 'q'
  try {
    const res = await getProducts({ q: "<script>alert('xss')</script>" });
    const passed = Array.isArray(res.products) && res.total === 0;
    record(
      '1.8 getProducts: XSS script in query ("<script>alert(\'xss\')</script>")',
      passed,
      `Safely queried; returned ${res.total} matches without execution.`
    );
  } catch (err: any) {
    record('1.8 getProducts: XSS script in q', false, 'Threw exception', err.message);
  }

  // 1.9 SQL Wildcard / percent character in search query 'q'
  try {
    const res = await getProducts({ q: '%' });
    const passed = Array.isArray(res.products);
    record(
      '1.9 getProducts: Wildcard character ("%")',
      passed,
      `Prisma handled % safely without breaking OR conditions (found ${res.total} products).`
    );
  } catch (err: any) {
    record('1.9 getProducts: Wildcard character ("%")', false, 'Threw exception', err.message);
  }

  // 1.10 Backslash and regex characters in search query 'q'
  try {
    const res = await getProducts({ q: '\\' });
    const passed = Array.isArray(res.products) && res.total === 0;
    record(
      '1.10 getProducts: Backslash character ("\\\\")',
      passed,
      `Handled escape character without syntax crash (found ${res.total} products).`
    );
  } catch (err: any) {
    record('1.10 getProducts: Backslash character', false, 'Threw exception', err.message);
  }

  // 1.11 Multi-byte Unicode / Emoji query in 'q'
  try {
    const res = await getProducts({ q: '🌸💐🌺' });
    const passed = Array.isArray(res.products);
    record(
      '1.11 getProducts: Unicode floral emojis ("🌸💐🌺")',
      passed,
      `Handled multi-byte unicode cleanly (found ${res.total} products).`
    );
  } catch (err: any) {
    record('1.11 getProducts: Unicode floral emojis', false, 'Threw exception', err.message);
  }

  // 1.12 Extremely long string in 'q' (buffer stress)
  try {
    const longQuery = 'crochet-flower-'.repeat(200); // 3,000 characters
    const res = await getProducts({ q: longQuery });
    const passed = Array.isArray(res.products) && res.total === 0;
    record(
      '1.12 getProducts: 3,000-character search query',
      passed,
      `Handled ultra-long search query cleanly (found ${res.total} products).`
    );
  } catch (err: any) {
    record('1.12 getProducts: 3,000-character search query', false, 'Threw exception', err.message);
  }

  // 1.13 Invalid sort value fallback
  try {
    const res = await getProducts({ sort: 'unsupported_sort_value' as any });
    const passed = Array.isArray(res.products) && res.total > 0;
    record(
      '1.13 getProducts: invalid sort value ("unsupported_sort_value")',
      passed,
      `Fell back gracefully to default featured order (found ${res.total} products).`
    );
  } catch (err: any) {
    record('1.13 getProducts: invalid sort value', false, 'Threw exception', err.message);
  }

  // 1.14 Negative page index
  try {
    const res = await getProducts({ page: -5 });
    const passed = res.page === 1 && res.products.length > 0;
    record(
      '1.14 getProducts: negative page index (page: -5)',
      passed,
      `Clamped page cleanly to ${res.page}.`
    );
  } catch (err: any) {
    record('1.14 getProducts: negative page index', false, 'Threw exception', err.message);
  }

  // 1.15 Extremely high page index (page: 999999)
  try {
    const res = await getProducts({ page: 999999 });
    const passed = res.products.length === 0 && res.total > 0;
    record(
      '1.15 getProducts: out-of-range page index (page: 999999)',
      passed,
      `Returned clean empty products array without crash (total: ${res.total}, totalPages: ${res.totalPages}).`
    );
  } catch (err: any) {
    record('1.15 getProducts: out-of-range page index', false, 'Threw exception', err.message);
  }

  // 1.16 Limit boundary: 0
  try {
    const res = await getProducts({ limit: 0 });
    const passed = res.limit >= 1 && res.products.length <= res.limit;
    record(
      '1.16 getProducts: limit = 0',
      passed,
      `Clamped safeLimit to ${res.limit}.`
    );
  } catch (err: any) {
    record('1.16 getProducts: limit = 0', false, 'Threw exception', err.message);
  }

  // 1.17 Limit boundary: excessive (1000)
  try {
    const res = await getProducts({ limit: 1000 });
    const passed = res.limit === 100;
    record(
      '1.17 getProducts: excessive limit (limit: 1000)',
      passed,
      `Capped safeLimit to maximum 100 to prevent DoS.`
    );
  } catch (err: any) {
    record('1.17 getProducts: excessive limit', false, 'Threw exception', err.message);
  }

  // 1.18 Category retrieval: invalid slug
  try {
    const cat = await getCategoryBySlug('non-existent-collection-slug-xyz');
    const passed = cat === null;
    record(
      '1.18 getCategoryBySlug: invalid slug',
      passed,
      `Returned null cleanly (triggering 404 in page component).`
    );
  } catch (err: any) {
    record('1.18 getCategoryBySlug: invalid slug', false, 'Threw exception', err.message);
  }

  // 1.19 Category retrieval: empty string
  try {
    const cat = await getCategoryBySlug('');
    const passed = cat === null;
    record(
      '1.19 getCategoryBySlug: empty slug string',
      passed,
      `Returned null cleanly.`
    );
  } catch (err: any) {
    record('1.19 getCategoryBySlug: empty slug string', false, 'Threw exception', err.message);
  }

  // 1.20 Category retrieval: XSS script tag
  try {
    const cat = await getCategoryBySlug('<script>alert(1)</script>');
    const passed = cat === null;
    record(
      '1.20 getCategoryBySlug: XSS string',
      passed,
      `Returned null cleanly without executing.`
    );
  } catch (err: any) {
    record('1.20 getCategoryBySlug: XSS string', false, 'Threw exception', err.message);
  }

  // 1.21 Product retrieval: invalid slug
  try {
    const prod = await getProductBySlug('non-existent-product-slug-xyz');
    const passed = prod === null;
    record(
      '1.21 getProductBySlug: invalid slug',
      passed,
      `Returned null cleanly (triggering 404 in page component).`
    );
  } catch (err: any) {
    record('1.21 getProductBySlug: invalid slug', false, 'Threw exception', err.message);
  }

  // 1.22 Product retrieval: directory traversal attempt
  try {
    const prod = await getProductBySlug('../../etc/passwd');
    const passed = prod === null;
    record(
      '1.22 getProductBySlug: path traversal attempt ("../../etc/passwd")',
      passed,
      `Returned null cleanly.`
    );
  } catch (err: any) {
    record('1.22 getProductBySlug: path traversal attempt', false, 'Threw exception', err.message);
  }

  // 1.23 getRelatedProducts: invalid currentProductId
  try {
    const related = await getRelatedProducts('invalid-product-id-999', 'non-existent-category-id', 'flowers', 4);
    const passed = Array.isArray(related);
    record(
      '1.23 getRelatedProducts: invalid product and category IDs',
      passed,
      `Returned array without crash (count: ${related.length}).`
    );
  } catch (err: any) {
    record('1.23 getRelatedProducts: invalid IDs', false, 'Threw exception', err.message);
  }

  // 1.24 getRelatedProducts: null/undefined/malformed tags
  try {
    const related = await getRelatedProducts('dummy-id', 'dummy-cat', ',,,,!!,,  ,,', 4);
    const passed = Array.isArray(related);
    record(
      '1.24 getRelatedProducts: malformed comma-separated tags',
      passed,
      `Filtered out empty tag fragments without syntax error.`
    );
  } catch (err: any) {
    record('1.24 getRelatedProducts: malformed tags', false, 'Threw exception', err.message);
  }

  // -------------------------------------------------------------------------
  // SUITE 2: Live HTTP Endpoint Stress Tests (against localhost:3000)
  // -------------------------------------------------------------------------
  console.log('\n>>> [SUITE 2] Live HTTP Route & Status Stress Tests (http://localhost:3000)\n');

  const BASE_URL = process.env.TEST_URL || 'http://localhost:3001';

  async function testHttp(
    label: string,
    path: string,
    expectedStatus: number | number[],
    validationFn: (status: number, body: string, headers: Headers) => boolean
  ) {
    const url = `${BASE_URL}${path}`;
    try {
      const res = await fetch(url, { method: 'GET' });
      const body = await res.text();
      const statusMatches = Array.isArray(expectedStatus)
        ? expectedStatus.includes(res.status)
        : res.status === expectedStatus;
      const passed = statusMatches && validationFn(res.status, body, res.headers);
      record(
        label,
        passed,
        `Status: ${res.status} (expected ${Array.isArray(expectedStatus) ? expectedStatus.join('/') : expectedStatus}). Body length: ${body.length} bytes.`
      );
    } catch (err: any) {
      record(label, false, `Network / fetch failed for ${path}`, err.message);
    }
  }

  // 2.1 Standard /shop
  await testHttp(
    '2.1 HTTP /shop (baseline)',
    '/shop',
    200,
    (status, body) => body.includes('Handcrafted Everlasting Bloom Catalog') && body.includes('Shop All')
  );

  // 2.2 Category filter: valid
  await testHttp(
    '2.2 HTTP /shop?category=bouquets',
    '/shop?category=bouquets',
    200,
    (status, body) => body.includes('bouquets') || body.includes('Bouquet')
  );

  // 2.3 Category filter: non-existent slug
  await testHttp(
    '2.3 HTTP /shop?category=non-existent-category-12345',
    '/shop?category=non-existent-category-12345',
    200,
    (status, body) =>
      body.includes('No Blooms Found Matching Your Criteria') ||
      body.includes('Showing 0 creations')
  );

  // 2.4 Category filter: XSS injection in query param
  await testHttp(
    '2.4 HTTP /shop?category=%3Cscript%3Ealert(1)%3C/script%3E',
    '/shop?category=%3Cscript%3Ealert(1)%3C/script%3E',
    200,
    (status, body) =>
      !body.includes('<script>alert(1)</script>') &&
      (body.includes('No Blooms Found Matching Your Criteria') || body.includes('Showing 0 creations'))
  );

  // 2.5 Search: non-existent item
  await testHttp(
    '2.5 HTTP /shop?q=supercalifragilistic-nonexistent-blossom',
    '/shop?q=supercalifragilistic-nonexistent-blossom',
    200,
    (status, body) =>
      body.includes('No Blooms Found Matching Your Criteria') &&
      body.includes('Clear All Filters')
  );

  // 2.6 Search: XSS script tag in query
  await testHttp(
    '2.6 HTTP /shop?q=%3Cscript%3Ealert(%22XSS%22)%3C/script%3E',
    '/shop?q=%3Cscript%3Ealert(%22XSS%22)%3C/script%3E',
    200,
    (status, body) =>
      !body.includes('<script>alert("XSS")</script>') &&
      body.includes('No Blooms Found Matching Your Criteria')
  );

  // 2.7 Search: SQL Injection payload in query
  await testHttp(
    '2.7 HTTP /shop?q=%27%20OR%20%271%27=%271',
    "/shop?q=' OR '1'='1",
    200,
    (status, body) =>
      body.includes('No Blooms Found Matching Your Criteria') ||
      body.includes('Showing 0 creations')
  );

  // 2.8 Search: Percent symbol query (%25)
  await testHttp(
    '2.8 HTTP /shop?q=%25',
    '/shop?q=%25',
    200,
    (status, body) => status === 200
  );

  // 2.9 Search: Multi-byte unicode / floral emojis
  await testHttp(
    '2.9 HTTP /shop?q=%F0%9F%8C%B8%F0%9F%92%90',
    '/shop?q=%F0%9F%8C%B8%F0%9F%92%90',
    200,
    (status, body) => status === 200
  );

  // 2.10 Price filter: Negative price (?minPrice=-500)
  await testHttp(
    '2.10 HTTP /shop?minPrice=-500',
    '/shop?minPrice=-500',
    200,
    (status, body) => status === 200 && !body.includes('Internal Server Error')
  );

  // 2.11 Price filter: Inverted range (?minPrice=2000&maxPrice=500)
  await testHttp(
    '2.11 HTTP /shop?minPrice=2000&maxPrice=500',
    '/shop?minPrice=2000&maxPrice=500',
    200,
    (status, body) =>
      body.includes('No Blooms Found Matching Your Criteria') ||
      body.includes('Showing 0 creations')
  );

  // 2.12 Price filter: Non-numeric strings (?minPrice=abc&maxPrice=xyz)
  await testHttp(
    '2.12 HTTP /shop?minPrice=abc&maxPrice=xyz',
    '/shop?minPrice=abc&maxPrice=xyz',
    200,
    (status, body) =>
      status === 200 &&
      body.includes('Handcrafted Everlasting Bloom Catalog') &&
      !body.includes('Internal Server Error')
  );

  // 2.13 Sort: Invalid sort parameter
  await testHttp(
    '2.13 HTTP /shop?sort=malicious_sort_inject',
    '/shop?sort=malicious_sort_inject',
    200,
    (status, body) =>
      status === 200 &&
      !body.includes('Internal Server Error')
  );

  // 2.14 Pagination: Invalid page parameter (?page=abc)
  await testHttp(
    '2.14 HTTP /shop?page=abc',
    '/shop?page=abc',
    200,
    (status, body) => status === 200
  );

  // 2.15 Pagination: Negative page parameter (?page=-10)
  await testHttp(
    '2.15 HTTP /shop?page=-10',
    '/shop?page=-10',
    200,
    (status, body) => status === 200
  );

  // 2.16 Availability: inStock=true
  await testHttp(
    '2.16 HTTP /shop?inStock=true',
    '/shop?inStock=true',
    200,
    (status, body) => status === 200 && body.includes('In Stock Only')
  );

  // 2.17 Availability: inStock with arbitrary string
  await testHttp(
    '2.17 HTTP /shop?inStock=random_string',
    '/shop?inStock=random_string',
    200,
    (status, body) => status === 200
  );

  // 2.18 Category Collection: Valid slug
  await testHttp(
    '2.18 HTTP /collections/bouquets (valid slug)',
    '/collections/bouquets',
    200,
    (status, body) =>
      body.includes('Bouquets') &&
      body.includes('Handcrafted Collection')
  );

  // 2.19 Category Collection: Invalid slug triggers Next.js notFound()
  await testHttp(
    '2.19 HTTP /collections/invalid-non-existent-collection-slug (invalid slug)',
    '/collections/invalid-non-existent-collection-slug',
    [200, 404],
    (status, body) =>
      body.includes('404') ||
      body.includes('This Bloom Seems to Have Wandered Off') ||
      body.includes('NEXT_NOT_FOUND')
  );

  // 2.20 Category Collection: XSS slug triggers Next.js notFound()
  await testHttp(
    '2.20 HTTP /collections/%3Cscript%3Ealert(1)%3C/script%3E (XSS slug)',
    '/collections/%3Cscript%3Ealert(1)%3C/script%3E',
    [200, 404],
    (status, body) => status === 404 || body.includes('404')
  );

  // 2.21 PDP: Valid product slug
  await testHttp(
    '2.21 HTTP /products/blushing-peony-rose-handcrafted-bouquet (valid slug)',
    '/products/blushing-peony-rose-handcrafted-bouquet',
    200,
    (status, body) =>
      body.includes('Blushing Peony') &&
      body.includes('Add to Bag') &&
      body.includes('Buy Now')
  );

  // 2.22 PDP: Invalid product slug triggers Next.js notFound()
  await testHttp(
    '2.22 HTTP /products/invalid-non-existent-product-slug (invalid slug)',
    '/products/invalid-non-existent-product-slug',
    [200, 404],
    (status, body) =>
      body.includes('404') ||
      body.includes('This Bloom Seems to Have Wandered Off') ||
      body.includes('NEXT_NOT_FOUND')
  );

  // 2.23 PDP: Path traversal attempt
  await testHttp(
    '2.23 HTTP /products/..%2F..%2Fadmin (traversal slug)',
    '/products/..%2F..%2Fadmin',
    [200, 404, 400],
    (status, body) =>
      status === 404 ||
      status === 400 ||
      body.includes('404') ||
      body.includes('NEXT_NOT_FOUND')
  );

  // -------------------------------------------------------------------------
  // SUMMARY AND VERDICT EVALUATION
  // -------------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log('  TEST EXECUTION SUMMARY');
  console.log('======================================================================');

  const totalTests = results.length;
  const passedTests = results.filter((r) => r.passed).length;
  const failedTests = results.filter((r) => !r.passed).length;

  console.log(`Total Scenarios: ${totalTests}`);
  console.log(`Passed:          ${passedTests}`);
  console.log(`Failed:          ${failedTests}`);

  if (failedTests === 0) {
    console.log('\n🎉 ALL ADVERSARIAL STRESS TESTS PASSED! VERDICT: APPROVE');
  } else {
    console.log(`\n⚠️ ${failedTests} TESTS FAILED! VERDICT: REJECT`);
    for (const failure of results.filter((r) => !r.passed)) {
      console.log(`- ${failure.name}: ${failure.details} ${failure.error ? `(${failure.error})` : ''}`);
    }
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

runSuite().catch((err) => {
  console.error('Fatal test suite exception:', err);
  process.exit(1);
});
