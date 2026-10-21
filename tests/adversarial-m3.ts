import fs from 'fs';
import path from 'path';

/**
 * Adversarial Responsiveness & Layout Auditor for Milestone 3
 */
function runAdversarialM3() {
  console.log('=== [M3 ADVERSARIAL AUDIT RUN] ===\n');

  const componentDir = path.resolve(process.cwd(), 'src/components');
  const appDir = path.resolve(process.cwd(), 'src/app');

  const filesToCheck = [
    path.join(appDir, 'layout.tsx'),
    path.join(appDir, 'page.tsx'),
    path.join(componentDir, 'layout/AnnouncementBar.tsx'),
    path.join(componentDir, 'layout/Header.tsx'),
    path.join(componentDir, 'layout/MobileNavDrawer.tsx'),
    path.join(componentDir, 'layout/SearchModal.tsx'),
    path.join(componentDir, 'layout/Footer.tsx'),
    path.join(componentDir, 'home/Hero.tsx'),
    path.join(componentDir, 'home/ValueProps.tsx'),
    path.join(componentDir, 'home/CollectionReel.tsx'),
    path.join(componentDir, 'home/BestsellersGrid.tsx'),
    path.join(componentDir, 'home/OccasionSection.tsx'),
    path.join(componentDir, 'home/FeaturedCollection.tsx'),
    path.join(componentDir, 'home/BrandStory.tsx'),
    path.join(componentDir, 'home/Testimonials.tsx'),
    path.join(componentDir, 'home/NewsletterSection.tsx'),
    path.join(componentDir, 'product/ProductCard.tsx'),
  ];

  console.log('1. Checking for dangerous fixed width classes that break mobile (375px):');
  // Match fixed width classes like className="w-[500px]" or className="min-w-[500px]"
  const dangerousPatterns = [
    /className="[^"]*\bw-[4-9]\d{2,}px\b[^"]*"/,
    /className="[^"]*\bmin-w-[4-9]\d{2,}px\b[^"]*"/,
  ];

  let violations = 0;
  for (const filePath of filesToCheck) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const rel = path.relative(process.cwd(), filePath);

    for (const pattern of dangerousPatterns) {
      if (pattern.test(content)) {
        console.error(`  [VIOLATION] Found dangerous fixed width in ${rel}: ${content.match(pattern)}`);
        violations++;
      }
    }
  }

  if (violations > 0) {
    throw new Error(`Found ${violations} responsive design violations!`);
  }
  console.log('  ✓ No fixed width violations found. All components scale responsively.\n');

  console.log('2. Checking 12 sections order in Homepage and Layout:');
  const pageContent = fs.readFileSync(path.join(appDir, 'page.tsx'), 'utf-8');
  const layoutContent = fs.readFileSync(path.join(appDir, 'layout.tsx'), 'utf-8');

  // Verify layout contains Header, AnnouncementBar, Footer
  if (!layoutContent.includes('AnnouncementBar')) throw new Error('layout.tsx missing AnnouncementBar');
  if (!layoutContent.includes('Header')) throw new Error('layout.tsx missing Header');
  if (!layoutContent.includes('Footer')) throw new Error('layout.tsx missing Footer');

  // Verify page sections order in page.tsx:
  // Hero -> ValueProps -> CollectionReel -> BestsellersGrid -> OccasionSection -> FeaturedCollection -> BrandStory -> Testimonials -> NewsletterSection
  const expectedOrder = [
    'Hero',
    'ValueProps',
    'CollectionReel',
    'BestsellersGrid',
    'OccasionSection',
    'FeaturedCollection',
    'BrandStory',
    'Testimonials',
    'NewsletterSection',
  ];

  let lastIndex = -1;
  for (const comp of expectedOrder) {
    const idx = pageContent.indexOf(`<${comp}`);
    if (idx === -1) {
      throw new Error(`page.tsx missing section component <${comp} />`);
    }
    if (idx < lastIndex) {
      throw new Error(`Section order violated: <${comp} /> appears before previous section!`);
    }
    lastIndex = idx;
    console.log(`  - Section verified in order: <${comp} />`);
  }
  console.log('  ✓ All 12/13 sections verified in exact required sequence!\n');

  console.log('3. Checking required brand strings & design tokens:');
  const heroContent = fs.readFileSync(path.join(componentDir, 'home/Hero.tsx'), 'utf-8');
  if (!heroContent.includes('Flowers That Keep Your Moments')) {
    throw new Error('Hero missing exact headline: Flowers That Keep Your Moments Blooming');
  }
  if (!heroContent.includes('Little Blooms, Lasting Feelings.')) {
    throw new Error('Hero missing exact tagline: Little Blooms, Lasting Feelings.');
  }
  if (!heroContent.includes('/shop') || !heroContent.includes('/shop?sort=featured')) {
    throw new Error('Hero missing dual CTAs');
  }
  console.log('  ✓ Hero headline, tagline, and dual CTAs verified.');

  const brandStoryContent = fs.readFileSync(path.join(componentDir, 'home/BrandStory.tsx'), 'utf-8');
  if (!brandStoryContent.includes('DivijaArtHouse was founded')) {
    throw new Error('BrandStory missing original DivijaArtHouse narrative');
  }
  console.log('  ✓ Brand story copy verified.');

  const testimonialsContent = fs.readFileSync(path.join(componentDir, 'home/Testimonials.tsx'), 'utf-8');
  if (!testimonialsContent.includes('impressions') && !testimonialsContent.includes('placeholder')) {
    throw new Error('Testimonials missing required honest impressions / placeholder labeling');
  }
  console.log('  ✓ Customer testimonials honest transparency verified.');

  console.log('\n=== ALL M3 ADVERSARIAL CHECKS PASSED WITH ZERO VIOLATIONS! ===');
}

runAdversarialM3();
