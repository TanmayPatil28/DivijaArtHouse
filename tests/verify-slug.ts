import { prisma } from '../src/lib/prisma';

async function verifySlugs() {
  const bad = await prisma.product.findUnique({
    where: { slug: 'celestial-twilight-jumbo-crochet-bouquet' },
  });
  const good = await prisma.product.findUnique({
    where: { slug: 'celestial-twilight-blossom-jumbo-bouquet' },
  });

  console.log('Bad slug result:', bad ? bad.name : 'null (NOT FOUND)');
  console.log('Good slug result:', good ? good.name : 'null (NOT FOUND)');

  // Verify all products in database
  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, isFeatured: true },
  });
  console.log(`Total seeded products in DB: ${allProducts.length}`);
  for (const p of allProducts) {
    console.log(`- [${p.id}] "${p.name}" -> /products/${p.slug}`);
  }

  await prisma.$disconnect();
}

verifySlugs().catch((err) => {
  console.error(err);
  process.exit(1);
});
