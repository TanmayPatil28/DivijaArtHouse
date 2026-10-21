# Project: DivijaArtHouse

## Architecture
DivijaArtHouse is a production-quality, mobile-first D2C e-commerce storefront for handcrafted crochet flowers, everlasting bouquets, gift sets, and handcrafted floral accessories.

- **Framework**: Next.js 14.2+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens and font typography (Playfair Display + Poppins/Inter)
- **Database**: MySQL via Prisma ORM 5.22.0
- **Authentication**: NextAuth.js v5 (Auth.js) supporting Credentials (email/password with bcryptjs) and Google OAuth, with role-based routing (`CUSTOMER` vs `ADMIN`)
- **Payments**: Dual-mode payment gateway — toggle-able via `NEXT_PUBLIC_RAZORPAY_ENABLED=true/false` with seamless Cash on Delivery (COD) fallback
- **Monetary Representation**: Integer **paise** for all database fields and calculations (1 INR = 100 paise; e.g. ₹1,499.00 = `149900`) to guarantee arithmetic integrity
- **Email**: Nodemailer with HTML templates and development fallback (logging to console when SMTP credentials are not configured)
- **Images**: Local optimized images in `public/images/` served via Next.js `<Image>` component

---

## Code Layout
```
c:\DivijaArtHouse\divijaarthouse\
├── prisma\
│   ├── schema.prisma           # Prisma MySQL schema with all 10 models
│   └── seed.ts                 # Database seed script (>=15 products, 6 categories, admin user)
├── public\
│   └── images\
│       ├── products\           # Product photos / local SVG/WebP assets
│       ├── categories\         # Category circular reel thumbnails
│       └── badges\             # Trust and payment badges
├── src\
│   ├── app\
│   │   ├── (auth)\
│   │   │   ├── signin\page.tsx
│   │   │   └── register\page.tsx
│   │   ├── (storefront)\
│   │   │   ├── page.tsx                    # Homepage (12 sections)
│   │   │   ├── shop\page.tsx               # Product Catalog with filters & search
│   │   │   ├── collections\[slug]\page.tsx # Category landing page
│   │   │   ├── products\[slug]\page.tsx    # Product Detail Page (PDP)
│   │   │   ├── cart\page.tsx               # Fallback cart page (primary is drawer)
│   │   │   ├── wishlist\page.tsx           # Wishlist page
│   │   │   ├── checkout\page.tsx           # Single-page checkout
│   │   │   ├── order-confirmation\[id]\page.tsx
│   │   │   ├── track-order\page.tsx        # Public order tracking
│   │   │   ├── about\page.tsx              # Brand story
│   │   │   ├── contact\page.tsx            # Contact form
│   │   │   └── policies\
│   │   │       ├── shipping\page.tsx
│   │   │       ├── returns\page.tsx
│   │   │       ├── privacy\page.tsx
│   │   │       └── terms\page.tsx
│   │   ├── account\                        # Customer account & order history
│   │   │   ├── page.tsx
│   │   │   └── orders\page.tsx
│   │   ├── admin\                          # Role-protected Admin dashboard
│   │   │   ├── page.tsx                    # Metrics & recent orders
│   │   │   ├── products\page.tsx           # Product CRUD & image upload
│   │   │   ├── categories\page.tsx         # Category CRUD
│   │   │   └── orders\page.tsx             # Order fulfillment management
│   │   ├── api\
│   │   │   ├── auth\[...nextauth]\route.ts # NextAuth Route Handler
│   │   │   ├── razorpay\
│   │   │   │   ├── create-order\route.ts   # Server-side Razorpay order creation
│   │   │   │   └── verify\route.ts         # Payment signature verification
│   │   │   └── upload\route.ts             # Admin product image upload
│   │   ├── globals.css                     # Design tokens & Tailwind base
│   │   ├── layout.tsx                      # Root layout (Header, Cart Drawer, Footer)
│   │   ├── not-found.tsx                   # Branded 404 page
│   │   └── error.tsx                       # Global error boundary
│   ├── components\
│   │   ├── layout\                         # Header, Footer, AnnouncementBar, MobileNavDrawer
│   │   ├── home\                           # Hero, ValueProps, CollectionReel, Bestsellers, Story
│   │   ├── product\                        # ProductCard, ProductGrid, ImageGallery, VariantSelector
│   │   ├── cart\                           # CartDrawer, CartItem, FreeShippingBar, CartSummary
│   │   ├── checkout\                       # CheckoutForm, AddressForm, OrderSummarySidebar
│   │   ├── wishlist\                       # WishlistButton, WishlistGrid
│   │   ├── admin\                          # AdminSidebar, AdminHeader, MetricsCards, ProductForm
│   │   └── ui\                             # Button, Input, Modal, Badge, Dropdown, Skeleton
│   ├── context\
│   │   ├── CartContext.tsx                 # Cart state (localStorage + user sync)
│   │   └── WishlistContext.tsx             # Wishlist state (localStorage + user sync)
│   ├── lib\
│   │   ├── prisma.ts                       # Global PrismaClient singleton
│   │   ├── utils.ts                        # formatINR, cn, slugify, calculateDiscount
│   │   ├── email.ts                        # Nodemailer transport & HTML templates
│   │   └── razorpay.ts                     # Razorpay server SDK client
│   ├── actions\                            # Server Actions (checkout, newsletter, contact, admin)
│   ├── types\                              # TypeScript interfaces & domain types
│   ├── auth.config.ts                      # Edge-safe NextAuth routing configuration
│   ├── auth.ts                             # Full NextAuth configuration with PrismaAdapter
│   └── middleware.ts                       # Next.js route protection middleware
├── .env.example                            # Documented environment variables template
├── .env.local                              # Local development environment configuration
├── package.json                            # Pinned dependencies
├── tsconfig.json                           # Strict TypeScript configuration
├── tailwind.config.ts                      # Theme tokens, colors & fonts
└── README.md                               # Project documentation & operational runbook
```

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F-01 | Announcement Bar | Slim ticker banner with customizable promotional copy | M3 | R1.1 |
| F-02 | Sticky Responsive Header | Navigation bar, brand wordmark, wishlist counter, cart badge, mobile toggle | M3 | R1.2 |
| F-03 | Mobile Navigation Drawer | Slide-out overlay drawer on mobile viewports (<768px) | M3 | R1.2 |
| F-04 | Editorial Hero Banner | Full-width hero with headline "Flowers That Keep Your Moments Blooming" & dual CTAs | M3 | R1.3 |
| F-05 | Trust / Value Props Strip | 4-benefit strip (Thoughtfully Handcrafted, Meaningful Gifting, Beautifully Presented, Blooms That Last) | M3 | R1.4 |
| F-06 | Shop by Collection Reel | Horizontally scrollable reel of circular category cards | M3 | R1.5 |
| F-07 | Bestsellers Product Grid | Curated product grid with dynamic pricing, MRP strikethrough, discount %, wishlist toggle, quick add | M3 | R1.6 |
| F-08 | Shop by Occasion | Occasion cards (Birthdays, Anniversaries, Valentine's, Graduation, Festivals, Just Because) | M3 | R1.7 |
| F-09 | Featured Collection Spotlight | Asymmetrical editorial spotlight for premium collection | M3 | R1.8 |
| F-10 | Original Brand Story | Narrative storytelling on artisan origins, crochet yarn craft, everlasting florals | M3 | R1.9 |
| F-11 | Testimonials Placeholder | Realistic section structured for reviews, marked honestly as customer impressions | M3 | R1.10 |
| F-12 | Newsletter Subscription Form | Email subscription input with validation and persistence to Subscriber table | M3 | R1.11 |
| F-13 | Storefront Footer | 4-column footer: Brand summary, Quick Links, Policy links, Newsletter, Payment badges | M3 | R1.12 |
| F-14 | Filterable Product Catalog | `/shop` with Category, Price range, In-stock availability filters | M4 | R2 |
| F-15 | Category Collections | Dedicated `/collections/[slug]` category landing page with category header | M4 | R2 |
| F-16 | Product Sorting | Sort by Price Low to High, High to Low, Newest, Featured | M4 | R2 |
| F-17 | Real-time Debounced Search | Full-text search across name, description, tags with debounced input | M4 | R2 |
| F-18 | Active Filter Chips | Interactive chips with clear button and global Clear All action | M4 | R2 |
| F-19 | Responsive Product Grid | 2 col mobile (375px), 3 col tablet (768px), 4 col desktop (1280px) | M4 | R2 |
| F-20 | Dynamic Product Page | Detailed PDP at `/products/[slug]` with gallery, specs, CTAs | M4 | R3 |
| F-21 | Interactive Image Gallery | Main photo with interactive thumbnail navigation | M4 | R3 |
| F-22 | Variant Selector | Color and size option selectors updating SKU, price, stock | M4 | R3 |
| F-23 | Personalization Text Field | Custom greeting message / gift note input attached to line item | M4 | R3 |
| F-24 | Quantity Selector | Step increment/decrement control with stock limit bounds | M4 | R3 |
| F-25 | Dynamic CTA Buttons | "Add to Cart" (opens drawer) and "Buy Now" (redirects to `/checkout`) | M4 | R3 |
| F-26 | Delivery Estimator | Static/configurable pincode dispatch timeframe pill | M4 | R3 |
| F-27 | Related Products Shelf | Recommendation carousel based on matching category/tags | M4 | R3 |
| F-28 | Dynamic SEO Metadata | Dynamic title, description, OpenGraph tags per product | M4 | R3 |
| F-29 | Slide-Out Cart Drawer | Off-canvas drawer opening on Add to Cart without page reload | M5 | R4 |
| F-30 | Persistent Hybrid Cart State | LocalStorage persistence for guests; synchronized to DB for logged-in users | M5 | R4 |
| F-31 | Cart Line Deduplication | Merging identical product+variant combos into one line item | M5 | R4 |
| F-32 | In-Drawer Controls | Real-time increment (+), decrement (-), and remove buttons | M5 | R4 |
| F-33 | Free Shipping Progress Bar | Visual bar showing remaining amount to qualify for free shipping | M5 | R4 |
| F-34 | Cart Arithmetic Calculation | Line Subtotal = Price × Qty; Subtotal = Sum of line subtotals | M5 | R4 |
| F-35 | Empty Cart State | Friendly icon, copy, and "Start Shopping" CTA | M5 | R4 |
| F-36 | Single-Page Checkout Form | Customer details, shipping address, delivery notes, order summary | M6 | R5 |
| F-37 | Razorpay Gateway Integration | Server-side Razorpay order creation and client payment signature verification | M6 | R5 |
| F-38 | Cash on Delivery (COD) Fallback | Instant COD order creation with status `PENDING_COD` when Razorpay is OFF | M6 | R5 |
| F-39 | Server-Side Price Snapshot | Immutable snapshot of product name, variant, unit price at time of purchase | M6 | R5 |
| F-40 | Order Confirmation Page | Order receipt at `/order-confirmation/[id]` with order ID and details | M6 | R5 |
| F-41 | Guest Checkout | Placing orders without requiring account registration | M6 | R5 |
| F-42 | Universal Wishlist Toggle | Heart icon button on product cards and PDP | M5 | R6 |
| F-43 | Wishlist Page | Dedicated `/wishlist` page with Move to Cart and Remove actions | M5 | R6 |
| F-44 | NextAuth v5 Authentication | Credentials (Email/Password with bcryptjs) and Google OAuth providers | M7 | R6 |
| F-45 | Customer Account Dashboard | Protected profile page at `/account` with user details | M7 | R6 |
| F-46 | Order History Page | Order history at `/account/orders` with status badges | M7 | R6 |
| F-47 | Role-Protected Admin Dashboard | Server-side guarded `/admin` with metrics: orders, revenue, products, stock | M7 | R7 |
| F-48 | Product Management | `/admin/products` with create, edit, delete, stock updates | M7 | R7 |
| F-49 | Product Image Upload | Local file upload to `public/images/products/` with path stored in DB | M7 | R7 |
| F-50 | Category Management | `/admin/categories` with create, edit, delete | M7 | R7 |
| F-51 | Order Fulfillment Manager | `/admin/orders` with status transitions (Pending -> Shipped -> Delivered) | M7 | R7 |
| F-52 | Brand Story Page | Rich narrative storytelling at `/about` | M8 | R8 |
| F-53 | Contact Us Page | `/contact` form with validation and DB persistence | M8 | R8 |
| F-54 | Legal & Policy Pages | `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms` | M8 | R8 |
| F-55 | Public Order Tracking | `/track-order` lookup tool returning order status from DB | M8 | R8 |
| F-56 | Customer Order Confirmation Email | HTML email with order details via Nodemailer SMTP | M8 | R9 |
| F-57 | Admin Order Notification Email | HTML alert sent to admin on new orders via Nodemailer | M8 | R9 |
| F-58 | Newsletter Welcome Email | Welcome email sent on subscription | M8 | R9 |
| F-59 | Custom 404 Not-Found Boundary | Branded `not-found.tsx` for missing routes and invalid product slugs | M1 | R3 |
| F-60 | Global Error Boundary | Resilient `error.tsx` catching React render exceptions | M1 | R1 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Foundation & Database Schema | Package manifest, Next.js 14 App Router, Tailwind tokens, fonts, Prisma schema & DB push, not-found & error boundaries | None | DONE |
| M2 | Seed Catalog & Core Data Utilities | 16 handcrafted crochet products, 6 categories, variants, seed script, formatINR, helper libs | M1 | DONE |
| M3 | Brand Layout & Homepage | Announcement bar, sticky header, mobile drawer, footer, 12 homepage sections, newsletter action | M1, M2 | DONE |
| M4 | Catalog, Discovery & PDP | `/shop` (filters, sorting, debounced search), `/collections/[slug]`, `/products/[slug]` (gallery, variants, personalization, related items, SEO) | M2, M3 | DONE |
| M5 | Cart System, Drawer & Wishlist | Slide-out cart drawer, cart context/store with localStorage + DB sync, deduplication, wishlist toggle & `/wishlist` | M3, M4 | DONE |
| M6 | Checkout, Orders & Payments | Single-page `/checkout`, guest checkout, COD fallback, Razorpay toggle, server price snapshotting, `/order-confirmation/[id]` | M4, M5 | DONE |
| M7 | Auth, Account & Admin Panel | NextAuth v5 (credentials + Google), `/account`, `/account/orders`, role-guarded `/admin` (metrics, product CRUD, category CRUD, orders fulfillment) | M1, M6 | DONE |
| M8 | Supporting Pages, Email & Final Build | `/about`, `/contact`, `/policies/*`, `/track-order`, Nodemailer emails, `.env.example`, `README.md`, full build and lint pass | M1-M7 | DONE |

---

## Interface Contracts

### 1. Monetary Values & Formatting
- **Database & State**: Strictly integer **paise** (`149900` = ₹1,499.00). No float rounding.
- **Display Helper**: `formatINR(amountInPaise: number): string` -> `"₹1,499"` or `"₹1,499.00"`.

### 2. Cart Item Interface
```typescript
interface CartItem {
  id: string; // composite key: `${productId}-${variantId || 'default'}`
  productId: string;
  name: string;
  slug: string;
  image: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number; // in paise
  quantity: number;
  personalization?: string;
}
```

### 3. Order Creation Payload & Recalculation
- Client sends: `{ customerName, email, phone, shippingAddress, items: [{ productId, variantId, quantity, personalization }], paymentMethod: "COD" | "RAZORPAY" }`.
- Server queries database: Fetches real `price` and validates `stock`. Computes `subtotal`, `shippingFee` (₹0 if subtotal >= 99900 paise, else ₹9900 paise), and `total`.
- Server creates `Order` and `OrderItem` records with immutable price snapshots.

### 4. NextAuth v5 Decoupled Architecture
- `src/auth.config.ts`: Edge-safe route authorization logic (no Prisma imports). Used in `src/middleware.ts`.
- `src/auth.ts`: Node runtime with PrismaAdapter, CredentialsProvider, and GoogleProvider.
