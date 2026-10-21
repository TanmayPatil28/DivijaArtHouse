import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DivijaArtHouse database seeding...');

  // ---------------------------------------------------------------------------
  // 1. Seed Categories (6 Categories)
  // ---------------------------------------------------------------------------
  console.log('Seeding categories...');
  const categoriesData = [
    {
      name: 'Bouquets',
      slug: 'bouquets',
      description:
        'Everlasting handcrafted floral bouquets crocheted with premium soft cotton yarn. Thoughtfully bundled for anniversaries, birthdays, and cherished moments.',
      image: '/images/categories/bouquets.svg',
      sortOrder: 1,
      isActive: true,
    },
    {
      name: 'Jumbo Bouquets',
      slug: 'jumbo-bouquets',
      description:
        'Grand, 24-stem statement floral bunches designed for landmark milestones, proposals, and luxury gifting that never wilts.',
      image: '/images/categories/jumbo-bouquets.svg',
      sortOrder: 2,
      isActive: true,
    },
    {
      name: 'Flower Pots',
      slug: 'flower-pots',
      description:
        'Charming potted crochet blooms nestled in handcrafted ceramic and terracotta pots for study desks, workspaces, and sunny corners.',
      image: '/images/categories/flower-pots.svg',
      sortOrder: 3,
      isActive: true,
    },
    {
      name: 'Gift Boxes',
      slug: 'gift-boxes',
      description:
        'Bespoke artisanal hampers combining everlasting crochet blooms with artisanal scented candles, wooden keepsake chests, and greeting notes.',
      image: '/images/categories/gift-boxes.svg',
      sortOrder: 4,
      isActive: true,
    },
    {
      name: 'Hair Accessories',
      slug: 'hair-accessories',
      description:
        'Delicate floral crochet hairpins, French claw clips, and cottagecore headbands hand-stitched for everyday elegance.',
      image: '/images/categories/hair-accessories.svg',
      sortOrder: 5,
      isActive: true,
    },
    {
      name: 'Character Gifts',
      slug: 'character-gifts',
      description:
        'Whimsical crochet amigurumi plush mascots and adorable floral companions handcrafted to bring joyful smiles to children and adults alike.',
      image: '/images/categories/character-gifts.svg',
      sortOrder: 6,
      isActive: true,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }
  console.log(`✅ Seeded ${categoryMap.size} categories.`);

  // ---------------------------------------------------------------------------
  // 2. Seed Products (16 Handcrafted Items with Variants)
  // ---------------------------------------------------------------------------
  console.log('Seeding handcrafted crochet products & variants...');

  const productsData = [
    {
      name: 'Blushing Peony & Rose Handcrafted Bouquet',
      slug: 'blushing-peony-rose-handcrafted-bouquet',
      categorySlug: 'bouquets',
      description:
        'A romantic symphony of delicate blush peonies and velvety garden roses, meticulously crocheted by master artisans using premium milk cotton yarn. Wrapped in layered matte kraft paper with silk ribbon.',
      details:
        'Height: 38 cm | Yarn: 100% Milk Cotton | Includes: 3 Peonies, 4 Roses, 2 Eucalyptus Stems | Care: Gently dust with soft dry brush. Keep away from direct water.',
      price: 169900, // ₹1,699
      compareAtPrice: 219900, // ₹2,199 (MRP)
      stockQuantity: 18,
      isFeatured: true,
      tags: 'bouquets,peony,rose,romantic,anniversary,bestseller',
      images: JSON.stringify([
        '/images/products/blushing-peony-rose-1.svg',
        '/images/products/blushing-peony-rose-2.svg',
      ]),
      variants: [
        {
          name: 'Blush Pink (Standard)',
          sku: 'BPR-BP-STD',
          priceAdjustment: 0,
          stockQuantity: 10,
        },
        {
          name: 'Ivory Cream (Luxe Wrap)',
          sku: 'BPR-IC-LUX',
          priceAdjustment: 20000, // +₹200
          stockQuantity: 8,
        },
      ],
    },
    {
      name: 'Eternal Sunshine Crochet Sunflower Bouquet',
      slug: 'eternal-sunshine-crochet-sunflower-bouquet',
      categorySlug: 'bouquets',
      description:
        'Radiate joy with vibrant golden sunflowers that never wilt. Hand-stitched with organic cotton yarn and complemented by delicate baby’s breath sprigs, this bouquet brings warmth to any celebration.',
      details:
        "Height: 35 cm | Yarn: 100% Organic Cotton | Includes: 3 Large Sunflowers, 4 Baby's Breath sprigs, Craft Paper Wrap | Care: Keep indoors, clean with gentle duster.",
      price: 149900, // ₹1,499
      compareAtPrice: 189900, // ₹1,899
      stockQuantity: 24,
      isFeatured: true,
      tags: 'bouquets,sunflower,graduation,cheer,birthday,bestseller',
      images: JSON.stringify([
        '/images/products/eternal-sunshine-sunflower-1.svg',
        '/images/products/eternal-sunshine-sunflower-2.svg',
      ]),
      variants: [
        {
          name: 'Classic Gold Wrap',
          sku: 'ESS-CGW-STD',
          priceAdjustment: 0,
          stockQuantity: 14,
        },
        {
          name: 'Pastel Meadow Wrap',
          sku: 'ESS-PMW-STD',
          priceAdjustment: 10000,
          stockQuantity: 10,
        },
      ],
    },
    {
      name: 'Lavender Dreams Everlasting Wildflower Bunch',
      slug: 'lavender-dreams-everlasting-wildflower-bunch',
      categorySlug: 'bouquets',
      description:
        'A soothing pastel bouquet featuring lavender sprigs, meadow bluebells, and chamomile florets. Crafted with ultra-soft combed cotton for a calming touch on bedside stands.',
      details:
        'Height: 32 cm | Yarn: Combed Cotton & Merino Blend | Includes: 5 Lavender Stems, 3 Chamomile Florets, 2 Bluebell Stems.',
      price: 139900, // ₹1,399
      compareAtPrice: 179900, // ₹1,799
      stockQuantity: 20,
      isFeatured: false,
      tags: 'bouquets,lavender,wildflower,pastel,calm,gift',
      images: JSON.stringify([
        '/images/products/lavender-dreams-wildflower-1.svg',
        '/images/products/lavender-dreams-wildflower-2.svg',
      ]),
      variants: [
        {
          name: 'Lilac Lavender',
          sku: 'LDW-LL-STD',
          priceAdjustment: 0,
          stockQuantity: 12,
        },
        {
          name: 'Twilight Sky Blue',
          sku: 'LDW-TSB-STD',
          priceAdjustment: 0,
          stockQuantity: 8,
        },
      ],
    },
    {
      name: 'Scarlet Romance Red Rose & Lily Luxe Bouquet',
      slug: 'scarlet-romance-red-rose-lily-luxe-bouquet',
      categorySlug: 'bouquets',
      description:
        'An opulent romantic arrangement of deep crimson crochet roses alongside graceful white lilies. Accented with lush eucalyptus greenery and tied with a thick burgundy satin ribbon.',
      details:
        'Height: 40 cm | Yarn: Premium Soft Microfiber Cotton | Includes: 6 Velvet Red Roses, 2 Handcrafted Lilies, Double Satin Ribbon.',
      price: 189900, // ₹1,899
      compareAtPrice: 249900, // ₹2,499
      stockQuantity: 15,
      isFeatured: true,
      tags: 'bouquets,rose,lily,valentine,proposal,anniversary,bestseller',
      images: JSON.stringify([
        '/images/products/scarlet-romance-rose-lily-1.svg',
        '/images/products/scarlet-romance-rose-lily-2.svg',
      ]),
      variants: [
        {
          name: 'Crimson Red (Satin Ribbon)',
          sku: 'SRR-CR-SAT',
          priceAdjustment: 0,
          stockQuantity: 10,
        },
        {
          name: 'Ruby Velvet (Gold Trim)',
          sku: 'SRR-RV-GLD',
          priceAdjustment: 25000,
          stockQuantity: 5,
        },
      ],
    },
    {
      name: 'The Royal Sovereign 24-Stem Jumbo Bouquet',
      slug: 'royal-sovereign-24-stem-jumbo-bouquet',
      categorySlug: 'jumbo-bouquets',
      description:
        'The crowning glory of everlasting florals. A monumental 24-stem bouquet showcasing grand peonies, royal roses, ranunculus, and lush foliage, wrapped in multi-layered gold foil craft wrap.',
      details:
        'Height: 52 cm | Diameter: 42 cm | Stems: 24 individual handcrafted stems including English Roses, Peonies, Ranunculus, and Italian Ruscus | Packaging: Gold Foil Triple Layer Wrap.',
      price: 349900, // ₹3,499
      compareAtPrice: 449900, // ₹4,499
      stockQuantity: 8,
      isFeatured: true,
      tags: 'jumbo,luxury,wedding,statement,grand,proposal,bestseller',
      images: JSON.stringify([
        '/images/products/royal-sovereign-jumbo-1.svg',
        '/images/products/royal-sovereign-jumbo-2.svg',
      ]),
      variants: [
        {
          name: 'Pastel Royal (Rose Gold Wrap)',
          sku: 'RSJ-PR-RGW',
          priceAdjustment: 0,
          stockQuantity: 5,
        },
        {
          name: 'Sunset Radiance (Burgundy Wrap)',
          sku: 'RSJ-SR-BW',
          priceAdjustment: 0,
          stockQuantity: 3,
        },
      ],
    },
    {
      name: 'Celestial Twilight Blossom Jumbo Bouquet',
      slug: 'celestial-twilight-blossom-jumbo-bouquet',
      categorySlug: 'jumbo-bouquets',
      description:
        'A dramatic 20-stem twilight arrangement featuring indigo roses, dusty lilac peonies, and frosted eucalyptus leaves. Created for anniversaries that deserve unforgettable statements.',
      details:
        'Height: 48 cm | Stems: 20 stems of royal indigo roses, dusty lilac peonies, and frosted eucalyptus leaves.',
      price: 299900, // ₹2,999
      compareAtPrice: 379900, // ₹3,799
      stockQuantity: 10,
      isFeatured: false,
      tags: 'jumbo,roses,carnations,anniversary,midnight,luxury',
      images: JSON.stringify([
        '/images/products/celestial-twilight-jumbo-1.svg',
        '/images/products/celestial-twilight-jumbo-2.svg',
      ]),
      variants: [
        {
          name: 'Twilight Indigo',
          sku: 'CTB-TI-STD',
          priceAdjustment: 0,
          stockQuantity: 6,
        },
        {
          name: 'Dusk Rose Ombré',
          sku: 'CTB-DRO-STD',
          priceAdjustment: 15000,
          stockQuantity: 4,
        },
      ],
    },
    {
      name: 'Cozy Cottage Daisy Ceramic Pot',
      slug: 'cozy-cottage-daisy-ceramic-pot',
      categorySlug: 'flower-pots',
      description:
        'A delightful miniature garden in a handmade ceramic pot. Features cheerful crochet daisies with cute embroidered faces, permanently potted in crochet soil. Ideal for study desks and gift shelves.',
      details:
        'Dimensions: 14 cm height × 9 cm base | Material: Glazed Terracotta Pot + 100% Cotton Yarn | Includes: 5 Daisy florets with embroidered smiling face.',
      price: 89900, // ₹899
      compareAtPrice: 119900, // ₹1,199
      stockQuantity: 28,
      isFeatured: true,
      tags: 'pots,daisy,desk,office,cute,minimalist,bestseller',
      images: JSON.stringify([
        '/images/products/cozy-cottage-daisy-pot-1.svg',
        '/images/products/cozy-cottage-daisy-pot-2.svg',
      ]),
      variants: [
        {
          name: 'Sunny Yellow & Cream',
          sku: 'CCD-SYC-STD',
          priceAdjustment: 0,
          stockQuantity: 16,
        },
        {
          name: 'Pure Snow White',
          sku: 'CCD-PSW-STD',
          priceAdjustment: 0,
          stockQuantity: 12,
        },
      ],
    },
    {
      name: 'Smiling Tulip Garden Pot',
      slug: 'smiling-tulip-garden-pot',
      categorySlug: 'flower-pots',
      description:
        'Three bright spring tulips hand-crocheted in peach and violet tones, standing proud in a warm textured terracotta pot. A perpetual breath of fresh spring air for your living space.',
      details:
        'Dimensions: 16 cm height × 10 cm base | Material: Matte Ceramic Pot + Milk Cotton Yarn | Includes: 3 Holland Tulip stems with wire-reinforced stems.',
      price: 99900, // ₹999
      compareAtPrice: 129900, // ₹1,299
      stockQuantity: 22,
      isFeatured: false,
      tags: 'pots,tulip,spring,gift,cheer,desk',
      images: JSON.stringify([
        '/images/products/smiling-tulip-pot-1.svg',
        '/images/products/smiling-tulip-pot-2.svg',
      ]),
      variants: [
        {
          name: 'Peach Sorbet',
          sku: 'STP-PS-STD',
          priceAdjustment: 0,
          stockQuantity: 12,
        },
        {
          name: 'Soft Violet Dream',
          sku: 'STP-SVD-STD',
          priceAdjustment: 0,
          stockQuantity: 10,
        },
      ],
    },
    {
      name: 'Blooming Succulent & Mini Cactus Pot',
      slug: 'blooming-succulent-mini-cactus-pot',
      categorySlug: 'flower-pots',
      description:
        'All the charm of desert flora with zero watering required! Three distinct crochet succulents and a flowering mini cactus arranged inside a fluted ceramic pot.',
      details:
        'Dimensions: 11 cm height × 8 cm base | Zero maintenance greenery | Includes: 1 Saguaro miniature cactus with pink floret + 2 rosette succulents.',
      price: 79900, // ₹799
      compareAtPrice: 99900, // ₹999
      stockQuantity: 30,
      isFeatured: false,
      tags: 'pots,succulent,cactus,desk,low-maintenance,greenery',
      images: JSON.stringify([
        '/images/products/blooming-succulent-cactus-pot-1.svg',
        '/images/products/blooming-succulent-cactus-pot-2.svg',
      ]),
      variants: [
        {
          name: 'Sage Mint (Fluted Pot)',
          sku: 'BSM-SM-STD',
          priceAdjustment: 0,
          stockQuantity: 18,
        },
        {
          name: 'Forest Green (Terracotta)',
          sku: 'BSM-FG-TER',
          priceAdjustment: 5000,
          stockQuantity: 12,
        },
      ],
    },
    {
      name: 'Sweet Serenade Crochet Bloom & Scented Candle Gift Box',
      slug: 'sweet-serenade-crochet-bloom-candle-gift-box',
      categorySlug: 'gift-boxes',
      description:
        'A luxurious sensory gift hamper. Contains a handcrafted crochet peony blossom cluster alongside a clean-burning soy wax candle in an amber glass jar, nestled in shredded tissue within a premium rigid gift box.',
      details:
        'Hamper contains: 1 Handcrafted Peony bloom cluster, 1 Soy Wax Scented Candle (120g, Rose & Vanilla), 1 Calligraphy Gift Card in a sturdy presentation box.',
      price: 229900, // ₹2,299
      compareAtPrice: 299900, // ₹2,999
      stockQuantity: 16,
      isFeatured: true,
      tags: 'giftbox,candle,pamper,birthday,hamper,anniversary,bestseller',
      images: JSON.stringify([
        '/images/products/sweet-serenade-gift-box-1.svg',
        '/images/products/sweet-serenade-gift-box-2.svg',
      ]),
      variants: [
        {
          name: 'Rose & Vanilla Amber',
          sku: 'SSG-RVA-STD',
          priceAdjustment: 0,
          stockQuantity: 10,
        },
        {
          name: 'Oud & Lavender Blossom',
          sku: 'SSG-OLB-STD',
          priceAdjustment: 15000,
          stockQuantity: 6,
        },
      ],
    },
    {
      name: 'Golden Memories Keepsake Wooden Gift Hamper',
      slug: 'golden-memories-keepsake-wooden-gift-hamper',
      categorySlug: 'gift-boxes',
      description:
        'Presented inside a handcrafted pine wood treasure chest with brass latch. Features golden crochet sunflowers, miniature roses, artisan wooden coasters, and a personalized wax-sealed parchment letter.',
      details:
        'Hamper contains: Solid pine wood chest with vintage latch, 2 handcrafted crochet sunflowers, 3 mini roses, 1 wooden coaster pair, and customized greeting scroll.',
      price: 279900, // ₹2,799
      compareAtPrice: 359900, // ₹3,599
      stockQuantity: 12,
      isFeatured: false,
      tags: 'giftbox,wooden,anniversary,festive,luxury,keepsake',
      images: JSON.stringify([
        '/images/products/golden-memories-wooden-hamper-1.svg',
        '/images/products/golden-memories-wooden-hamper-2.svg',
      ]),
      variants: [
        {
          name: 'Vintage Oak Chest',
          sku: 'GMK-VOC-STD',
          priceAdjustment: 0,
          stockQuantity: 7,
        },
        {
          name: 'Warm Walnut Chest',
          sku: 'GMK-WWC-STD',
          priceAdjustment: 20000,
          stockQuantity: 5,
        },
      ],
    },
    {
      name: 'Strawberry Blossom Crochet Hair Claw Clip Set',
      slug: 'strawberry-blossom-crochet-hair-claw-clip-set',
      categorySlug: 'hair-accessories',
      description:
        'A charming pair of tortoiseshell French claw clips crowned with hand-stitched 3D crochet strawberries and miniature daisy florets. Strong spring grip designed for all hair types.',
      details:
        'Dimensions: 9 cm clip length | Material: Durable cellulose acetate claw clip + hand-stitched 3D crochet strawberry and daisy blossoms.',
      price: 49900, // ₹499
      compareAtPrice: 69900, // ₹699
      stockQuantity: 40,
      isFeatured: true,
      tags: 'hair,claw-clip,strawberry,floral,everyday,cute,bestseller',
      images: JSON.stringify([
        '/images/products/strawberry-blossom-claw-clip-1.svg',
        '/images/products/strawberry-blossom-claw-clip-2.svg',
      ]),
      variants: [
        {
          name: 'Berry Red & Cream (Set of 2)',
          sku: 'SBC-BRC-2PC',
          priceAdjustment: 0,
          stockQuantity: 25,
        },
        {
          name: 'Baby Pink & Vanilla (Set of 2)',
          sku: 'SBC-BPV-2PC',
          priceAdjustment: 0,
          stockQuantity: 15,
        },
      ],
    },
    {
      name: 'Dainty Cherry Blossom Floral Hairpins (Set of 3)',
      slug: 'dainty-cherry-blossom-floral-hairpins-set-of-3',
      categorySlug: 'hair-accessories',
      description:
        'Trio of electroplated gold-finish hairpins accented with hand-crocheted sakura blossoms and freshwater pearls. Brings graceful artisanal accents to half-up dos and braided crowns.',
      details:
        'Set of 3 gold-toned hairpins adorned with hand-crocheted cherry blossoms and freshwater pearl beads. Perfect for festive updos and casual styling.',
      price: 39900, // ₹399
      compareAtPrice: 54900, // ₹549
      stockQuantity: 35,
      isFeatured: false,
      tags: 'hair,hairpin,sakura,accessories,gift,pearl',
      images: JSON.stringify([
        '/images/products/dainty-cherry-blossom-hairpins-1.svg',
        '/images/products/dainty-cherry-blossom-hairpins-2.svg',
      ]),
      variants: [
        {
          name: 'Sakura Pink Trio',
          sku: 'DCB-SPT-3PC',
          priceAdjustment: 0,
          stockQuantity: 20,
        },
        {
          name: 'Ivory Pearl Trio',
          sku: 'DCB-IPT-3PC',
          priceAdjustment: 0,
          stockQuantity: 15,
        },
      ],
    },
    {
      name: 'Vintage Floral Crochet Headband',
      slug: 'vintage-floral-crochet-headband',
      categorySlug: 'hair-accessories',
      description:
        'A wide cottagecore floral headband hand-woven in earth tones. Finished with a flexible elasticized back band for comfortable all-day wear without pinching.',
      details:
        'Width: 4.5 cm | Elastic stretch backband fits all head sizes | Hand-woven floral lace motif using hypoallergenic soft cotton yarn.',
      price: 59900, // ₹599
      compareAtPrice: 79900, // ₹799
      stockQuantity: 25,
      isFeatured: false,
      tags: 'hair,headband,retro,cottagecore,artisan,handmade',
      images: JSON.stringify([
        '/images/products/vintage-floral-headband-1.svg',
        '/images/products/vintage-floral-headband-2.svg',
      ]),
      variants: [
        {
          name: 'Terracotta & Cream',
          sku: 'VFH-TC-STD',
          priceAdjustment: 0,
          stockQuantity: 15,
        },
        {
          name: 'Sage Garden Green',
          sku: 'VFH-SGG-STD',
          priceAdjustment: 0,
          stockQuantity: 10,
        },
      ],
    },
    {
      name: 'Barnaby The Bear With Sunflower Amigurumi',
      slug: 'barnaby-the-bear-with-sunflower-amigurumi',
      categorySlug: 'character-gifts',
      description:
        'Meet Barnaby, our signature artisan amigurumi bear! Handcrafted from 100% natural cotton yarn with reinforced safety bead eyes, hugging a cheerful crochet sunflower.',
      details:
        'Height: 18 cm seated | Yarn: 100% Non-toxic Organic Cotton, stuffed with hypoallergenic polyfill | Features safety bead eyes and mini detachable crochet sunflower.',
      price: 119900, // ₹1,199
      compareAtPrice: 159900, // ₹1,599
      stockQuantity: 18,
      isFeatured: true,
      tags: 'character,amigurumi,bear,plush,kids,birthday,mascot,bestseller',
      images: JSON.stringify([
        '/images/products/barnaby-bear-amigurumi-1.svg',
        '/images/products/barnaby-bear-amigurumi-2.svg',
      ]),
      variants: [
        {
          name: 'Honey Brown Bear',
          sku: 'BBA-HBB-STD',
          priceAdjustment: 0,
          stockQuantity: 10,
        },
        {
          name: 'Oat Cream Bear',
          sku: 'BBA-OCB-STD',
          priceAdjustment: 0,
          stockQuantity: 8,
        },
      ],
    },
    {
      name: 'Pip The Bunny With Strawberry Blossom',
      slug: 'pip-the-bunny-with-strawberry-blossom',
      categorySlug: 'character-gifts',
      description:
        'Pip is an irresistibly soft amigurumi bunny featuring long floppy ears and hand-embroidered blushing cheeks, holding a sweet crochet strawberry blossom.',
      details:
        'Height: 22 cm including ears | Yarn: Ultra-soft milk cotton | Comes holding a little crochet strawberry with blushing pink cheeks.',
      price: 109900, // ₹1,099
      compareAtPrice: 149900, // ₹1,499
      stockQuantity: 20,
      isFeatured: false,
      tags: 'character,amigurumi,bunny,mascot,gift,nursery,cute',
      images: JSON.stringify([
        '/images/products/pip-bunny-amigurumi-1.svg',
        '/images/products/pip-bunny-amigurumi-2.svg',
      ]),
      variants: [
        {
          name: 'Snow White Bunny',
          sku: 'PBA-SWB-STD',
          priceAdjustment: 0,
          stockQuantity: 12,
        },
        {
          name: 'Gentle Dove Grey',
          sku: 'PBA-GDG-STD',
          priceAdjustment: 0,
          stockQuantity: 8,
        },
      ],
    },
  ];

  let totalVariantsSeeded = 0;

  for (const item of productsData) {
    const categoryId = categoryMap.get(item.categorySlug);
    if (!categoryId) {
      throw new Error(`Category ${item.categorySlug} not found in map.`);
    }

    const { variants, categorySlug, ...productFields } = item;

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        ...productFields,
        categoryId,
      },
      create: {
        ...productFields,
        categoryId,
      },
    });

    // Seed product variants
    for (const v of variants) {
      const existingVariant = await prisma.productVariant.findFirst({
        where: {
          productId: product.id,
          name: v.name,
        },
      });

      if (existingVariant) {
        await prisma.productVariant.update({
          where: { id: existingVariant.id },
          data: {
            sku: v.sku,
            name: v.name,
            priceAdjustment: v.priceAdjustment,
            stockQuantity: v.stockQuantity,
          },
        });
      } else {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: v.sku,
            name: v.name,
            priceAdjustment: v.priceAdjustment,
            stockQuantity: v.stockQuantity,
          },
        });
      }
      totalVariantsSeeded++;
    }
  }

  console.log(
    `✅ Seeded ${productsData.length} products and ${totalVariantsSeeded} variants.`
  );

  // ---------------------------------------------------------------------------
  // 3. Seed Users (Admin & Customer)
  // ---------------------------------------------------------------------------
  console.log('Seeding administrative and customer user accounts...');

  const adminPasswordHash = await bcrypt.hash('Admin@Divija123!', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@divijaarthouse.com' },
    update: {
      name: 'Divija Admin',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      phone: '+91 99887 76655',
    },
    create: {
      name: 'Divija Admin',
      email: 'admin@divijaarthouse.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      phone: '+91 99887 76655',
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'ananya@example.com' },
    update: {
      name: 'Ananya Sharma',
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      phone: '+91 98765 43210',
    },
    create: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      phone: '+91 98765 43210',
    },
  });

  // Seed sample customer address if not existing
  const existingAddress = await prisma.address.findFirst({
    where: { userId: customerUser.id },
  });

  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: customerUser.id,
        fullName: 'Ananya Sharma',
        phone: '+91 98765 43210',
        addressLine1: 'Flat 402, Lotus Greens, 100ft Road, Indiranagar',
        addressLine2: 'Near Metro Station',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        country: 'India',
        isDefault: true,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Seed Initial Newsletter Subscriber
  // ---------------------------------------------------------------------------
  await prisma.subscriber.upsert({
    where: { email: 'newsletter@divijaarthouse.com' },
    update: {},
    create: {
      email: 'newsletter@divijaarthouse.com',
      source: 'seed',
      isActive: true,
    },
  });

  console.log(`✅ Default admin created: ${adminUser.email} (Role: ${adminUser.role})`);
  console.log(`✅ Sample customer created: ${customerUser.email} (Role: ${customerUser.role})`);
  console.log('🎉 DivijaArtHouse database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
