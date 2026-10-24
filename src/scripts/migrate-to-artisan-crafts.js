const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const REAL_CATEGORIES = [
  {
    name: 'OHP Sheets Rangoli',
    slug: 'ohp-sheets-rangoli',
    description:
      'Handcrafted reusable acrylic and OHP sheet rangolis adorned with lustrous kundan stones, pearls, and mirror work. Ready to place in seconds for festive celebrations.',
    image: '/images/categories/ohp-rangoli.svg',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Woolen Rangoli',
    slug: 'woolen-rangoli',
    description:
      'Artisan-knitted woolen yarn rangolis and fluffy pom-pom floor art. Soft, washable, vibrant, and everlasting for auspicious poojas, haldi ceremonies, and weddings.',
    image: '/images/categories/woolen-rangoli.svg',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Pipe Cleaner Crafts',
    slug: 'pipe-cleaner-crafts',
    description:
      'Exquisitely sculpted velvet chenille pipe cleaner creations: everlasting floral stems, desktop miniatures, hair accessories, and adorable artisanal gifts.',
    image: '/images/categories/pipe-cleaner.svg',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: 'Decore Crafts',
    slug: 'decore-crafts',
    description:
      'Handcrafted home and festive decor pieces: artisanal torans, festive wall hangings, embellished tealight holders, and handcrafted keepsakes.',
    image: '/images/categories/decore-crafts.svg',
    sortOrder: 4,
    isActive: true,
  },
];

const CRAFT_PRODUCTS = [
  // 1. OHP Sheets Rangoli
  {
    name: 'Royal Kundan & Pearl 7-Piece OHP Rangoli Set',
    slug: 'royal-kundan-pearl-7pc-ohp-rangoli-set',
    categorySlug: 'ohp-sheets-rangoli',
    price: 89900,
    compareAtPrice: 129900,
    description:
      'Exquisite 7-piece reusable designer rangoli crafted on transparent OHP acrylic sheets. Embellished with sparkling faceted kundan stones, faux pearls, and gold contour ribbons. Place in multiple modular arrangements around your pooja mandir or entryway.',
    details:
      'Material: Premium OHP transparency sheet, Kundan stones, pearls, gold lace. Set Includes: 1 Central Diya Medallion (6-inch) + 6 Paisley Leaf Petals. Reusable for years.',
    image: '/images/categories/ohp-rangoli.svg',
    isFeatured: true,
    tags: 'OHP Rangoli, Kundan, Pearl, Reusable, Diwali, Pooja',
  },
  {
    name: 'Peacock Feather Crystal Centerpiece OHP Rangoli',
    slug: 'peacock-feather-crystal-centerpiece-ohp-rangoli',
    categorySlug: 'ohp-sheets-rangoli',
    price: 119900,
    compareAtPrice: 159900,
    description:
      'Stunning peacock-inspired 9-piece OHP rangoli featuring royal blue, emerald green, and gold stones. Designed to shimmer brilliantly under festive diya lighting.',
    details:
      'Material: Laser-cut OHP sheet, peacock crystal stones, golden ball chain. Diameter: 14 inches when assembled. Washable with damp cloth.',
    image: '/images/categories/ohp-rangoli.svg',
    isFeatured: true,
    tags: 'Peacock Rangoli, OHP Rangoli, Crystal, Wedding, Festive',
  },
  {
    name: 'Shubh Labh Lotus Border Reusable OHP Rangoli',
    slug: 'shubh-labh-lotus-border-ohp-rangoli',
    categorySlug: 'ohp-sheets-rangoli',
    price: 69900,
    compareAtPrice: 99900,
    description:
      'Festive threshold rangoli designed to welcome positive energy into your home. Features Shubh-Labh motifs flanked by blooming pink and gold lotus petals on OHP sheets.',
    details:
      'Dimensions: 22-inch length border set. Includes central Shubh-Labh medallions. Lightweight, non-slip, and reusable.',
    image: '/images/categories/ohp-rangoli.svg',
    isFeatured: false,
    tags: 'Shubh Labh, Lotus, OHP Rangoli, Doorway, Housewarming',
  },
  {
    name: 'Traditional Diya Motif Round OHP Rangoli',
    slug: 'traditional-diya-motif-round-ohp-rangoli',
    categorySlug: 'ohp-sheets-rangoli',
    price: 54900,
    compareAtPrice: 79900,
    description:
      'Classic 5-piece round rangoli set featuring traditional deepak / diya motifs with ruby red and champagne gold stone borders. Perfect for compact apartment entryways.',
    details:
      'Set of 5 pieces. Diameter: 10 inches. Comes in a protective storage pouch.',
    image: '/images/categories/ohp-rangoli.svg',
    isFeatured: false,
    tags: 'Diya Rangoli, OHP Rangoli, Compact, Diwali, Gift',
  },

  // 2. Woolen Rangoli
  {
    name: 'Marigold & Rose Pom-Pom Festive Woolen Rangoli',
    slug: 'marigold-rose-pompom-festive-woolen-rangoli',
    categorySlug: 'woolen-rangoli',
    price: 99900,
    compareAtPrice: 139900,
    description:
      'Vibrant handcrafted woolen floor mandala created using plush pom-poms in auspicious marigold yellow, sindoor red, and bottle green. Soft underfoot, washable, and everlasting.',
    details:
      'Material: 100% Premium acrylic knitting yarn. Diameter: 18 inches. Hand-knitted by Indian women artisans. Gentle hand-washable.',
    image: '/images/categories/woolen-rangoli.svg',
    isFeatured: true,
    tags: 'Woolen Rangoli, Pom Pom, Marigold, Haldi, Genda Phool',
  },
  {
    name: 'Bridal Haldi Special Sunflower Woolen Floor Art',
    slug: 'bridal-haldi-special-sunflower-woolen-rangoli',
    categorySlug: 'woolen-rangoli',
    price: 129900,
    compareAtPrice: 169900,
    description:
      'Grand 24-inch sunflower motif floor rangoli crafted with dense woolen yarn rosettes. A showstopper centerpiece for wedding haldi ceremonies, mehendi rituals, and festive home entrances.',
    details:
      'Diameter: 24 inches. Anti-skid felt backing. Foldable and easy to store between festival seasons.',
    image: '/images/categories/woolen-rangoli.svg',
    isFeatured: true,
    tags: 'Bridal Haldi, Woolen Rangoli, Sunflower, Wedding Decor',
  },
  {
    name: 'Multi-Color Mandana Pattern Crochet Woolen Rangoli',
    slug: 'multi-color-mandana-crochet-woolen-rangoli',
    categorySlug: 'woolen-rangoli',
    price: 84900,
    compareAtPrice: 119900,
    description:
      'Traditional Rajasthani mandana pattern reimagined in fine woolen crochet. Intricate concentric circles in saffron, peacock blue, and ivory yarn.',
    details:
      'Material: Soft 4-ply woolen yarn. Diameter: 15 inches. Steam-blocked to lie flat on marble or wooden floors.',
    image: '/images/categories/woolen-rangoli.svg',
    isFeatured: false,
    tags: 'Mandana, Crochet Rangoli, Woolen, Rajasthani, Heritage',
  },
  {
    name: 'Auspicious Swastik & Kalash Woolen Pooja Floor Mat',
    slug: 'auspicious-swastik-kalash-woolen-pooja-mat',
    categorySlug: 'woolen-rangoli',
    price: 64900,
    compareAtPrice: 89900,
    description:
      'Sacred floor mat hand-crocheted in red and gold woolen yarn featuring the auspicious Swastik and Kalash symbol. Placed directly in front of your home temple altar.',
    details:
      'Size: 12 x 12 inches. High-density yarn weave. Non-slip grip backing.',
    image: '/images/categories/woolen-rangoli.svg',
    isFeatured: false,
    tags: 'Swastik, Kalash, Pooja Mat, Woolen, Mandir',
  },

  // 3. Pipe Cleaner Crafts
  {
    name: 'Everlasting Velvet Chenille Tulip Bouquet (6-Stem)',
    slug: 'velvet-chenille-tulip-bouquet-pipe-cleaner',
    categorySlug: 'pipe-cleaner-crafts',
    price: 79900,
    compareAtPrice: 109900,
    description:
      'Charming 6-stem bouquet of handcrafted tulips meticulously sculpted from plush velvet chenille pipe cleaners. Features gradient pastel pink, blush, and cream petals with flexible wire leaves wrapped in floral ribbon.',
    details:
      'Height: 11 inches. 6 Flexible stems. Wrapped in satin ribbon. Dust-resistant velvet chenille.',
    image: '/images/categories/pipe-cleaner.svg',
    isFeatured: true,
    tags: 'Pipe Cleaner Flowers, Chenille Tulip, Pastel Bouquet, Handcrafted Gifts',
  },
  {
    name: 'Pastel Sunflower & Lavender Pipe Cleaner Desk Pot',
    slug: 'pastel-sunflower-pipe-cleaner-desk-pot',
    categorySlug: 'pipe-cleaner-crafts',
    price: 59900,
    compareAtPrice: 79900,
    description:
      'Adorable mini desk pot filled with bright yellow chenille sunflowers, lavender sprigs, and baby daisies. The cheerful desktop companion that never needs water.',
    details:
      'Includes: Handcrafted ceramic pot with 5 velvet chenille floral stems. Height: 7 inches.',
    image: '/images/categories/pipe-cleaner.svg',
    isFeatured: true,
    tags: 'Desk Pot, Sunflower, Pipe Cleaner, Cute Gifts, Study Table',
  },
  {
    name: 'Artisanal Chenille Rose Hairclip & Brooch Pair',
    slug: 'artisanal-chenille-rose-hairclip-brooch',
    categorySlug: 'pipe-cleaner-crafts',
    price: 39900,
    compareAtPrice: 54900,
    description:
      'Delicate set of 2 hand-twisted velvet chenille rose accessories: one alligator hairclip and one dual brooch-pin in vintage rose and burgundy.',
    details:
      'Flower Diameter: 2.5 inches. Anti-snag metal clips. Perfect for festive ethnic hairstyles or saree pins.',
    image: '/images/categories/pipe-cleaner.svg',
    isFeatured: false,
    tags: 'Hairclip, Brooch, Chenille Rose, Hair Accessories, Handmade',
  },
  {
    name: 'Adorable Mini Cactus & Succulent Pipe Cleaner Trio',
    slug: 'mini-cactus-succulent-pipe-cleaner-trio',
    categorySlug: 'pipe-cleaner-crafts',
    price: 49900,
    compareAtPrice: 69900,
    description:
      'Trio of 3 miniature fuzzy cacti crafted from green chenille stems with tiny pink flower buds, nestled in terracotta pots.',
    details:
      'Set of 3 mini pots. Height: 3.5 inches each. Great gift for coworkers, friends, or kids rooms.',
    image: '/images/categories/pipe-cleaner.svg',
    isFeatured: false,
    tags: 'Succulents, Cactus, Pipe Cleaner, Desk Decor, Miniature',
  },

  // 4. Decore Crafts
  {
    name: 'Handcrafted Shubh Deepawali Toran Door Hanging',
    slug: 'handcrafted-shubh-deepawali-toran-hanging',
    categorySlug: 'decore-crafts',
    price: 89900,
    compareAtPrice: 129900,
    description:
      'Traditional festive entrance toran adorned with handcrafted fabric lotus blooms, golden beads, woolen pom-poms, and miniature brass ghungroo bells. Brings prosperity to your main doorway.',
    details:
      'Length: 38 inches (standard single door width). Hanging loops on both sides. Festive marigold, crimson, and gold palette.',
    image: '/images/categories/decore-crafts.svg',
    isFeatured: true,
    tags: 'Toran, Door Hanging, Festive Decor, Diwali, Entrance',
  },
  {
    name: 'Embellished Pearl & Mirror Tealight Candle Holder Set',
    slug: 'embellished-pearl-mirror-tealight-holders',
    categorySlug: 'decore-crafts',
    price: 59900,
    compareAtPrice: 79900,
    description:
      'Pair of 2 handcrafted floral tealight holders encircled by pearls, kundan gems, and mirror-work petals. Creates a mesmerizing warm glow on your center table or rangoli center.',
    details:
      'Set of 2 holders + 2 complimentary scented tealights included. Base Diameter: 5 inches.',
    image: '/images/categories/decore-crafts.svg',
    isFeatured: true,
    tags: 'Tealight Holder, Diya Decor, Mirror Work, Tabletop, Festive',
  },
  {
    name: 'Artisan Brass Bell & Thread Tassel Wall Hanging',
    slug: 'artisan-brass-bell-thread-tassel-wall-hanging',
    categorySlug: 'decore-crafts',
    price: 74900,
    compareAtPrice: 99900,
    description:
      'Vertical multi-tier wall hanging crafted with vibrant cotton thread tassels, mirror disks, and tuned solid brass bells that chime gently with the breeze.',
    details:
      'Height: 30 inches. Set of 2 hangings for doors or curtains. Handcrafted in Pune atelier.',
    image: '/images/categories/decore-crafts.svg',
    isFeatured: false,
    tags: 'Wall Hanging, Brass Bell, Tassels, Ethnic Decor, Curtain Tieback',
  },
  {
    name: 'Boho Floral Dreamcatcher Wall Art with Woolen Accents',
    slug: 'boho-floral-dreamcatcher-wall-art',
    categorySlug: 'decore-crafts',
    price: 69900,
    compareAtPrice: 94900,
    description:
      'Earthy bohemian wall hanging blending crochet mandalas, velvet pipe cleaner floral buds, and cascading woolen yarn strands with wooden beads.',
    details:
      'Ring Diameter: 8 inches. Total Length: 22 inches. Adds warmth and serenity to bedrooms and reading corners.',
    image: '/images/categories/decore-crafts.svg',
    isFeatured: false,
    tags: 'Dreamcatcher, Boho Decor, Wall Art, Woolen, Handmade',
  },
];

async function main() {
  console.log('--- Migrating Categories to 4 Real Craft Domains ---');

  // Deactivate old categories
  await prisma.category.updateMany({
    data: { isActive: false },
  });

  const categoryMap = {};

  for (const cat of REAL_CATEGORIES) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    let created;
    if (existing) {
      created = await prisma.category.update({
        where: { slug: cat.slug },
        data: {
          name: cat.name,
          description: cat.description,
          image: cat.image,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
      });
      console.log(`Updated category: ${cat.name}`);
    } else {
      created = await prisma.category.create({
        data: cat,
      });
      console.log(`Created category: ${cat.name}`);
    }
    categoryMap[cat.slug] = created.id;
  }

  console.log('--- Migrating & Seeding Authentic Craft Products ---');

  // Deactivate old products
  await prisma.product.updateMany({
    data: { isActive: false },
  });

  for (const prod of CRAFT_PRODUCTS) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) continue;

    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (existing) {
      await prisma.product.update({
        where: { slug: prod.slug },
        data: {
          name: prod.name,
          categoryId,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          description: prod.description,
          details: prod.details,
          images: JSON.stringify([prod.image]),
          isFeatured: prod.isFeatured,
          tags: prod.tags,
          isActive: true,
          stockQuantity: 25,
        },
      });
      console.log(`Updated product: ${prod.name}`);
    } else {
      await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          categoryId,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          description: prod.description,
          details: prod.details,
          images: JSON.stringify([prod.image]),
          isFeatured: prod.isFeatured,
          tags: prod.tags,
          isActive: true,
          stockQuantity: 25,
        },
      });
      console.log(`Created product: ${prod.name}`);
    }
  }

  console.log('Migration complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
