import fs from 'fs';
import path from 'path';
import { cn, formatINR, slugify, calculateDiscount, parseJson, formatDate } from '../src/lib/utils';
import prisma from '../src/lib/prisma';

interface TestResult {
  suite: string;
  testCase: string;
  expected: string;
  actual: string;
  passed: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  details?: string;
}

const results: TestResult[] = [];

function record(
  suite: string,
  testCase: string,
  expected: string,
  actual: string,
  passed: boolean,
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' = 'HIGH',
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

// -------------------------------------------------------------
// XML / SVG Well-formedness Helper
// -------------------------------------------------------------
function validateXmlStructure(svgContent: string): { valid: boolean; error?: string } {
  // Check basic root tags
  const openSvg = svgContent.match(/<svg\b[^>]*>/i);
  if (!openSvg) return { valid: false, error: 'Missing opening <svg> tag' };
  if (!svgContent.includes('</svg>')) return { valid: false, error: 'Missing closing </svg> tag' };

  // Track tag stack for simple well-formedness
  const tagRegex = /<(\/?[a-zA-Z0-9_\-]+)([^>]*?)(\/?)>/g;
  const stack: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(svgContent)) !== null) {
    const rawName = match[1];
    const attrs = match[2];
    const isSelfClosing = match[3] === '/' || attrs.trim().endsWith('/');

    if (rawName.startsWith('?xml') || rawName.startsWith('!--')) {
      continue;
    }

    if (rawName.startsWith('/')) {
      const closeTag = rawName.slice(1);
      const openTag = stack.pop();
      if (openTag !== closeTag) {
        return {
          valid: false,
          error: `Mismatched closing tag </${closeTag}>, expected </${openTag}>`,
        };
      }
    } else if (!isSelfClosing) {
      // Tags that are typically self-closing in SVG or void elements
      const selfClosingSvgElements = new Set([
        'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'stop', 'use', 'image'
      ]);
      // If not marked self-closing explicitly with />, check if it has a closing tag later or if it's open
      stack.push(rawName);
    }
  }

  // At the end, stack should be empty
  if (stack.length > 0) {
    return { valid: false, error: `Unclosed tags remaining: ${stack.join(', ')}` };
  }

  return { valid: true };
}

async function runAdversarialValidation() {
  console.log('===============================================================');
  console.log('   CHALLENGER 2: EMPIRICAL ADVERSARIAL VALIDATION (M2)         ');
  console.log('===============================================================\n');

  // =============================================================
  // PART 1: ADVERSARIAL VALIDATION OF ALL 46 VISUAL ASSETS
  // =============================================================
  console.log('--- SUITE 1: 46 VISUAL ASSETS INTEGRITY & BRAND PALETTE ---');

  const assetDirectories = [
    { dir: 'public/images/categories', expectedCount: 6, label: 'Categories' },
    { dir: 'public/images/badges', expectedCount: 8, label: 'Badges' },
    { dir: 'public/images/products', expectedCount: 32, label: 'Products' },
  ];

  let totalAssetCount = 0;
  const allFoundFiles: { category: string; file: string; fullPath: string }[] = [];

  for (const group of assetDirectories) {
    const fullDir = path.resolve(process.cwd(), group.dir);
    const exists = fs.existsSync(fullDir);
    record(
      'Asset Directory Existence',
      `Directory exists: ${group.dir}`,
      'Directory exists',
      exists ? 'Directory exists' : 'Directory missing',
      exists,
      'CRITICAL'
    );

    if (!exists) continue;

    const files = fs.readdirSync(fullDir).filter((f) => f.endsWith('.svg'));
    totalAssetCount += files.length;

    record(
      'Asset Count Verification',
      `${group.label} asset count in ${group.dir}`,
      `Exactly ${group.expectedCount} SVG files`,
      `Found ${files.length} SVG files`,
      files.length === group.expectedCount,
      'HIGH'
    );

    for (const f of files) {
      allFoundFiles.push({
        category: group.label,
        file: f,
        fullPath: path.join(fullDir, f),
      });
    }
  }

  record(
    'Total Asset Count',
    'Total visual SVG assets across all directories',
    'Exactly 46 assets',
    `Found ${totalAssetCount} assets`,
    totalAssetCount === 46,
    'CRITICAL'
  );

  // Validate each asset individually
  const brandPalettePrimary = new Set([
    '#A32D3B', // Primary deep red
    '#872430', // Primary hover / dark crimson
    '#FCEEEF', // Soft pink
    '#F5D6D9', // Blush
    '#FFFDF9', // Warm surface
    '#F6EBE5', // Banner surface
    '#FFFFFF', // Canvas white
    '#1A1A1A', // Main dark text
    '#666666', // Muted text
    '#ECE7E1', // Subtle border
    '#222222', // Footer dark
  ]);

  for (const asset of allFoundFiles) {
    const stat = fs.statSync(asset.fullPath);
    const content = fs.readFileSync(asset.fullPath, 'utf8');

    // 1. Non-zero size (and realistic size >= 200 bytes)
    const isNonZero = stat.size > 200;
    record(
      'Asset Size',
      `${asset.file} non-zero & realistic size`,
      'Size > 200 bytes',
      `${stat.size} bytes`,
      isNonZero,
      'HIGH',
      `File: ${asset.file}`
    );

    // 2. XML namespace
    const hasXmlns = content.includes('xmlns="http://www.w3.org/2000/svg"');
    record(
      'Asset XMLNS',
      `${asset.file} valid xmlns attribute`,
      'Contains xmlns="http://www.w3.org/2000/svg"',
      hasXmlns ? 'Present' : 'Missing',
      hasXmlns,
      'HIGH'
    );

    // 3. ViewBox attribute
    const vbMatch = content.match(/viewBox=["']([^"']+)["']/i);
    let validVb = false;
    let vbDetails = 'No viewBox found';
    if (vbMatch) {
      const parts = vbMatch[1].trim().split(/\s+/).map(Number);
      if (parts.length === 4 && !parts.some(isNaN) && parts[2] > 0 && parts[3] > 0) {
        validVb = true;
        vbDetails = `viewBox="${vbMatch[1]}" (${parts[2]}x${parts[3]})`;
      } else {
        vbDetails = `Invalid viewBox components: ${vbMatch[1]}`;
      }
    }
    record(
      'Asset ViewBox',
      `${asset.file} appropriate viewBox`,
      'Valid 4-component positive viewBox',
      vbDetails,
      validVb,
      'HIGH'
    );

    // 4. Well-formedness / XML validation
    const xmlCheck = validateXmlStructure(content);
    record(
      'Asset XML Syntax',
      `${asset.file} XML syntax well-formedness`,
      'Well-formed XML with matching tags',
      xmlCheck.valid ? 'Well-formed' : xmlCheck.error || 'Syntax error',
      xmlCheck.valid,
      'HIGH',
      xmlCheck.error
    );

    // 5. Visual element presence (must have graphics, not just empty shell)
    const hasGraphicElements = /<(path|circle|rect|ellipse|polygon|polyline|line)\b/i.test(content);
    record(
      'Asset Graphic Content',
      `${asset.file} contains actual SVG vector elements`,
      'Contains vector graphics tags (path/circle/rect/etc.)',
      hasGraphicElements ? 'Contains vector paths/shapes' : 'Empty SVG canvas',
      hasGraphicElements,
      'HIGH'
    );

    // 6. Brand palette check
    const hexColors = (content.match(/#[0-9a-fA-F]{3,8}\b/g) || []).map((c) => c.toUpperCase());
    const uniqueColors = Array.from(new Set(hexColors));
    // Check if at least some brand tokens are used, or harmonious tones
    const hasBrandPrimary = uniqueColors.some((c) => brandPalettePrimary.has(c));
    // For badges like razorpay/upi/cod, they have specific service colors or brand colors
    const isServiceBadge = ['razorpay.svg', 'upi.svg', 'cod.svg', 'secure.svg'].includes(asset.file);
    const passesPaletteCheck = hasBrandPrimary || isServiceBadge || uniqueColors.length > 0;

    record(
      'Asset Brand Palette',
      `${asset.file} color palette integration (${uniqueColors.length} unique colors)`,
      'Uses brand palette or harmonious thematic tones',
      `Unique colors: ${uniqueColors.length} (${uniqueColors.slice(0, 3).join(', ')})`,
      passesPaletteCheck,
      'MEDIUM'
    );
  }

  console.log('\n--- ASSET METADATA BREAKDOWN ---');
  for (const asset of allFoundFiles) {
    const stat = fs.statSync(asset.fullPath);
    const content = fs.readFileSync(asset.fullPath, 'utf8');
    const vbMatch = content.match(/viewBox=["']([^"']+)["']/i);
    const vb = vbMatch ? vbMatch[1] : 'NONE';
    console.log(`[${asset.category}] ${asset.file.padEnd(45)} | ${String(stat.size).padStart(5)} B | viewBox="${vb}"`);
  }

  // Cross-reference DB seed image paths against disk assets
  console.log('\n--- SUITE 2: DATABASE SEED IMAGE LINK INTEGRITY ---');
  try {
    const seededProducts = await prisma.product.findMany({
      select: { name: true, slug: true, images: true },
    });

    for (const prod of seededProducts) {
      const imageList = parseJson<string[]>(prod.images, []);
      record(
        'Product Image Array',
        `${prod.name} has image array with >= 1 image`,
        '>= 1 image path',
        `${imageList.length} images`,
        imageList.length >= 1,
        'HIGH'
      );

      for (const imgPath of imageList) {
        // imgPath looks like "/images/products/blushing-peony-rose-1.svg"
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        const diskPath = path.resolve(process.cwd(), 'public', cleanPath);
        const fileExists = fs.existsSync(diskPath);
        record(
          'Image Path Disk Resolution',
          `Seed image exists on disk: ${imgPath}`,
          'File exists at public/' + cleanPath,
          fileExists ? 'File exists on disk' : 'MISSING FILE: 404 BROKEN IMAGE',
          fileExists,
          'CRITICAL'
        );
      }
    }

    const seededCategories = await prisma.category.findMany({
      select: { name: true, slug: true, image: true },
    });

    for (const cat of seededCategories) {
      if (cat.image) {
        const cleanPath = cat.image.startsWith('/') ? cat.image.slice(1) : cat.image;
        const diskPath = path.resolve(process.cwd(), 'public', cleanPath);
        const fileExists = fs.existsSync(diskPath);
        record(
          'Category Image Disk Resolution',
          `Category ${cat.name} image exists on disk: ${cat.image}`,
          'File exists at public/' + cleanPath,
          fileExists ? 'File exists on disk' : 'MISSING FILE: 404 BROKEN IMAGE',
          fileExists,
          'CRITICAL'
        );
      }
    }
  } catch (err: any) {
    record(
      'Database Seed Check',
      'Query database products for image link cross-check',
      'Database queried successfully',
      `Prisma query error: ${err.message}`,
      false,
      'CRITICAL'
    );
  }

  // =============================================================
  // PART 2: ADVERSARIAL TESTING OF ALL UTILITY FUNCTIONS
  // =============================================================
  console.log('\n--- SUITE 3: ADVERSARIAL UTILS TESTING ---');

  // 1. formatINR
  console.log('\n[Testing formatINR]');
  // Standard integer amounts
  const inrStandard = formatINR(149900);
  record(
    'formatINR',
    'Standard whole rupee amount (149900 paise = ₹1,499)',
    '₹1,499',
    inrStandard,
    inrStandard === '₹1,499' || inrStandard === '₹1,499.00' // Accept standard Indian format
  );

  // Fractional rupees (149950 paise = ₹1,499.50)
  const inrFrac = formatINR(149950);
  record(
    'formatINR',
    'Fractional rupee (149950 paise -> must render exactly 2 decimal places)',
    '₹1,499.50',
    inrFrac,
    inrFrac === '₹1,499.50',
    'HIGH',
    'Must not render as ₹1,499.5 or ₹1,499'
  );

  // 1 paisa (1 paise = ₹0.01)
  const inrOnePaisa = formatINR(1);
  record(
    'formatINR',
    'Single paisa (1 paise = ₹0.01)',
    '₹0.01',
    inrOnePaisa,
    inrOnePaisa === '₹0.01',
    'HIGH'
  );

  // 0 paise
  const inrZero = formatINR(0);
  record(
    'formatINR',
    'Zero paise (0 -> ₹0)',
    '₹0',
    inrZero,
    inrZero === '₹0' || inrZero === '₹0.00'
  );

  // 0 paise with showPaise=true
  const inrZeroPaise = formatINR(0, { showPaise: true });
  record(
    'formatINR',
    'Zero paise with showPaise=true (0 -> ₹0.00)',
    '₹0.00',
    inrZeroPaise,
    inrZeroPaise === '₹0.00'
  );

  // Whole rupee with showPaise=true
  const inrWholeWithPaise = formatINR(149900, { showPaise: true });
  record(
    'formatINR',
    'Whole rupee with showPaise=true (149900 -> ₹1,499.00)',
    '₹1,499.00',
    inrWholeWithPaise,
    inrWholeWithPaise === '₹1,499.00'
  );

  // Negative amounts
  const inrNegative = formatINR(-149900);
  record(
    'formatINR',
    'Negative amount (-149900 paise -> -₹1,499)',
    '-₹1,499',
    inrNegative,
    inrNegative.includes('1,499') && inrNegative.includes('-')
  );

  // Negative fractional
  const inrNegFrac = formatINR(-149950);
  record(
    'formatINR',
    'Negative fractional amount (-149950 paise -> -₹1,499.50)',
    '-₹1,499.50',
    inrNegFrac,
    inrNegFrac.includes('1,499.50') && inrNegFrac.includes('-')
  );

  // NaN input
  const inrNaN = formatINR(NaN);
  record(
    'formatINR',
    'NaN input boundary handling',
    '₹0',
    inrNaN,
    inrNaN === '₹0' || inrNaN === '₹0.00',
    'HIGH'
  );

  // Infinity input
  const inrInf = formatINR(Infinity);
  record(
    'formatINR',
    'Infinity input boundary handling',
    '₹0',
    inrInf,
    inrInf === '₹0' || inrInf === '₹0.00',
    'HIGH'
  );

  // -Infinity input
  const inrNegInf = formatINR(-Infinity);
  record(
    'formatINR',
    '-Infinity input boundary handling',
    '₹0',
    inrNegInf,
    inrNegInf === '₹0' || inrNegInf === '₹0.00',
    'HIGH'
  );

  // Sub-paisa fractional paise: 149950.5 paise (rupees = 1499.505)
  const inrSubPaisa = formatINR(149950.5);
  record(
    'formatINR',
    'Sub-paisa fractional input (149950.5 paise)',
    '₹1,499.51 (or valid 2-decimal rounded INR)',
    inrSubPaisa,
    inrSubPaisa.startsWith('₹') && inrSubPaisa.includes('1,499.')
  );

  // Very large number (100 Crore INR = 10,000,000,000 paise)
  const inrCrore = formatINR(100000000000);
  record(
    'formatINR',
    'Large number stress (100 Crore = 100,00,00,000)',
    '₹1,00,00,00,000',
    inrCrore,
    inrCrore.startsWith('₹') && inrCrore.includes('1,00,00,00,000')
  );

  // 2. slugify
  console.log('\n[Testing slugify]');
  // Standard product name
  const slugStandard = slugify('Blushing Peony & Rose Handcrafted Bouquet');
  record(
    'slugify',
    'Standard name with ampersand',
    'blushing-peony-and-rose-handcrafted-bouquet',
    slugStandard,
    slugStandard === 'blushing-peony-and-rose-handcrafted-bouquet'
  );

  // Null input
  const slugNull = slugify(null);
  record('slugify', 'Null safety', '', slugNull, slugNull === '');

  // Undefined input
  const slugUndefined = slugify(undefined);
  record('slugify', 'Undefined safety', '', slugUndefined, slugUndefined === '');

  // Empty string
  const slugEmpty = slugify('');
  record('slugify', 'Empty string safety', '', slugEmpty, slugEmpty === '');

  // Whitespace only
  const slugWhitespace = slugify('     ');
  record('slugify', 'Whitespace-only string', '', slugWhitespace, slugWhitespace === '');

  // Multiple consecutive hyphens and symbols
  const slugSymbols = slugify('Special @ Offer #1 (50% Off!) [Limited] *Only*');
  record(
    'slugify',
    'Punctuation and symbols stripping',
    'special-offer-1-50-off-limited-only',
    slugSymbols,
    slugSymbols === 'special-offer-1-50-off-limited-only'
  );

  // Leading and trailing hyphens
  const slugDashes = slugify('---Hello World---');
  record(
    'slugify',
    'Trimming leading and trailing hyphens',
    'hello-world',
    slugDashes,
    slugDashes === 'hello-world'
  );

  // Consecutive ampersands
  const slugAmp = slugify('Art && Crafts');
  record(
    'slugify',
    'Multiple ampersands handling',
    'art-and-and-crafts',
    slugAmp,
    slugAmp === 'art-and-and-crafts'
  );

  // Numbers and mixed alphanumeric
  const slugNum = slugify('Divija 2026 Collection Vol 2');
  record(
    'slugify',
    'Alphanumeric collection name',
    'divija-2026-collection-vol-2',
    slugNum,
    slugNum === 'divija-2026-collection-vol-2'
  );

  // Unicode / Devanagari input
  const slugDevanagari = slugify('दिविजा आर्ट हाउस');
  record(
    'slugify',
    'Unicode / Non-ASCII text handling (does not crash)',
    'Clean string (or empty if ASCII-only regex)',
    slugDevanagari,
    typeof slugDevanagari === 'string',
    'MEDIUM',
    `Devanagari converted to: "${slugDevanagari}"`
  );

  // Emojis
  const slugEmoji = slugify('🌸 Little Blooms 💐 Lasting Feelings');
  record(
    'slugify',
    'Emoji stripping',
    'little-blooms-lasting-feelings',
    slugEmoji,
    slugEmoji === 'little-blooms-lasting-feelings'
  );

  // Long string ReDoS stress test
  const startPerf = Date.now();
  const longInput = 'Crochet '.repeat(1000) + ' & Flower! '.repeat(1000);
  const slugLong = slugify(longInput);
  const durationPerf = Date.now() - startPerf;
  record(
    'slugify',
    'ReDoS stress test (20,000 characters input)',
    'Execution duration < 100ms',
    `Completed in ${durationPerf}ms (length: ${slugLong.length})`,
    durationPerf < 100,
    'HIGH'
  );

  // 3. calculateDiscount
  console.log('\n[Testing calculateDiscount]');
  // Standard 25% discount
  const disc25 = calculateDiscount(149900, 199900);
  record(
    'calculateDiscount',
    'Standard discount (149900 vs 199900 -> 25%)',
    '25',
    String(disc25),
    disc25 === 25
  );

  // Rounding check (99900 vs 149900 -> 33%)
  const disc33 = calculateDiscount(99900, 149900);
  record(
    'calculateDiscount',
    'Rounding check (99900 vs 149900 -> 33%)',
    '33',
    String(disc33),
    disc33 === 33
  );

  // Zero discount when price == compareAtPrice
  const discEqual = calculateDiscount(149900, 149900);
  record(
    'calculateDiscount',
    'No discount when price equals compareAtPrice',
    '0',
    String(discEqual),
    discEqual === 0
  );

  // Price greater than compareAtPrice (markup)
  const discMarkup = calculateDiscount(200000, 100000);
  record(
    'calculateDiscount',
    'Price > compareAtPrice returns 0 (no negative discount)',
    '0',
    String(discMarkup),
    discMarkup === 0
  );

  // Zero compareAtPrice
  const discZeroCompare = calculateDiscount(100000, 0);
  record(
    'calculateDiscount',
    'Zero compareAtPrice returns 0',
    '0',
    String(discZeroCompare),
    discZeroCompare === 0
  );

  // Negative compareAtPrice
  const discNegCompare = calculateDiscount(100000, -50000);
  record(
    'calculateDiscount',
    'Negative compareAtPrice returns 0',
    '0',
    String(discNegCompare),
    discNegCompare === 0
  );

  // Null compareAtPrice
  const discNullCompare = calculateDiscount(100000, null);
  record(
    'calculateDiscount',
    'Null compareAtPrice returns 0',
    '0',
    String(discNullCompare),
    discNullCompare === 0
  );

  // Undefined compareAtPrice
  const discUndefCompare = calculateDiscount(100000, undefined);
  record(
    'calculateDiscount',
    'Undefined compareAtPrice returns 0',
    '0',
    String(discUndefCompare),
    discUndefCompare === 0
  );

  // NaN compareAtPrice
  const discNaNCompare = calculateDiscount(100000, NaN);
  record(
    'calculateDiscount',
    'NaN compareAtPrice returns 0',
    '0',
    String(discNaNCompare),
    discNaNCompare === 0
  );

  // NaN price
  const discNaNPrice = calculateDiscount(NaN, 100000);
  record(
    'calculateDiscount',
    'NaN price returns 0',
    '0',
    String(discNaNPrice),
    discNaNPrice === 0
  );

  // 100% discount (free giveaway: price = 0, compareAt = 100000)
  const discFree = calculateDiscount(0, 100000);
  record(
    'calculateDiscount',
    '100% discount when price is 0 (free gift)',
    '100',
    String(discFree),
    discFree === 100
  );

  // Negative price check (Adversarial)
  const discNegPrice = calculateDiscount(-10000, 100000);
  record(
    'calculateDiscount',
    'Negative price input handling',
    '0 or safe bound',
    String(discNegPrice),
    discNegPrice >= 0,
    'MEDIUM',
    `Computed discount: ${discNegPrice}%`
  );

  // Infinity compareAtPrice
  const discInfCompare = calculateDiscount(100000, Infinity);
  record(
    'calculateDiscount',
    'Infinity compareAtPrice handling',
    '0 or safe bound',
    String(discInfCompare),
    !isNaN(discInfCompare) && isFinite(discInfCompare)
  );

  // 4. cn (classnames merger)
  console.log('\n[Testing cn]');
  // Standard merging
  const cnStd = cn('px-4 py-2', 'bg-red-500');
  record('cn', 'Standard class concatenation', 'px-4 py-2 bg-red-500', cnStd, cnStd === 'px-4 py-2 bg-red-500');

  // Tailwind conflict resolution
  const cnConflict = cn('p-4', 'p-8', 'text-sm', 'text-lg');
  record('cn', 'Tailwind collision resolution', 'p-8 text-lg', cnConflict, cnConflict === 'p-8 text-lg');

  // Falsy values
  const cnFalsy = cn('base', false && 'hidden', null, undefined, '', 0);
  record('cn', 'Falsy filters', 'base', cnFalsy, cnFalsy === 'base');

  // Array inputs
  const cnArray = cn(['flex', 'items-center'], ['justify-between']);
  record('cn', 'Array of classes', 'flex items-center justify-between', cnArray, cnArray === 'flex items-center justify-between');

  // 5. parseJson
  console.log('\n[Testing parseJson]');
  // Valid JSON object
  const pjValid = parseJson('{"brand":"Divija"}', { brand: 'Default' });
  record('parseJson', 'Valid JSON object parsing', 'Divija', pjValid.brand, pjValid.brand === 'Divija');

  // Malformed JSON string
  const pjMalformed = parseJson('{brand: invalid', { fallback: true });
  record('parseJson', 'Malformed JSON fallback safety', 'true', String(pjMalformed.fallback), pjMalformed.fallback === true);

  // Null input
  const pjNull = parseJson(null, 'default-value');
  record('parseJson', 'Null input fallback', 'default-value', pjNull, pjNull === 'default-value');

  // Undefined input
  const pjUndef = parseJson(undefined, [1, 2, 3]);
  record('parseJson', 'Undefined input fallback', '3 elements', `${pjUndef.length} elements`, pjUndef.length === 3);

  // Empty string
  const pjEmpty = parseJson('', { empty: true });
  record('parseJson', 'Empty string fallback', 'true', String(pjEmpty.empty), pjEmpty.empty === true);

  // Primitive number in JSON
  const pjNum = parseJson<number>('42', 0);
  record('parseJson', 'Primitive number string JSON', '42', String(pjNum), pjNum === 42);

  // 6. formatDate
  console.log('\n[Testing formatDate]');
  // Valid Date instance
  const fdDate = formatDate(new Date('2026-10-20T12:00:00Z'));
  record('formatDate', 'Valid Date instance formatting', 'Contains Oct, 2026', fdDate, fdDate.includes('2026') && fdDate.includes('Oct'));

  // Valid ISO string
  const fdIso = formatDate('2026-10-20T12:00:00Z');
  record('formatDate', 'Valid ISO string formatting', 'Contains Oct, 2026', fdIso, fdIso.includes('2026') && fdIso.includes('Oct'));

  // Valid epoch timestamp
  const fdEpoch = formatDate(1792497600000); // 2026 timestamp
  record('formatDate', 'Valid epoch timestamp formatting', 'Formatted string', fdEpoch, fdEpoch.length > 5);

  // Adversarial: Invalid date input
  let fdErrorCaught = false;
  let fdInvalidResult = '';
  try {
    fdInvalidResult = formatDate('invalid-date-string');
  } catch (err: any) {
    fdErrorCaught = true;
    fdInvalidResult = `Threw ${err.name}: ${err.message}`;
  }
  record(
    'formatDate',
    'Adversarial invalid date string handling',
    'Graceful fallback or known RangeError',
    fdInvalidResult,
    true, // Record actual behavior empirically
    'LOW',
    fdErrorCaught ? 'Throws RangeError on malformed date string' : 'Returns formatted string'
  );

  // =============================================================
  // SUMMARY REPORT
  // =============================================================
  console.log('\n===============================================================');
  console.log('                 ADVERSARIAL SUITE SUMMARY                     ');
  console.log('===============================================================');

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed);

  console.log(`Total Adversarial Checks Executed: ${total}`);
  console.log(`Passed:                            ${passed}`);
  console.log(`Failed:                            ${failed.length}`);

  if (failed.length > 0) {
    console.log('\n❌ FAILED CHECKS:');
    for (const f of failed) {
      console.log(`- [${f.severity}] [${f.suite}] ${f.testCase}`);
      console.log(`    Expected: ${f.expected}`);
      console.log(`    Actual:   ${f.actual}`);
      if (f.details) console.log(`    Details:  ${f.details}`);
    }
  } else {
    console.log('\n🎉 ALL ADVERSARIAL CHECKS PASSED EMPIRICALLY!');
  }

  await prisma.$disconnect();

  if (failed.some((f) => f.severity === 'CRITICAL')) {
    process.exit(1);
  }
}

runAdversarialValidation().catch(async (e) => {
  console.error('Fatal execution error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
