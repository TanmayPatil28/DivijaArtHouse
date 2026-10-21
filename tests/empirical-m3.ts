import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';
import { subscribeNewsletter } from '../src/actions/newsletter';
import { getFeaturedProducts } from '../src/lib/products';
import { getCategories } from '../src/lib/categories';
import { formatINR, calculateDiscount, parseJson } from '../src/lib/utils';

async function runM3Verification() {
  console.log('=== [M3 VERIFICATION RUN] ===\n');

  // 1. Verify Newsletter Server Action and DB Persistence
  console.log('1. Testing Newsletter Server Action & Database Persistence:');
  const testEmail = `tester-${Date.now()}@example.com`;
  
  // Clean up any test user if exists
  await prisma.subscriber.deleteMany({
    where: { email: { contains: 'tester-' } },
  });

  const formDataValid = new FormData();
  formDataValid.append('email', testEmail);
  formDataValid.append('source', 'homepage_test');

  const resValid = await subscribeNewsletter(null, formDataValid);
  console.log('  - Valid subscription result:', resValid);
  if (!resValid.success) {
    throw new Error(`Expected success for valid email, got: ${JSON.stringify(resValid)}`);
  }

  // Verify record in database
  const dbSubscriber = await prisma.subscriber.findUnique({
    where: { email: testEmail },
  });
  if (!dbSubscriber || dbSubscriber.email !== testEmail || !dbSubscriber.isActive) {
    throw new Error(`Subscriber was not persisted to database correctly: ${JSON.stringify(dbSubscriber)}`);
  }
  console.log('  - Database subscriber verified:', { id: dbSubscriber.id, email: dbSubscriber.email });

  // Test duplicate subscription
  const resDuplicate = await subscribeNewsletter(null, formDataValid);
  console.log('  - Duplicate subscription result:', resDuplicate);
  if (!resDuplicate.success || !resDuplicate.message.includes('already subscribed')) {
    throw new Error(`Expected duplicate notice, got: ${JSON.stringify(resDuplicate)}`);
  }

  // Test invalid email
  const formDataInvalid = new FormData();
  formDataInvalid.append('email', 'not-an-email');
  const resInvalid = await subscribeNewsletter(null, formDataInvalid);
  console.log('  - Invalid email result:', resInvalid);
  if (resInvalid.success || !resInvalid.message.includes('valid email')) {
    throw new Error(`Expected validation failure for invalid email, got: ${JSON.stringify(resInvalid)}`);
  }

  // Clean up test email
  await prisma.subscriber.deleteMany({
    where: { email: testEmail },
  });
  console.log('  ✓ Newsletter server action & MySQL persistence tests passed!\n');

  // 2. Verify Homepage Data Fetching
  console.log('2. Testing Homepage Data Fetching:');
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories({ activeOnly: true, includeProductsCount: true }),
  ]);

  console.log(`  - Featured products count: ${featured.length} (expected >= 4)`);
  if (featured.length < 4) {
    throw new Error(`Insufficient featured products: ${featured.length}`);
  }

  console.log(`  - Categories count: ${categories.length} (expected >= 6)`);
  if (categories.length < 6) {
    throw new Error(`Insufficient categories: ${categories.length}`);
  }

  // Verify product card data format
  for (const p of featured) {
    if (!p.name || !p.slug || !p.price || p.price <= 0) {
      throw new Error(`Invalid product data: ${JSON.stringify(p)}`);
    }
    const inr = formatINR(p.price);
    if (!inr.startsWith('₹')) {
      throw new Error(`formatINR failed on ${p.price}: ${inr}`);
    }
    const discount = calculateDiscount(p.price, p.compareAtPrice);
    if (p.compareAtPrice && p.compareAtPrice > p.price && discount <= 0) {
      throw new Error(`calculateDiscount failed on ${p.price} / ${p.compareAtPrice}: ${discount}`);
    }
  }
  console.log('  ✓ Homepage products and pricing calculations verified!\n');

  // 3. Verify Static Image Assets
  console.log('3. Verifying All Referenced Image Assets Exist on Disk:');
  const publicDir = path.resolve(process.cwd(), 'public');

  // Badges
  const badges = [
    'badges/razorpay.svg',
    'badges/upi.svg',
    'badges/cod.svg',
    'badges/secure.svg',
    'badges/handcrafted.svg',
    'badges/gifting.svg',
    'badges/presentation.svg',
    'badges/everlasting.svg',
  ];
  for (const b of badges) {
    const fullPath = path.join(publicDir, 'images', b);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing badge asset: ${fullPath}`);
    }
  }
  console.log(`  - Verified ${badges.length} badge image files.`);

  // Category images
  for (const cat of categories) {
    if (cat.image) {
      const rel = cat.image.replace(/^\//, '');
      const fullPath = path.join(publicDir, rel);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Missing category image asset: ${fullPath}`);
      }
    }
  }
  console.log(`  - Verified ${categories.length} category image files.`);

  // Product images in featured
  let checkedImages = 0;
  for (const prod of featured) {
    const images = parseJson<string[]>(prod.images, []);
    for (const img of images) {
      const rel = img.replace(/^\//, '');
      const fullPath = path.join(publicDir, rel);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Missing product image asset: ${fullPath}`);
      }
      checkedImages++;
    }
  }
  console.log(`  - Verified ${checkedImages} featured product image files.`);
  console.log('  ✓ All image assets exist on disk with zero broken paths!\n');

  // 4. Verify Component Files & Layout Structure
  console.log('4. Verifying Component Files:');
  const requiredFiles = [
    'src/actions/newsletter.ts',
    'src/components/layout/AnnouncementBar.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/MobileNavDrawer.tsx',
    'src/components/layout/SearchModal.tsx',
    'src/components/layout/Footer.tsx',
    'src/components/home/Hero.tsx',
    'src/components/home/ValueProps.tsx',
    'src/components/home/CollectionReel.tsx',
    'src/components/product/ProductCard.tsx',
    'src/components/home/BestsellersGrid.tsx',
    'src/components/home/OccasionSection.tsx',
    'src/components/home/FeaturedCollection.tsx',
    'src/components/home/BrandStory.tsx',
    'src/components/home/Testimonials.tsx',
    'src/components/home/NewsletterSection.tsx',
    'src/lib/cart-wishlist-client.ts',
    'src/app/layout.tsx',
    'src/app/page.tsx',
  ];

  for (const file of requiredFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Required file missing: ${file}`);
    }
    const stat = fs.statSync(fullPath);
    if (stat.size < 50) {
      throw new Error(`File is suspiciously small or empty: ${file}`);
    }
  }
  console.log(`  ✓ All ${requiredFiles.length} layout & homepage files exist and are populated!\n`);

  console.log('=== ALL M3 VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
}

runM3Verification()
  .catch((err) => {
    console.error('VERIFICATION FAILED:', err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
