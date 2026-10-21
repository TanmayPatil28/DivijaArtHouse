/**
 * Milestone 8 Automated Verification Test Suite
 * Verifies Supporting Pages, Contact Inquiries, Order Tracking, Nodemailer Email, and Policies.
 */

import { PrismaClient, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { submitContactInquiry } from '../src/actions/contact';
import { trackOrder } from '../src/actions/tracking';
import {
  sendOrderConfirmationEmail,
  sendAdminNewOrderNotification,
  sendNewsletterWelcomeEmail,
} from '../src/lib/email';
import AboutPage from '../src/app/(storefront)/about/page';
import ContactPage from '../src/app/(storefront)/contact/page';
import ShippingPolicyPage from '../src/app/(storefront)/policies/shipping/page';
import ReturnsPolicyPage from '../src/app/(storefront)/policies/returns/page';
import PrivacyPolicyPage from '../src/app/(storefront)/policies/privacy/page';
import TermsPolicyPage from '../src/app/(storefront)/policies/terms/page';
import TrackOrderPage from '../src/app/(storefront)/track-order/page';

const prisma = new PrismaClient();

async function runM8Verification() {
  console.log('🌸 DivijaArtHouse - Milestone 8 Automated Verification Suite');
  console.log('============================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      if (details) console.error(`     Details: ${details}`);
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  const createdInquiryIds: string[] = [];
  let testOrderId: string | null = null;

  try {
    // -------------------------------------------------------------------------
    // Test Group 1: Contact Inquiry Server Action & Database Persistence
    // -------------------------------------------------------------------------
    console.log('Test Group 1: Contact Inquiry Server Action & DB Persistence...');

    // 1.1 Valid inquiry submission
    const validInquiryData = {
      name: 'Radha Patel',
      email: 'radha.patel@example.com',
      phone: '9876543210',
      subject: 'Custom Bouquet Request',
      message: 'Hello Divija Studio, I would love a custom pastel peony and lavender bouquet for an anniversary!',
    };

    const validResult = await submitContactInquiry(validInquiryData);
    assert(validResult.success === true, 'submitContactInquiry succeeds with valid data');
    assert(!!validResult.inquiryId, 'submitContactInquiry returns created inquiryId');

    if (validResult.inquiryId) {
      createdInquiryIds.push(validResult.inquiryId);

      const dbInquiry = await prisma.contactInquiry.findUnique({
        where: { id: validResult.inquiryId },
      });

      assert(!!dbInquiry, 'Inquiry successfully persisted in Prisma contactInquiry table');
      assert(dbInquiry?.name === 'Radha Patel', 'Inquiry name matches input');
      assert(dbInquiry?.email === 'radha.patel@example.com', 'Inquiry email matches input');
      assert(dbInquiry?.phone === '9876543210', 'Inquiry phone matches input');
      assert(dbInquiry?.subject === 'Custom Bouquet Request', 'Inquiry subject matches input');
      assert(dbInquiry?.status === 'NEW', 'Inquiry initial status is NEW');
    }

    // 1.2 Validation failure with invalid email
    const invalidEmailResult = await submitContactInquiry({
      name: 'Priya',
      email: 'not-an-email',
      message: 'This is a test message that is long enough.',
    });
    assert(invalidEmailResult.success === false, 'submitContactInquiry rejects invalid email format');
    assert(!!invalidEmailResult.errors?.email, 'Returns field-specific error for email');

    // 1.3 Validation failure with short message
    const shortMsgResult = await submitContactInquiry({
      name: 'Priya',
      email: 'priya@example.com',
      message: 'Hi',
    });
    assert(shortMsgResult.success === false, 'submitContactInquiry rejects short messages (<10 chars)');
    assert(!!shortMsgResult.errors?.message, 'Returns field-specific error for message');

    // -------------------------------------------------------------------------
    // Test Group 2: Public Order Tracking Server Action
    // -------------------------------------------------------------------------
    console.log('\nTest Group 2: Public Order Tracking Server Action & Stepper Mapping...');

    // Ensure we have a sample order in database to test tracking against
    let testOrder = await prisma.order.findFirst({
      include: { items: true },
    });

    if (!testOrder) {
      // Create a test order if none exists
      testOrder = await prisma.order.create({
        data: {
          orderNumber: 'DAH-2026-999001',
          customerName: 'Meera Iyer',
          customerEmail: 'meera@example.com',
          customerPhone: '9876543210',
          shippingAddressLine1: 'Villa 12, Rosewood Estates',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          subtotal: 149900,
          shippingFee: 0,
          totalAmount: 149900,
          paymentMethod: PaymentMethod.COD,
          paymentStatus: PaymentStatus.PENDING,
          orderStatus: OrderStatus.PROCESSING,
          trackingCourier: 'Blue Dart',
          trackingNumber: 'BD987654321IN',
          items: {
            create: [
              {
                productName: 'Blushing Peony & Rose Handcrafted Bouquet',
                productSlug: 'blushing-peony-rose-handcrafted-bouquet',
                variantName: 'Blush Pink',
                unitPrice: 149900,
                quantity: 1,
                lineSubtotal: 149900,
                personalizationText: 'Happy Birthday Mom!',
              },
            ],
          },
        },
        include: { items: true },
      });
      testOrderId = testOrder.id;
    }

    // 2.1 Track existing order
    const trackingRes = await trackOrder(testOrder.orderNumber);
    assert(trackingRes.success === true, 'trackOrder succeeds for existing order number');
    assert(!!trackingRes.order, 'trackOrder returns sanitized order tracking payload');
    assert(trackingRes.order?.orderNumber === testOrder.orderNumber, 'Tracking payload matches orderNumber');
    assert(typeof trackingRes.order?.currentStep === 'number', 'Tracking payload includes numeric currentStep');
    assert(trackingRes.order!.currentStep >= 1 && trackingRes.order!.currentStep <= 4, 'currentStep is within valid 1..4 range');
    assert(!!trackingRes.order?.estimatedDelivery, 'Tracking payload includes estimated delivery text');
    assert(trackingRes.order!.items.length > 0, 'Tracking payload includes order items');
    assert(trackingRes.order?.shippingCity === testOrder.city, 'Tracking payload includes sanitized city destination');

    // 2.2 Case and whitespace normalization in order lookup
    const normalizedRes = await trackOrder(`  ${testOrder.orderNumber.toLowerCase()}  `);
    assert(normalizedRes.success === true, 'trackOrder handles lowercase & padded order number input');

    // 2.3 Non-existent order number returns user-friendly error
    const nonExistentRes = await trackOrder('DAH-9999-000000');
    assert(nonExistentRes.success === false, 'trackOrder returns false for non-existent order number');
    assert(typeof nonExistentRes.error === 'string', 'trackOrder returns descriptive error string');

    // -------------------------------------------------------------------------
    // Test Group 3: Nodemailer Email Integration & Simulation Fallback
    // -------------------------------------------------------------------------
    console.log('\nTest Group 3: Nodemailer Email Integration & Fallbacks...');

    // 3.1 Customer Order Confirmation Email
    const customerEmailRes = await sendOrderConfirmationEmail(testOrder.id);
    assert(customerEmailRes.success === true, 'sendOrderConfirmationEmail succeeds without throwing');
    assert(
      customerEmailRes.simulated === true || !!customerEmailRes.messageId,
      'Email executed via console simulation fallback or live transporter'
    );

    // 3.2 Admin New Order Notification Email
    const adminEmailRes = await sendAdminNewOrderNotification(testOrder.id);
    assert(adminEmailRes.success === true, 'sendAdminNewOrderNotification succeeds without throwing');
    assert(
      adminEmailRes.simulated === true || !!adminEmailRes.messageId,
      'Admin notification executed via simulation or live transporter'
    );

    // 3.3 Newsletter Welcome Email with Coupon
    const newsletterEmailRes = await sendNewsletterWelcomeEmail('test.subscriber@example.com');
    assert(newsletterEmailRes.success === true, 'sendNewsletterWelcomeEmail succeeds without throwing');
    assert(
      newsletterEmailRes.simulated === true || !!newsletterEmailRes.messageId,
      'Welcome email executed via simulation or live transporter'
    );

    // 3.4 Non-existent order error handling
    const invalidOrderEmailRes = await sendOrderConfirmationEmail('non-existent-order-id');
    assert(invalidOrderEmailRes.success === false, 'sendOrderConfirmationEmail safely handles missing order');

    // -------------------------------------------------------------------------
    // Test Group 4: Storefront Supporting Pages & Policies Rendering
    // -------------------------------------------------------------------------
    console.log('\nTest Group 4: Storefront Supporting Pages Component Verification...');

    assert(typeof AboutPage === 'function', 'AboutPage is a valid exported React component');
    assert(typeof ContactPage === 'function', 'ContactPage is a valid exported React component');
    assert(typeof ShippingPolicyPage === 'function', 'ShippingPolicyPage is a valid exported React component');
    assert(typeof ReturnsPolicyPage === 'function', 'ReturnsPolicyPage is a valid exported React component');
    assert(typeof PrivacyPolicyPage === 'function', 'PrivacyPolicyPage is a valid exported React component');
    assert(typeof TermsPolicyPage === 'function', 'TermsPolicyPage is a valid exported React component');
    assert(typeof TrackOrderPage === 'function', 'TrackOrderPage is a valid exported React component');

    // Verify AboutPage renders without errors
    const aboutElement = AboutPage();
    assert(!!aboutElement, 'AboutPage renders React virtual DOM tree');

    // Verify Policy Pages render without errors
    assert(!!ShippingPolicyPage(), 'ShippingPolicyPage renders React virtual DOM tree');
    assert(!!ReturnsPolicyPage(), 'ReturnsPolicyPage renders React virtual DOM tree');
    assert(!!PrivacyPolicyPage(), 'PrivacyPolicyPage renders React virtual DOM tree');
    assert(!!TermsPolicyPage(), 'TermsPolicyPage renders React virtual DOM tree');

    // Verify TrackOrderPage renders with empty params and with specific orderNumber
    assert(!!TrackOrderPage({ searchParams: {} }), 'TrackOrderPage renders with empty searchParams');
    assert(
      !!TrackOrderPage({ searchParams: { orderNumber: testOrder.orderNumber } }),
      'TrackOrderPage renders with orderNumber searchParam'
    );

    console.log('\n============================================================');
    console.log(`🎉 All ${passedTests}/${totalTests} Milestone 8 tests PASSED successfully!`);
    console.log('============================================================\n');
  } finally {
    // Cleanup created test records
    if (createdInquiryIds.length > 0) {
      await prisma.contactInquiry.deleteMany({
        where: { id: { in: createdInquiryIds } },
      });
      console.log(`Cleaned up ${createdInquiryIds.length} test contact inquiries.`);
    }

    if (testOrderId) {
      await prisma.order.delete({
        where: { id: testOrderId },
      });
      console.log(`Cleaned up temporary test order (${testOrderId}).`);
    }

    await prisma.$disconnect();
  }
}

runM8Verification().catch((err) => {
  console.error('❌ Milestone 8 verification suite failed:', err);
  process.exit(1);
});
