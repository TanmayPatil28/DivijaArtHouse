# DivijaArtHouse — Handcrafted Everlasting Blooms & Gifts

> *"Little Blooms, Lasting Feelings."*

DivijaArtHouse is a mobile-first, production-grade Direct-to-Consumer (D2C) e-commerce storefront for handcrafted everlasting crochet flower bouquets, potted desk blooms, artisanal gift hampers, and floral accessories. Inspired by the warmth and dedication of Indian women artisans, each piece is hand-knitted from 5-ply combed milk cotton yarn to preserve life's most meaningful moments without wilting.

---

## 🌸 Key Architecture & Design Decisions

| Architectural Pillar | Implementation & Design Decision |
|---|---|
| **Framework** | **Next.js 14+ App Router** utilizing Server Components by default with client component boundaries (`'use client'`) for interactive controls. |
| **Language & Typing** | **TypeScript 5** with strict typing and Zod schemas for end-to-end data validation across server actions. |
| **Database & ORM** | **MySQL** relational database connected through **Prisma ORM (v5.22)** with relation modeling, foreign key indexes, and atomic transactions. |
| **Monetary Standard** | **Integer Paise Standard**: All monetary values across products, line items, shipping fees, and order totals are stored as integer paise (e.g. `149900` = `₹1,499.00`). This completely eliminates JavaScript floating-point rounding errors in currency arithmetic. Formatted for display using `Intl.NumberFormat('en-IN')`. |
| **Dual Payment Gateway** | **Toggleable Payment Architecture**: Regulated via `NEXT_PUBLIC_RAZORPAY_ENABLED="false"|"true"`. When enabled, securely creates server-side Razorpay orders and verifies HMAC-SHA256 signatures. When disabled, defaults smoothly to Cash on Delivery (COD) without requiring API keys. |
| **Authentication** | **NextAuth.js v5 (Auth.js)** with credentials-based authentication (Bcrypt hashed passwords) and Google OAuth provider support, coupled with Prisma adapter. |
| **Transactional Email** | **Nodemailer** integration with inline CSS brand templates (`#A32D3B`, `#FCEEEF`, `#1A1A1A`). Includes a safe development console simulation fallback when SMTP credentials are not configured. |
| **Brand & Design Tokens** | Custom Tailwind CSS palette: Primary (`#A32D3B`), Hover (`#872430`), Soft Pink (`#FCEEEF`), Warm Surface (`#FFFDF9`), Canvas (`#FFFFFF`), Text (`#1A1A1A`). Fonts: *Playfair Display* (display serif) and *Poppins* (body). |

---

## 📦 Project Structure

```
divijaarthouse/
├── prisma/
│   ├── schema.prisma             # Relational data schema (Users, Products, Orders, Inquiries, etc.)
│   └── seed.ts                   # Comprehensive database seed script with categories & products
├── public/
│   └── images/
│       ├── products/             # High-fidelity SVG product graphics & photography
│       └── categories/           # Collection banner and thumbnail artwork
├── scripts/
│   └── test-m8-verification.ts   # Milestone 8 end-to-end verification script
├── src/
│   ├── actions/                  # Next.js Server Actions
│   │   ├── admin.ts              # Admin catalog, order status & category actions
│   │   ├── auth.ts               # User registration & profile management
│   │   ├── checkout.ts           # Order creation with price validation & stock decrement
│   │   ├── contact.ts            # Public contact form submission & DB persistence
│   │   ├── newsletter.ts         # Subscriber opt-in and welcome email trigger
│   │   ├── payment.ts            # Razorpay cryptographic signature verification
│   │   ├── tracking.ts           # Public order tracking lookup action
│   │   └── wishlist.ts           # Server-side wishlist synchronization
│   ├── app/                      # Next.js 14 App Router
│   │   ├── (auth)/               # Signin & Register authentication routes
│   │   ├── (storefront)/         # Customer-facing storefront
│   │   │   ├── about/            # Brand story & artisan craft stages
│   │   │   ├── cart/             # Dedicated full-page shopping cart
│   │   │   ├── checkout/         # Multi-step checkout with COD / Razorpay
│   │   │   ├── collections/      # Filterable category collections
│   │   │   ├── contact/          # Interactive contact form & studio support
│   │   │   ├── order-confirmation/ # Order confirmation & receipt
│   │   │   ├── policies/         # Shipping, Returns, Privacy & Terms pages
│   │   │   ├── products/[slug]/  # Product detail pages (PDP) with variants
│   │   │   ├── shop/             # Complete catalog discovery & filtering
│   │   │   ├── track-order/      # Public 4-step order tracking timeline
│   │   │   └── wishlist/         # Customer curated wishlist
│   │   ├── account/              # User profile & past order history
│   │   ├── admin/                # Role-protected management dashboard
│   │   ├── api/                  # Auth.js route handlers & Razorpay endpoints
│   │   ├── layout.tsx            # Global HTML layout with header & footer
│   │   └── page.tsx              # High-conversion editorial homepage
│   ├── components/               # Modular UI components
│   │   ├── cart/                 # Slide-out cart drawer & line item controls
│   │   ├── catalog/              # Faceted filters, sorting & product grids
│   │   ├── contact/              # Interactive contact inquiry form
│   │   ├── home/                 # Editorial hero, trust badges, testimonials
│   │   ├── layout/               # Header, Announcement bar, Mobile drawer, Footer
│   │   ├── product/              # PDP gallery, variant selector, personalization
│   │   └── tracking/             # 4-stage tracking stepper & courier details
│   ├── context/                  # Client contexts (CartContext, WishlistContext)
│   ├── lib/                      # Core helpers
│   │   ├── email.ts              # Nodemailer integration & HTML email templates
│   │   ├── prisma.ts             # Global PrismaClient singleton
│   │   ├── razorpay.ts           # Razorpay SDK initialization & verification
│   │   └── utils.ts              # formatINR, cn, slugify, calculateDiscount
│   └── types/                    # Shared TypeScript interfaces
├── .env.example                  # Documented environment variable template
└── README.md                     # Production runbook & architectural documentation
```

---

## 🚀 Quickstart Guide

### Prerequisites
1. **Node.js**: v18.17.0 or later (Node 20+ recommended).
2. **npm**: v9+ or later.
3. **MySQL**: Local MySQL instance (e.g. via MySQL Server, XAMPP, or Docker) running on port `3306`.

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/your-username/divijaarthouse.git
cd divijaarthouse
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` or `.env.local`:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` matches your local MySQL credentials:
```env
DATABASE_URL="mysql://root:@localhost:3306/divijaarthouse"
NEXTAUTH_SECRET="divijaarthouse-development-secret-key-32charsmin"
AUTH_SECRET="divijaarthouse-development-secret-key-32charsmin"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_RAZORPAY_ENABLED="false"
```

### Step 3: Initialize Database & Run Migrations
Push the Prisma schema to create all MySQL tables:
```bash
npx prisma db push
```

### Step 4: Seed Initial Data
Seed all categories, sample products, administrator, and customer accounts:
```bash
npm run db:seed
```

### Step 5: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the storefront.

---

## 🔑 Seed Accounts & Credentials

The database seed script sets up the following pre-configured accounts:

| Role | Email Address | Password | Permissions & Dashboard |
|---|---|---|---|
| **Administrator** | `admin@divijaarthouse.com` | `Admin@Divija123!` | Full access to `/admin` dashboard, product catalog management, order fulfillment, status updates, and revenue metrics. |
| **Sample Customer** | `ananya@example.com` | `Customer@123!` | Standard customer access to order history at `/account/orders`, saved addresses, and persistent wishlist. |

> *Note:* Guest checkout is supported without requiring account registration.

---

## 🛠️ Command Reference

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js local development server at `http://localhost:3000`. |
| `npm run build` | Builds the production-ready Next.js application. |
| `npm run start` | Boots the built production application server. |
| `npm run lint` | Runs ESLint analysis across all project files. |
| `npm run typecheck` | Runs TypeScript compiler (`tsc --noEmit`) to verify strict typing. |
| `npx prisma db push` | Synchronizes the Prisma schema with the MySQL database. |
| `npm run db:seed` | Populates the database with default catalog data and user accounts. |
| `npx prisma studio` | Launches the interactive Prisma GUI database inspector in your browser. |
| `npx tsx scripts/test-m8-verification.ts` | Runs automated verification of Milestone 8 features. |

---

## 📧 Transactional Emails & Nodemailer Integration

DivijaArtHouse uses **Nodemailer** for sending branded HTML transactional emails:
1. **Customer Order Confirmation (`sendOrderConfirmationEmail`)**: Detailed receipt with snapshot item details, personalization notes, courier estimate, and a one-click track order button.
2. **Admin Notification (`sendAdminNewOrderNotification`)**: Alerts shop management of new incoming orders, delivery destination, payment method, and direct link to `/admin/orders`.
3. **Newsletter Welcome (`sendNewsletterWelcomeEmail`)**: Welcoming note with brand story and a 10% discount promo code (`BLOOM10`).

### Development Simulation Fallback
When SMTP credentials (`EMAIL_USER`, `EMAIL_PASS`) are omitted in local development, the application **does not crash or fail checkout**. Instead, it cleanly logs a formatted preview to the terminal and returns `{ success: true, simulated: true }`.

To connect real Gmail SMTP in production:
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-studio-email@gmail.com"
EMAIL_PASS="your-16-character-app-password"
EMAIL_FROM="DivijaArtHouse <orders@divijaarthouse.com>"
ADMIN_EMAIL="admin@divijaarthouse.com"
```

---

## 📄 Storefront Routes

- **Storefront & Discovery**:
  - `/` — Editorial Homepage
  - `/about` — Brand Story & 4-Stage Artisan Process
  - `/shop` — Catalog Discovery with faceted filters & sort
  - `/collections/[slug]` — Category-specific collections
  - `/products/[slug]` — Product Detail Page with variants & personalization
- **Shopping & Fulfillment**:
  - `/cart` — Full shopping cart view
  - `/checkout` — Checkout with COD or Razorpay
  - `/order-confirmation/[id]` — Order receipt & tracking link
  - `/track-order` — Public 4-step visual order tracking timeline
- **Customer Care & Legal**:
  - `/contact` — Interactive contact inquiry form & studio hours
  - `/policies/shipping` — PAN-India shipping policy & rates
  - `/policies/returns` — Return, replacement, and unboxing video guidelines
  - `/policies/privacy` — Privacy policy complying with Indian IT Act 2000
  - `/policies/terms` — Terms of service & handmade craftsmanship notice
- **Account & Administration**:
  - `/account` & `/account/orders` — Customer dashboard
  - `/admin` — Protected administrative dashboard

---

## 📜 License & Copyright

© 2026 DivijaArtHouse. All rights reserved. Handcrafted with love in Bangalore, Karnataka, India.
