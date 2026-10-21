import { formatINR, slugify, calculateDiscount, parseJson, formatDate, cn } from '../src/lib/utils';

console.log('=== STARTING ADVERSARIAL STRESS TESTS FOR UTILITIES ===\n');

// ---------------------------------------------------------------------------
// 1. formatINR STRESS TESTS
// ---------------------------------------------------------------------------
console.log('--- 1. Testing formatINR ---');

const inrCases: Array<{ label: string; input: number; options?: { showPaise?: boolean } }> = [
  // 0 paise
  { label: '0 paise (default)', input: 0 },
  { label: '0 paise (showPaise: true)', input: 0, options: { showPaise: true } },
  { label: 'Negative 0 paise', input: -0 },

  // 1 paise & fractional currency
  { label: '1 paise (default)', input: 1 },
  { label: '1 paise (showPaise: true)', input: 1, options: { showPaise: true } },
  { label: '10 paise (default)', input: 10 },
  { label: '10 paise (showPaise: true)', input: 10, options: { showPaise: true } },
  { label: '50 paise (default)', input: 50 },
  { label: '50 paise (showPaise: true)', input: 50, options: { showPaise: true } },
  { label: '99 paise (default)', input: 99 },
  { label: '99 paise (showPaise: true)', input: 99, options: { showPaise: true } },
  { label: '100 paise = 1 INR (default)', input: 100 },
  { label: '100 paise = 1 INR (showPaise: true)', input: 100, options: { showPaise: true } },
  { label: '101 paise (default)', input: 101 },
  { label: '150 paise (default)', input: 150 },
  { label: '150 paise (showPaise: true)', input: 150, options: { showPaise: true } },

  // Standard prices
  { label: 'Standard product ₹1,499.00 (149900 paise)', input: 149900 },
  { label: 'Standard product with paise ₹1,499.50 (149950 paise)', input: 149950, options: { showPaise: true } },

  // Negative amounts
  { label: 'Negative 1 paise (-1)', input: -1 },
  { label: 'Negative 1 paise (-1, showPaise: true)', input: -1, options: { showPaise: true } },
  { label: 'Negative 100 paise (-100 = -₹1)', input: -100 },
  { label: 'Negative product price (-149900)', input: -149900 },
  { label: 'Negative decimal amount (-149950, showPaise: true)', input: -149950, options: { showPaise: true } },

  // Large crore values
  { label: '1 Lakh INR (10,000,000 paise)', input: 10000000 },
  { label: '10 Lakh INR (100,000,000 paise)', input: 100000000 },
  { label: '1 Crore INR (1,000,000,000 paise)', input: 1000000000 },
  { label: '100 Crore INR (100,000,000,000 paise)', input: 100000000000 },
  { label: '1000 Crore INR (1,000,000,000,000 paise)', input: 1000000000000 },
  { label: 'Number.MAX_SAFE_INTEGER', input: Number.MAX_SAFE_INTEGER },

  // Boundary & abnormal values
  { label: 'NaN input', input: NaN },
  { label: 'Undefined input (coerced)', input: undefined as unknown as number },
  { label: 'Null input (coerced)', input: null as unknown as number },
  { label: 'Fractional paise input (1499.5 paise)', input: 1499.5 },
  { label: 'Infinity input', input: Infinity },
  { label: '-Infinity input', input: -Infinity },
];

for (const tc of inrCases) {
  try {
    const res = formatINR(tc.input, tc.options);
    console.log(`[PASS] ${tc.label} => input: ${tc.input} => result: "${res}"`);
  } catch (err: any) {
    console.log(`[FAIL] ${tc.label} => threw: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 2. slugify STRESS TESTS
// ---------------------------------------------------------------------------
console.log('\n--- 2. Testing slugify ---');

const slugCases: Array<{ label: string; input: any }> = [
  // Empty & whitespace
  { label: 'Empty string', input: '' },
  { label: 'Whitespace only (spaces)', input: '    ' },
  { label: 'Whitespace only (tabs/newlines)', input: '\t \n \r ' },
  { label: 'Hyphens only', input: '---' },
  { label: 'Hyphens with spaces', input: '  ---  ' },

  // Unicode characters
  { label: 'Hindi / Devanagari "दिविजा आर्ट हाउस"', input: 'दिविजा आर्ट हाउस' },
  { label: 'Mixed Hindi + English "दिविजा Crochet Bouquet"', input: 'दिविजा Crochet Bouquet' },
  { label: 'Accented Latin "Café au Lait Bouquet"', input: 'Café au Lait Bouquet' },
  { label: 'German Umlaut "Schön Rosenstrauß"', input: 'Schön Rosenstrauß' },
  { label: 'Japanese / Kanji "手作り 花束"', input: '手作り 花束' },
  { label: 'Emojis only "🌸💐🌹"', input: '🌸💐🌹' },
  { label: 'Mixed Emojis + Text "🌸 Pink Rose Bouquet 💐"', input: '🌸 Pink Rose Bouquet 💐' },

  // Special characters & punctuation
  { label: 'Ampersand "Peony & Rose"', input: 'Peony & Rose' },
  { label: 'Multiple ampersands "Peony && Rose & Hydrangea"', input: 'Peony && Rose & Hydrangea' },
  { label: 'Ampersand alone "&"', input: '&' },
  { label: 'Punctuation & symbols "!@#$%^*()+={}[]|:;<>,.?"', input: '!@#$%^*()+={}[]|:;<>,.?' },
  { label: 'Product name with dimensions "Mini Bouquet - 10" x 5""', input: 'Mini Bouquet - 10" x 5"' },
  { label: 'Underscores "crochet_flower_pot_red"', input: 'crochet_flower_pot_red' },
  { label: 'Multiple consecutive dashes and spaces "Red   Rose --- XL   "', input: 'Red   Rose --- XL   ' },
  { label: 'Leading & trailing punctuation "...Handmade Creation!..."', input: '...Handmade Creation!...' },
  { label: 'Number-heavy name "Set of 3 (2026 Edition) #1"', input: 'Set of 3 (2026 Edition) #1' },

  // Extreme inputs
  { label: 'Very long text (1000 chars)', input: 'Crochet Flower '.repeat(70) },
  { label: 'Null input (defensive check)', input: null },
  { label: 'Undefined input (defensive check)', input: undefined },
  { label: 'Numeric input', input: 12345 },
];

for (const tc of slugCases) {
  try {
    const res = slugify(tc.input);
    console.log(`[RESULT] ${tc.label} => input: ${JSON.stringify(tc.input)?.slice(0, 40)} => result: "${res}"`);
  } catch (err: any) {
    console.log(`[EXCEPTION] ${tc.label} => input: ${JSON.stringify(tc.input)} => threw: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 3. calculateDiscount STRESS TESTS
// ---------------------------------------------------------------------------
console.log('\n--- 3. Testing calculateDiscount ---');

const discountCases: Array<{ label: string; price: any; compareAtPrice: any }> = [
  // 0 paise
  { label: '0 price, 1000 compareAt (100% off)', price: 0, compareAtPrice: 1000 },
  { label: '0 price, 0 compareAt', price: 0, compareAtPrice: 0 },
  { label: '1000 price, 0 compareAt', price: 1000, compareAtPrice: 0 },

  // 1 paise difference & precision
  { label: '99 price, 100 compareAt (1% off)', price: 99, compareAtPrice: 100 },
  { label: '9999 price, 10000 compareAt (0.01% rounds to 0%)', price: 9999, compareAtPrice: 10000 },
  { label: '1 price, 2 compareAt (50% off)', price: 1, compareAtPrice: 2 },
  { label: '1 price, 1 compareAt (0% off)', price: 1, compareAtPrice: 1 },

  // Typical e-commerce prices (paise)
  { label: 'Standard product: 169900 vs 219900 (should be 23%)', price: 169900, compareAtPrice: 219900 },
  { label: 'Half price: 50000 vs 100000 (should be 50%)', price: 50000, compareAtPrice: 100000 },
  { label: 'Small discount: 189900 vs 199900 (should be 5%)', price: 189900, compareAtPrice: 199900 },
  { label: 'Equal prices: 149900 vs 149900 (0% off)', price: 149900, compareAtPrice: 149900 },
  { label: 'Price greater than compareAtPrice: 200000 vs 150000 (markup, should be 0%)', price: 200000, compareAtPrice: 150000 },

  // Large crore values
  { label: '80 Crore vs 100 Crore (20% off)', price: 80000000000, compareAtPrice: 100000000000 },
  { label: 'Max safe integer vs double', price: 4503599627370495, compareAtPrice: 9007199254740990 },

  // Negative amounts
  { label: 'Negative price: -100 vs 100', price: -100, compareAtPrice: 100 },
  { label: 'Negative compareAt: 100 vs -100', price: 100, compareAtPrice: -100 },
  { label: 'Both negative: -200 vs -100', price: -200, compareAtPrice: -100 },

  // Null, undefined, NaN, Infinity
  { label: 'null compareAtPrice', price: 149900, compareAtPrice: null },
  { label: 'undefined compareAtPrice', price: 149900, compareAtPrice: undefined },
  { label: 'NaN compareAtPrice', price: 149900, compareAtPrice: NaN },
  { label: 'NaN price', price: NaN, compareAtPrice: 219900 },
  { label: 'Both NaN', price: NaN, compareAtPrice: NaN },
  { label: 'Infinity compareAtPrice', price: 149900, compareAtPrice: Infinity },
  { label: 'Infinity price', price: Infinity, compareAtPrice: 219900 },
];

for (const tc of discountCases) {
  try {
    const res = calculateDiscount(tc.price, tc.compareAtPrice);
    console.log(`[RESULT] ${tc.label} => price: ${tc.price}, compareAt: ${tc.compareAtPrice} => result: ${res}`);
  } catch (err: any) {
    console.log(`[EXCEPTION] ${tc.label} => threw: ${err.message}`);
  }
}

console.log('\n=== END OF ADVERSARIAL STRESS TESTS ===');
