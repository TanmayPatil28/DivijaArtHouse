const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const p = await prisma.product.findFirst({
    where: { slug: 'royal-kundan-pearl-7pc-ohp-rangoli-set' }
  });
  if (p) {
    console.log('Found product:', p.name);
    await prisma.product.update({
      where: { id: p.id },
      data: {
        images: JSON.stringify(['/images/products/royal-kundan-ohp-rangoli-hero.png'])
      }
    });
    console.log('Successfully updated product image in database!');
  } else {
    console.log('Product royal-kundan-pearl-7pc-ohp-rangoli-set not found');
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
