/**
 * DivijaArtHouse - Milestone 8 Adversarial Stress Test Suite
 * Challenger 2: Email Resilience, Hostile Inputs & Full App Router Storefront Route Rendering
 *
 * This test suite stress-tests:
 * 1. Email Resilience & Non-blocking Transaction Isolation:
 *    - Missing SMTP credentials (empty env vars) -> silent dev fallback, order succeeds
 *    - Simulated/placeholder SMTP credentials -> safe fallback, no crashes
 *    - Failing / Crashing SMTP transporter -> sendMail rejection isolated, COD order placement succeeds,
 *      stock properly decremented, no unhandled promise rejections
 *    - Payment verification (verifyPayment) succeeds and order transitions to PAID / PROCESSING even under SMTP crash
 *    - Missing / non-existent order records handled safely without unhandled exceptions
 * 2. HTML Email Generators Under Hostile & Extreme Inputs:
 *    - sendOrderConfirmationEmail with missing optional fields (null line2, null instructions, null tracking, null variant, null personalization)
 *    - Very long product names (>250 chars) and zero-price line items
 *    - XSS / special characters (<script>, HTML tags, quotes, emojis, unicode)
 *    - Free shipping (shippingFee = 0) vs paid shipping calculation
 *    - sendAdminNewOrderNotification total items calculation with multiple quantities
 *    - sendNewsletterWelcomeEmail with unusual email formats (subaddressing, punctuation)
 *    - Inline styles and well-formed HTML document validation
 * 3. Storefront App Router Route Rendering:
 *    - All static storefront routes (/, /about, /contact, /policies/*, /track-order)
 *    - Dynamic catalog route (/shop) with various searchParams & malicious query strings
 *    - Dynamic collections page (/collections/[slug]) with valid and invalid slugs (notFound boundary)
 *    - Dynamic product detail page (/products/[slug]) with valid and invalid slugs (notFound boundary)
 *    - Dynamic order confirmation page (/order-confirmation/[id]) with valid and invalid IDs (notFound boundary)
 *    - Client component exports (Cart, Checkout, Wishlist)
 */

import { PrismaClient, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { createOrder } from '../src/actions/checkout';
import { verifyPayment } from '../src/actions/payment';
import {
  sendOrderConfirmationEmail,
  sendAdminNewOrderNotification,
  sendNewsletterWelcomeEmail,
} from '../src/lib/email';

// Storefront App Router Pages & Metadata Generators
import HomePage from '../src/app/page';
import AboutPage from '../src/app/(storefront)/about/page';
import ContactPage from '../src/app/(storefront)/contact/page';
import ShippingPolicyPage from '../src/app/(storefront)/policies/shipping/page';
import ReturnsPolicyPage from '../src/app/(storefront)/policies/returns/page';
import PrivacyPolicyPage from '../src/app/(storefront)/policies/privacy/page';
import TermsPolicyPage from '../src/app/(storefront)/policies/terms/page';
import TrackOrderPage from '../src/app/(storefront)/track-order/page';
import ShopPage from '../src/app/(storefront)/shop/page';
import CollectionPage, {
  generateMetadata as generateCollectionMetadata,
} from '../src/app/(storefront)/collections/[slug]/page';
import ProductPage, {
  generateMetadata as generateProductMetadata,
} from '../src/app/(storefront)/products/[slug]/page';
import OrderConfirmationPage, {
  generateMetadata as generateOrderConfirmationMetadata,
} from '../src/app/(storefront)/order-confirmation/[id]/page';
import CartPage from '../src/app/(storefront)/cart/page';
import CheckoutPage from '../src/app/(storefront)/checkout/page';
import WishlistPage from '../src/app/(storefront)/wishlist/page';

const prisma = new PrismaClient();

interface TestResult {
  group: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, group: string, name: string, details?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] [${group}] ${name}`);
    results.push({ group, name, passed: true, details });
  } else {
    console.error(`  ❌ [FAIL] [${group}] ${name}`);
    if (details) console.error(`     Details: ${details}`);
    results.push({ group, name, passed: false, details });
    throw new Error(`Assertion failed: [${group}] ${name} - ${details || ''}`);
  }
}

async function runAdversarialTestSuite() {
  console.log('🌸 DivijaArtHouse - Milestone 8 Adversarial Stress Testing');
  console.log('====================================================================\n');

  // Track created records for guaranteed cleanup
  const createdOrderIds: string[] = [];
  const stockAdjustments: { productId: string; count: number }[] = [];

  // Save original environment
  const originalEnv = { ...process.env };
  const originalCreateTransport = nodemailer.createTransport;

  try {
    // Locate a real active product for checkout stress tests
    const testProduct = await prisma.product.findFirst({
      where: { isActive: true, stockQuantity: { gte: 10 } },
    });
    if (!testProduct) {
      throw new Error('Database must have at least one active product with stock >= 10 to run tests.');
    }

    // =========================================================================
    // PART 1: Email Resilience & Non-blocking Transaction Isolation
    // =========================================================================
    console.log('--- PART 1: Email Resilience & Non-blocking Transaction Isolation ---');

    // 1.1: Missing SMTP credentials - COD Checkout placement succeeds seamlessly
    {
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASS;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;

      const initialStock = testProduct.stockQuantity;

      const codOrderResult = await createOrder({
        customerName: 'Challenger Ananya',
        customerEmail: 'ananya.challenger@example.com',
        customerPhone: '9876543210',
        shippingAddress: {
          addressLine1: 'Flat 302, Palm Grove',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
        },
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
          },
        ],
        paymentMethod: 'COD',
      });

      assert(codOrderResult.success === true, 'P1.1-MissingSMTP', 'createOrder succeeds when SMTP credentials are completely missing');
      assert(!!codOrderResult.orderId, 'P1.1-MissingSMTP', 'Returns valid orderId');
      assert(codOrderResult.paymentMethod === 'COD', 'P1.1-MissingSMTP', 'Order paymentMethod is COD');

      if (codOrderResult.orderId) {
        createdOrderIds.push(codOrderResult.orderId);
        stockAdjustments.push({ productId: testProduct.id, count: 1 });

        const createdOrder = await prisma.order.findUnique({
          where: { id: codOrderResult.orderId },
        });
        assert(!!createdOrder, 'P1.1-MissingSMTP', 'Order persisted in MySQL database');
        assert(createdOrder?.orderStatus === OrderStatus.PENDING_COD, 'P1.1-MissingSMTP', 'Order status is PENDING_COD');
        assert(createdOrder?.paymentStatus === PaymentStatus.PENDING, 'P1.1-MissingSMTP', 'Payment status is PENDING');

        const updatedProduct = await prisma.product.findUnique({
          where: { id: testProduct.id },
          select: { stockQuantity: true },
        });
        assert(
          updatedProduct?.stockQuantity === initialStock - 1,
          'P1.1-MissingSMTP',
          'Atomic stock quantity was properly decremented by 1'
        );
      }
    }

    // 1.2: Simulated / Placeholder SMTP credentials return simulated: true
    {
      process.env.EMAIL_USER = 'placeholder@example.com';
      process.env.EMAIL_PASS = 'placeholder-secret';

      const simOrderConfirm = await sendOrderConfirmationEmail(createdOrderIds[0]);
      assert(simOrderConfirm.success === true, 'P1.2-PlaceholderSMTP', 'sendOrderConfirmationEmail succeeds with placeholder config');
      assert(simOrderConfirm.simulated === true, 'P1.2-PlaceholderSMTP', 'sendOrderConfirmationEmail flags simulated: true');

      const simAdmin = await sendAdminNewOrderNotification(createdOrderIds[0]);
      assert(simAdmin.success === true, 'P1.2-PlaceholderSMTP', 'sendAdminNewOrderNotification succeeds with placeholder config');
      assert(simAdmin.simulated === true, 'P1.2-PlaceholderSMTP', 'sendAdminNewOrderNotification flags simulated: true');

      const simNewsletter = await sendNewsletterWelcomeEmail('challenger.sub@example.com');
      assert(simNewsletter.success === true, 'P1.2-PlaceholderSMTP', 'sendNewsletterWelcomeEmail succeeds with placeholder config');
      assert(simNewsletter.simulated === true, 'P1.2-PlaceholderSMTP', 'sendNewsletterWelcomeEmail flags simulated: true');
    }

    // 1.3: Hostile Crashing SMTP Transporter - Non-blocking Isolation
    {
      // Configure realistic-looking credentials so getEmailConfig().isConfigured is TRUE
      process.env.EMAIL_USER = 'live.notifications@divijaarthouse.com';
      process.env.EMAIL_PASS = 'production-app-key-999';
      process.env.EMAIL_HOST = 'smtp.adversarial-mock.internal';
      process.env.EMAIL_PORT = '587';

      // Monkey-patch nodemailer.createTransport to throw / reject network errors
      let sendMailAttempts = 0;
      (nodemailer as any).createTransport = () => {
        return {
          sendMail: async () => {
            sendMailAttempts++;
            throw new Error('ADVERSARIAL_SMTP_CONNECTION_REFUSED: 554 Fatal network timeout while contacting mail server');
          },
        };
      };

      // 1.3.1: Direct invocation of email functions catches the error and does NOT throw
      const failConfirm = await sendOrderConfirmationEmail(createdOrderIds[0]);
      assert(failConfirm.success === false, 'P1.3-CrashingSMTP', 'sendOrderConfirmationEmail returns success: false on SMTP crash');
      assert(
        typeof failConfirm.error === 'string' && failConfirm.error.includes('ADVERSARIAL_SMTP_CONNECTION_REFUSED'),
        'P1.3-CrashingSMTP',
        'Error message correctly captured from SMTP error'
      );

      const failAdmin = await sendAdminNewOrderNotification(createdOrderIds[0]);
      assert(failAdmin.success === false, 'P1.3-CrashingSMTP', 'sendAdminNewOrderNotification returns success: false on SMTP crash');

      const failNewsletter = await sendNewsletterWelcomeEmail('sub@example.com');
      assert(failNewsletter.success === false, 'P1.3-CrashingSMTP', 'sendNewsletterWelcomeEmail returns success: false on SMTP crash');

      // 1.3.2: createOrder MUST succeed even when SMTP is crashing!
      const initialStock2 = (
        await prisma.product.findUnique({
          where: { id: testProduct.id },
          select: { stockQuantity: true },
        })
      )?.stockQuantity || 0;

      const resilientCodOrder = await createOrder({
        customerName: 'Resilience Test User',
        customerEmail: 'resilient@example.com',
        customerPhone: '9876543210',
        shippingAddress: {
          addressLine1: '456 Safe Harbor Way',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
          },
        ],
        paymentMethod: 'COD',
      });

      assert(resilientCodOrder.success === true, 'P1.3-CrashingSMTP', 'createOrder survives complete SMTP transporter crash');
      assert(!!resilientCodOrder.orderId, 'P1.3-CrashingSMTP', 'Order created and orderId returned');

      if (resilientCodOrder.orderId) {
        createdOrderIds.push(resilientCodOrder.orderId);
        stockAdjustments.push({ productId: testProduct.id, count: 1 });

        const verifiedOrder = await prisma.order.findUnique({
          where: { id: resilientCodOrder.orderId },
        });
        assert(!!verifiedOrder, 'P1.3-CrashingSMTP', 'Order was successfully committed to MySQL despite failing email');
        assert(verifiedOrder?.orderStatus === OrderStatus.PENDING_COD, 'P1.3-CrashingSMTP', 'Order status is PENDING_COD');
      }

      // Restore nodemailer
      (nodemailer as any).createTransport = originalCreateTransport;
    }

    // 1.4: Payment Verification Resilience Under Failing Transporter
    {
      // Create a test prepaid order in PENDING status
      const prepaidOrder = await prisma.order.create({
        data: {
          orderNumber: `DAH-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          customerName: 'Prepaid Challenger',
          customerEmail: 'prepaid@example.com',
          customerPhone: '9876543210',
          shippingAddressLine1: 'Tower B, Tech Park',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500081',
          subtotal: 199900,
          shippingFee: 0,
          totalAmount: 199900,
          paymentMethod: PaymentMethod.RAZORPAY,
          paymentStatus: PaymentStatus.PENDING,
          orderStatus: OrderStatus.PENDING,
          razorpayOrderId: 'order_adversarial_rzp_777',
          items: {
            create: [
              {
                productName: testProduct.name,
                productSlug: testProduct.slug,
                unitPrice: 199900,
                quantity: 1,
                lineSubtotal: 199900,
              },
            ],
          },
        },
      });
      createdOrderIds.push(prepaidOrder.id);

      // Re-enable crashing transporter
      (nodemailer as any).createTransport = () => {
        return {
          sendMail: async () => {
            throw new Error('FATAL_PREPAID_DISPATCH_TIMEOUT');
          },
        };
      };

      // Generate valid signature using Razorpay dev convention (mock_sig_<orderId>)
      const verifyResult = await verifyPayment({
        orderId: prepaidOrder.id,
        razorpayOrderId: prepaidOrder.razorpayOrderId!,
        razorpayPaymentId: 'pay_adversarial_sample_123',
        razorpaySignature: `mock_sig_${prepaidOrder.razorpayOrderId}`,
      });

      assert(verifyResult.success === true, 'P1.4-PaymentResilience', 'verifyPayment succeeds even when confirmation email dispatch fails');
      assert(verifyResult.paymentStatus === 'PAID', 'P1.4-PaymentResilience', 'PaymentStatus transitioned to PAID');
      assert(verifyResult.orderStatus === 'PROCESSING', 'P1.4-PaymentResilience', 'OrderStatus transitioned to PROCESSING');

      const updatedPrepaid = await prisma.order.findUnique({
        where: { id: prepaidOrder.id },
      });
      assert(updatedPrepaid?.paymentStatus === PaymentStatus.PAID, 'P1.4-PaymentResilience', 'Database paymentStatus is persisted as PAID');
      assert(updatedPrepaid?.orderStatus === OrderStatus.PROCESSING, 'P1.4-PaymentResilience', 'Database orderStatus is persisted as PROCESSING');
      assert(
        updatedPrepaid?.razorpayPaymentId === 'pay_adversarial_sample_123',
        'P1.4-PaymentResilience',
        'Razorpay payment ID recorded'
      );

      // Restore nodemailer
      (nodemailer as any).createTransport = originalCreateTransport;
    }

    // 1.5: Missing / Non-existent Order Records
    {
      const nonExistentConfirm = await sendOrderConfirmationEmail('non-existent-uuid-999999');
      assert(nonExistentConfirm.success === false, 'P1.5-MissingRecords', 'sendOrderConfirmationEmail safely handles non-existent order ID');
      assert(nonExistentConfirm.error === 'Order record not found', 'P1.5-MissingRecords', 'Returns descriptive not found message');

      const nonExistentAdmin = await sendAdminNewOrderNotification('non-existent-uuid-999999');
      assert(nonExistentAdmin.success === false, 'P1.5-MissingRecords', 'sendAdminNewOrderNotification safely handles non-existent order ID');
      assert(nonExistentAdmin.error === 'Order record not found', 'P1.5-MissingRecords', 'Returns descriptive not found message');
    }

    console.log('  Part 1 complete: All email resilience and non-blocking isolation tests passed.\n');

    // =========================================================================
    // PART 2: HTML Email Generators Under Hostile & Extreme Inputs
    // =========================================================================
    console.log('--- PART 2: HTML Email Generators Stress Testing (Adversarial Data) ---');

    // Reset env to simulated mode so we can capture rendered output
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;

    // Create a hostile order with extreme edge cases:
    // - Missing optional shipping line 2
    // - Missing optional delivery instructions
    // - Missing optional tracking
    // - Extremely long product name (>250 chars)
    // - Null variantName & null personalization
    // - XSS injection strings in customer name, address, and line item
    // - Zero shipping fee (FREE)
    // - Zero-price line item (promotional gift)
    const longProductName =
      'Super-Everlasting Artisan Botanical Crochet Bouquet With 5-Ply Combed Milk Cotton Petals - Handcrafted Limited Autumn Festive Deluxe Edition #99 - Includes Custom Decorative Wrapper & Ribbons';

    const hostileOrder = await prisma.order.create({
      data: {
        orderNumber: `DAH-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: '<script>alert("XSS")</script> & "Lady" O\'Connor 🌸💐',
        customerEmail: 'adversarial+test.email_99@sub-domain.co.uk',
        customerPhone: '9999999999',
        shippingAddressLine1: '<b style="color:red">Unit 404</b> & 100% Cotton Lane',
        shippingAddressLine2: null, // missing optional
        city: 'Bengaluru & Mysuru',
        state: 'Karnataka',
        pincode: '560001',
        deliveryInstructions: null, // missing optional
        trackingCourier: null, // missing optional
        trackingNumber: null, // missing optional
        subtotal: 149900,
        shippingFee: 0, // FREE shipping threshold
        taxAmount: 0,
        totalAmount: 149900,
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.PENDING_COD,
        items: {
          create: [
            {
              productName: longProductName,
              productSlug: 'ultra-long-crochet-bouquet',
              variantName: null, // missing optional
              personalizationText: null, // missing optional
              unitPrice: 149900,
              quantity: 2,
              lineSubtotal: 299800,
            },
            {
              productName: '<svg/onload=alert(1)> Crochet Daisy Hairclip "Pastel & Pearl"',
              productSlug: 'crochet-daisy-hairclip',
              variantName: 'Pastel Yellow & Gold Pearl / Medium',
              personalizationText: 'Special gift note: "May your day bloom with endless happiness! 🌸❤️✨" <3 & :)',
              unitPrice: 49900,
              quantity: 1,
              lineSubtotal: 49900,
            },
            {
              productName: 'Complimentary Handcrafted Crochet Floral Bookmark',
              productSlug: 'complimentary-bookmark',
              variantName: null,
              personalizationText: null,
              unitPrice: 0, // Zero price gift item
              quantity: 1,
              lineSubtotal: 0,
            },
          ],
        },
      },
      include: { items: true },
    });
    createdOrderIds.push(hostileOrder.id);

    // Capture output of sendMailSafely by mocking nodemailer transporter with inspection
    let capturedMails: { to: string; subject: string; html: string; text?: string }[] = [];
    (nodemailer as any).createTransport = () => {
      return {
        sendMail: async (options: any) => {
          capturedMails.push(options);
          return { messageId: 'adversarial-captured-msg-123' };
        },
      };
    };
    process.env.EMAIL_USER = 'valid-sender@divijaarthouse.com';
    process.env.EMAIL_PASS = 'valid-sender-pass';

    // 2.1: Test sendOrderConfirmationEmail on Hostile Order
    {
      capturedMails = [];
      const emailResult = await sendOrderConfirmationEmail(hostileOrder.id);
      assert(emailResult.success === true, 'P2.1-OrderConfirmTemplate', 'sendOrderConfirmationEmail completes successfully on hostile data');
      assert(capturedMails.length === 1, 'P2.1-OrderConfirmTemplate', 'Transporter intercepted 1 outgoing email');

      const mail = capturedMails[0];
      assert(mail.to === hostileOrder.customerEmail, 'P2.1-OrderConfirmTemplate', 'Recipient matches hostile customer email');
      assert(mail.subject.includes(hostileOrder.orderNumber), 'P2.1-OrderConfirmTemplate', 'Subject contains order number');

      const html = mail.html;
      // Well-formed HTML checks
      assert(html.includes('<!DOCTYPE html>'), 'P2.1-OrderConfirmTemplate', 'HTML contains standard DOCTYPE');
      assert(html.includes('<html') && html.includes('</html>'), 'P2.1-OrderConfirmTemplate', 'HTML has enclosing <html> tags');
      assert(html.includes('<body') && html.includes('</body>'), 'P2.1-OrderConfirmTemplate', 'HTML has enclosing <body> tags');
      assert(html.includes('background-color: #A32D3B'), 'P2.1-OrderConfirmTemplate', 'Uses brand primary color token (#A32D3B) in inline styles');

      // Order specifics
      assert(html.includes(hostileOrder.orderNumber), 'P2.1-OrderConfirmTemplate', 'Contains order number');
      assert(html.includes('FREE'), 'P2.1-OrderConfirmTemplate', 'Renders "FREE" when shipping fee is 0');
      assert(html.includes(longProductName), 'P2.1-OrderConfirmTemplate', 'Correctly embeds ultra-long product name without breaking layout');
      assert(html.includes('Variant: Pastel Yellow & Gold Pearl / Medium'), 'P2.1-OrderConfirmTemplate', 'Renders variant name when present');
      assert(
        html.includes('Note: &ldquo;Special gift note: "May your day bloom with endless happiness! 🌸❤️✨" <3 & :)&rdquo;'),
        'P2.1-OrderConfirmTemplate',
        'Renders personalization note with special characters and emojis'
      );
      assert(!html.includes('Variant: null') && !html.includes('Variant: undefined'), 'P2.1-OrderConfirmTemplate', 'Does not render "Variant: null" or undefined');
      assert(!html.includes('Note: &ldquo;null&rdquo;'), 'P2.1-OrderConfirmTemplate', 'Does not render "Note: null"');
      assert(!html.includes(', null') && !html.includes('null<br>'), 'P2.1-OrderConfirmTemplate', 'Gracefully omits missing addressLine2');

      // Plain text check
      assert(!!mail.text && mail.text.length > 50, 'P2.1-OrderConfirmTemplate', 'Generates non-empty plain text fallback');
      assert(mail.text!.includes(hostileOrder.orderNumber), 'P2.1-OrderConfirmTemplate', 'Text fallback includes order number');
    }

    // 2.2: Test sendAdminNewOrderNotification on Hostile Order
    {
      capturedMails = [];
      const adminResult = await sendAdminNewOrderNotification(hostileOrder.id);
      assert(adminResult.success === true, 'P2.2-AdminAlertTemplate', 'sendAdminNewOrderNotification completes on hostile data');
      assert(capturedMails.length === 1, 'P2.2-AdminAlertTemplate', 'Transporter intercepted admin email');

      const mail = capturedMails[0];
      const html = mail.html;
      assert(mail.subject.includes(hostileOrder.orderNumber), 'P2.2-AdminAlertTemplate', 'Subject contains order number');
      assert(html.includes('🌸 New Order Received'), 'P2.2-AdminAlertTemplate', 'Contains admin alert banner');

      // Total items quantity calculation: item 1 (qty 2) + item 2 (qty 1) + item 3 (qty 1) = 4 items
      assert(
        html.includes('4 item(s) across 3 line item(s)'),
        'P2.2-AdminAlertTemplate',
        'Calculates accurate total items count across line items'
      );
      assert(html.includes('/admin/orders'), 'P2.2-AdminAlertTemplate', 'Includes button linking to /admin/orders');
    }

    // 2.3: Test sendNewsletterWelcomeEmail with Adversarial Email Addresses
    {
      const adversarialEmails = [
        'priya.sharma@example.com',
        'user+tag_newsletter.2026@sub-domain.co.in',
        'artisan-enthusiast@domain.museum',
      ];

      for (const email of adversarialEmails) {
        capturedMails = [];
        const res = await sendNewsletterWelcomeEmail(email);
        assert(res.success === true, 'P2.3-NewsletterTemplate', `sendNewsletterWelcomeEmail succeeds for ${email}`);
        assert(capturedMails.length === 1, 'P2.3-NewsletterTemplate', 'Transporter received welcome email');

        const mail = capturedMails[0];
        assert(mail.to === email, 'P2.3-NewsletterTemplate', 'Recipient matches input email');
        assert(mail.html.includes('BLOOM10'), 'P2.3-NewsletterTemplate', 'Email contains welcome discount code BLOOM10');
        assert(mail.html.includes('10% OFF'), 'P2.3-NewsletterTemplate', 'Email contains discount offer copy');
        assert(mail.html.includes('/shop'), 'P2.3-NewsletterTemplate', 'Email contains link to catalog /shop');
      }
    }

    // Restore nodemailer and environment
    (nodemailer as any).createTransport = originalCreateTransport;
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;

    console.log('  Part 2 complete: All HTML email generator stress tests passed.\n');

    // =========================================================================
    // PART 3: Storefront App Router Route Rendering (Static & Dynamic)
    // =========================================================================
    console.log('--- PART 3: Storefront App Router Route Rendering Verification ---');

    // 3.1: Static Storefront Routes
    {
      const homeVNode = await HomePage();
      assert(!!homeVNode, 'P3.1-StaticRoutes', 'HomePage (/) renders valid React virtual DOM tree');

      const aboutVNode = AboutPage();
      assert(!!aboutVNode, 'P3.1-StaticRoutes', 'AboutPage (/about) renders valid React virtual DOM tree');

      const contactVNode = ContactPage();
      assert(!!contactVNode, 'P3.1-StaticRoutes', 'ContactPage (/contact) renders valid React virtual DOM tree');

      const shippingVNode = ShippingPolicyPage();
      assert(!!shippingVNode, 'P3.1-StaticRoutes', 'ShippingPolicyPage (/policies/shipping) renders');

      const returnsVNode = ReturnsPolicyPage();
      assert(!!returnsVNode, 'P3.1-StaticRoutes', 'ReturnsPolicyPage (/policies/returns) renders');

      const privacyVNode = PrivacyPolicyPage();
      assert(!!privacyVNode, 'P3.1-StaticRoutes', 'PrivacyPolicyPage (/policies/privacy) renders');

      const termsVNode = TermsPolicyPage();
      assert(!!termsVNode, 'P3.1-StaticRoutes', 'TermsPolicyPage (/policies/terms) renders');

      const trackEmptyVNode = TrackOrderPage({ searchParams: {} });
      assert(!!trackEmptyVNode, 'P3.1-StaticRoutes', 'TrackOrderPage (/track-order) renders with empty searchParams');

      const trackWithOrderVNode = TrackOrderPage({
        searchParams: { orderNumber: hostileOrder.orderNumber },
      });
      assert(!!trackWithOrderVNode, 'P3.1-StaticRoutes', 'TrackOrderPage renders with orderNumber searchParam');
    }

    // 3.2: Dynamic Catalog Route (/shop) with various filter combinations
    {
      // Default
      const shopDefault = await ShopPage({ searchParams: {} });
      assert(!!shopDefault, 'P3.2-ShopRoute', 'ShopPage renders with empty searchParams');

      // Category filter
      const shopCategory = await ShopPage({ searchParams: { category: 'bouquets' } });
      assert(!!shopCategory, 'P3.2-ShopRoute', 'ShopPage renders with category filter');

      // Price filter in INR
      const shopPrice = await ShopPage({
        searchParams: { minPrice: '500', maxPrice: '2000' },
      });
      assert(!!shopPrice, 'P3.2-ShopRoute', 'ShopPage renders with minPrice and maxPrice filters');

      // In stock & sorting
      const shopSort = await ShopPage({
        searchParams: { inStock: 'true', sort: 'price_asc' },
      });
      assert(!!shopSort, 'P3.2-ShopRoute', 'ShopPage renders with inStock=true and sort=price_asc');

      // Search query
      const shopSearch = await ShopPage({ searchParams: { q: 'peony' } });
      assert(!!shopSearch, 'P3.2-ShopRoute', 'ShopPage renders with search query');

      // Adversarial / Malicious searchParams (NaN prices, XSS strings, negative numbers)
      const shopAdversarial = await ShopPage({
        searchParams: {
          minPrice: 'not-a-number',
          maxPrice: '-999',
          sort: 'malicious_sort' as any,
          q: '<script>alert(1)</script>',
        },
      });
      assert(!!shopAdversarial, 'P3.2-ShopRoute', 'ShopPage gracefully survives adversarial/malformed query params');
    }

    // 3.3: Dynamic Collection Landing Page (/collections/[slug])
    {
      const category = await prisma.category.findFirst({ where: { isActive: true } });
      if (!category) {
        throw new Error('Database must have at least one active category.');
      }

      // Valid slug
      const collectionVNode = await CollectionPage({
        params: { slug: category.slug },
        searchParams: {},
      });
      assert(!!collectionVNode, 'P3.3-CollectionRoute', `CollectionPage renders for valid slug "${category.slug}"`);

      const collectionMeta = await generateCollectionMetadata({
        params: { slug: category.slug },
        searchParams: {},
      });
      assert(
        typeof collectionMeta.title === 'string' && collectionMeta.title.includes(category.name),
        'P3.3-CollectionRoute',
        'generateCollectionMetadata includes category name'
      );

      // Non-existent slug: must trigger Next.js notFound()
      let notFoundTriggered = false;
      try {
        await CollectionPage({
          params: { slug: 'non-existent-collection-slug-99999' },
          searchParams: {},
        });
      } catch (err: any) {
        notFoundTriggered =
          err?.digest === 'NEXT_NOT_FOUND' ||
          err?.message?.includes('NEXT_NOT_FOUND') ||
          err?.name === 'NotFoundError';
      }
      assert(notFoundTriggered, 'P3.3-CollectionRoute', 'CollectionPage triggers notFound() boundary for invalid slug');

      const notFoundMeta = await generateCollectionMetadata({
        params: { slug: 'non-existent-collection-slug-99999' },
        searchParams: {},
      });
      assert(
        notFoundMeta.title === 'Collection Not Found | DivijaArtHouse',
        'P3.3-CollectionRoute',
        'generateCollectionMetadata returns fallback title for invalid slug'
      );
    }

    // 3.4: Dynamic Product Detail Page (/products/[slug])
    {
      // Valid slug
      const pdpVNode = await ProductPage({ params: { slug: testProduct.slug } });
      assert(!!pdpVNode, 'P3.4-PDPRoute', `ProductPage renders for valid slug "${testProduct.slug}"`);

      const pdpMeta = await generateProductMetadata({ params: { slug: testProduct.slug } });
      assert(
        typeof pdpMeta.title === 'string' && pdpMeta.title.includes(testProduct.name),
        'P3.4-PDPRoute',
        'generateProductMetadata includes product name'
      );
      assert(!!pdpMeta.openGraph?.images, 'P3.4-PDPRoute', 'generateProductMetadata generates OpenGraph images');

      // Non-existent slug: must trigger Next.js notFound()
      let pdpNotFound = false;
      try {
        await ProductPage({ params: { slug: 'invalid-product-slug-xyz-12345' } });
      } catch (err: any) {
        pdpNotFound =
          err?.digest === 'NEXT_NOT_FOUND' ||
          err?.message?.includes('NEXT_NOT_FOUND') ||
          err?.name === 'NotFoundError';
      }
      assert(pdpNotFound, 'P3.4-PDPRoute', 'ProductPage triggers notFound() boundary for invalid slug');

      const pdpNotFoundMeta = await generateProductMetadata({
        params: { slug: 'invalid-product-slug-xyz-12345' },
      });
      assert(
        pdpNotFoundMeta.title === 'Product Not Found | DivijaArtHouse',
        'P3.4-PDPRoute',
        'generateProductMetadata returns fallback title for invalid slug'
      );
    }

    // 3.5: Dynamic Order Confirmation Page (/order-confirmation/[id])
    {
      // Valid order ID
      const orderConfirmationVNode = await OrderConfirmationPage({
        params: { id: hostileOrder.id },
      });
      assert(!!orderConfirmationVNode, 'P3.5-OrderConfirmationRoute', 'OrderConfirmationPage renders for valid order ID');

      const orderMeta = await generateOrderConfirmationMetadata({
        params: { id: hostileOrder.id },
      });
      assert(
        typeof orderMeta.title === 'string' && orderMeta.title.includes(hostileOrder.orderNumber),
        'P3.5-OrderConfirmationRoute',
        'generateOrderConfirmationMetadata includes orderNumber'
      );

      // Non-existent order ID: must trigger notFound()
      let orderNotFound = false;
      try {
        await OrderConfirmationPage({
          params: { id: 'non-existent-order-uuid-999999' },
        });
      } catch (err: any) {
        orderNotFound =
          err?.digest === 'NEXT_NOT_FOUND' ||
          err?.message?.includes('NEXT_NOT_FOUND') ||
          err?.name === 'NotFoundError';
      }
      assert(orderNotFound, 'P3.5-OrderConfirmationRoute', 'OrderConfirmationPage triggers notFound() for invalid ID');
    }

    // 3.6: Client Components Verification
    {
      assert(typeof CartPage === 'function', 'P3.6-ClientComponents', 'CartPage is an exported React function component');
      assert(typeof CheckoutPage === 'function', 'P3.6-ClientComponents', 'CheckoutPage is an exported React function component');
      assert(typeof WishlistPage === 'function', 'P3.6-ClientComponents', 'WishlistPage is an exported React function component');
    }

    console.log('  Part 3 complete: All storefront static & dynamic route rendering tests passed.\n');

    // =========================================================================
    // Final Summary
    // =========================================================================
    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;

    console.log('====================================================================');
    console.log(`🎉 EMPIRICAL VERIFICATION COMPLETE: ${passedCount}/${totalCount} TESTS PASSED`);
    console.log('====================================================================\n');
  } finally {
    // -------------------------------------------------------------------------
    // Guaranteed Cleanup
    // -------------------------------------------------------------------------
    console.log('Cleaning up adversarial test records from MySQL...');

    // Restore stock
    for (const adj of stockAdjustments) {
      try {
        await prisma.product.update({
          where: { id: adj.productId },
          data: { stockQuantity: { increment: adj.count } },
        });
      } catch (err) {
        console.warn(`Failed to restore stock for product ${adj.productId}:`, err);
      }
    }

    // Delete created orders
    if (createdOrderIds.length > 0) {
      try {
        await prisma.orderItem.deleteMany({
          where: { orderId: { in: createdOrderIds } },
        });
        await prisma.order.deleteMany({
          where: { id: { in: createdOrderIds } },
        });
        console.log(`Successfully removed ${createdOrderIds.length} temporary test orders.`);
      } catch (err) {
        console.warn('Failed to clean up test orders:', err);
      }
    }

    // Restore environment & nodemailer
    process.env = originalEnv;
    (nodemailer as any).createTransport = originalCreateTransport;

    await prisma.$disconnect();
  }
}

runAdversarialTestSuite().catch((err) => {
  console.error('❌ Adversarial stress test suite encountered fatal failure:', err);
  process.exit(1);
});
