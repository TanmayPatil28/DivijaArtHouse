/**
 * DivijaArtHouse - Milestone 8 Empirical & Adversarial Stress Test Suite
 * Challenger 1: Contact Inquiries and Public Order Tracking Stress Testing
 *
 * This test suite stress-tests:
 * 1. Contact Form Input Boundaries & Validation Hardening (blank payloads, boundaries)
 * 2. Contact Form Email Syntax Hardening & Case Normalization
 * 3. Contact Form Security (XSS strings, SQLi, Unicode/Emoji, status: 'NEW', multi-signature)
 * 4. Order Tracking Input Hardening & Error Handling (non-existent IDs, empty inputs, no 500 crash)
 * 5. Order Tracking Case & Whitespace Normalization (lowercase, mixed case, tabs/newlines)
 * 6. Order Tracking SQL Injection Attacks (union, drop table, sleep, auth bypass)
 * 7. Public Tracking PII & Address Sanitization Audit (addressLine1, name, email, phone, pincode)
 * 8. Order Tracking Stepper Mapping & Delivery Window Logic (all OrderStatus enum values)
 * 9. Concurrency & Connection Stress (simultaneous contact submissions and lookups)
 */

import { PrismaClient, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { submitContactInquiry, type ContactActionResult } from '../src/actions/contact';
import { trackOrder, type TrackOrderResult } from '../src/actions/tracking';

const prisma = new PrismaClient();

interface TestAssertion {
  suite: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

const assertions: TestAssertion[] = [];

function record(
  suite: string,
  name: string,
  passed: boolean,
  expected: string,
  actual: string,
  details?: string
) {
  assertions.push({ suite, name, passed, expected, actual, details });
  const statusIcon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${statusIcon} [${suite}] ${name}`);
  if (!passed) {
    console.error(`     Expected: ${expected}`);
    console.error(`     Actual:   ${actual}`);
    if (details) console.error(`     Details:  ${details}`);
  }
}

async function runAdversarialSuite() {
  console.log('========================================================================');
  console.log('⚡ DivijaArtHouse - Milestone 8 Adversarial & Empirical Test Suite');
  console.log('   Target: Contact Inquiries & Public Order Tracking');
  console.log('========================================================================\n');

  const createdInquiryIds: string[] = [];
  const createdOrderIds: string[] = [];

  try {
    // =========================================================================
    // SUITE 1: Contact Form Input Boundaries & Validation Hardening
    // =========================================================================
    console.log('📌 SUITE 1: Contact Form Input Boundaries & Validation Hardening');

    // 1.1 Empty payload {}
    const res1_1 = await submitContactInquiry({} as any);
    record(
      'SUITE 1',
      '1.1 Empty payload {} rejected gracefully',
      res1_1.success === false && !!res1_1.errors?.name && !!res1_1.errors?.email && !!res1_1.errors?.message,
      'success: false with field errors for name, email, message',
      `success: ${res1_1.success}, errors: ${Object.keys(res1_1.errors || {}).join(', ')}`
    );

    // 1.2 null / undefined payload
    const res1_2 = await submitContactInquiry(null as any);
    record(
      'SUITE 1',
      '1.2 Null payload handled gracefully without crash',
      res1_2.success === false,
      'success: false without throwing exception',
      `success: ${res1_2.success}, message: ${res1_2.message}`
    );

    // 1.3 Empty FormData (no keys appended)
    const emptyFormData = new FormData();
    const res1_3 = await submitContactInquiry(emptyFormData);
    record(
      'SUITE 1',
      '1.3 Empty FormData rejected with validation errors',
      res1_3.success === false && !!res1_3.errors?.name && !!res1_3.errors?.email && !!res1_3.errors?.message,
      'success: false with field errors for name, email, message',
      `success: ${res1_3.success}, errors: ${Object.keys(res1_3.errors || {}).join(', ')}`
    );

    // 1.4 Whitespace-only fields
    const res1_4 = await submitContactInquiry({
      name: '   ',
      email: '   ',
      message: '          ',
    });
    record(
      'SUITE 1',
      '1.4 Whitespace-only fields rejected',
      res1_4.success === false && !!res1_4.errors?.name && !!res1_4.errors?.email && !!res1_4.errors?.message,
      'success: false with errors on all whitespace fields',
      `success: ${res1_4.success}, errors: ${Object.keys(res1_4.errors || {}).join(', ')}`
    );

    // 1.5 Name boundary: 1 character (min 2)
    const res1_5 = await submitContactInquiry({
      name: 'A',
      email: 'test@example.com',
      message: 'Hello, this is a message exceeding 10 characters.',
    });
    record(
      'SUITE 1',
      '1.5 Name length < 2 rejected',
      res1_5.success === false && !!res1_5.errors?.name,
      'success: false with name error',
      `success: ${res1_5.success}, errors: ${JSON.stringify(res1_5.errors?.name)}`
    );

    // 1.6 Name boundary: 2 characters (boundary min)
    const res1_6 = await submitContactInquiry({
      name: 'Jo',
      email: 'jo@example.com',
      message: 'Valid message exceeding 10 chars long.',
    });
    if (res1_6.inquiryId) createdInquiryIds.push(res1_6.inquiryId);
    record(
      'SUITE 1',
      '1.6 Name length = 2 accepted at boundary',
      res1_6.success === true && !!res1_6.inquiryId,
      'success: true with inquiryId',
      `success: ${res1_6.success}, inquiryId: ${res1_6.inquiryId}`
    );

    // 1.7 Name boundary: 100 characters (boundary max)
    const hundredCharName = 'A'.repeat(100);
    const res1_7 = await submitContactInquiry({
      name: hundredCharName,
      email: 'hundred@example.com',
      message: 'Valid message exceeding 10 chars long.',
    });
    if (res1_7.inquiryId) createdInquiryIds.push(res1_7.inquiryId);
    record(
      'SUITE 1',
      '1.7 Name length = 100 accepted at boundary',
      res1_7.success === true && !!res1_7.inquiryId,
      'success: true with inquiryId',
      `success: ${res1_7.success}`
    );

    // 1.8 Name boundary: 101 characters (> 100 max)
    const res1_8 = await submitContactInquiry({
      name: 'A'.repeat(101),
      email: 'overflow@example.com',
      message: 'Valid message exceeding 10 chars long.',
    });
    record(
      'SUITE 1',
      '1.8 Name length = 101 rejected',
      res1_8.success === false && !!res1_8.errors?.name,
      'success: false with name error',
      `success: ${res1_8.success}`
    );

    // 1.9 Message boundary: 0 characters
    const res1_9 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      message: '',
    });
    record(
      'SUITE 1',
      '1.9 Message length = 0 rejected',
      res1_9.success === false && !!res1_9.errors?.message,
      'success: false with message error',
      `success: ${res1_9.success}`
    );

    // 1.10 Message boundary: 9 characters (< 10 min)
    const res1_10 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      message: '123456789',
    });
    record(
      'SUITE 1',
      '1.10 Message length = 9 rejected',
      res1_10.success === false && !!res1_10.errors?.message,
      'success: false with message error',
      `success: ${res1_10.success}`
    );

    // 1.11 Message boundary: 10 characters (boundary min)
    const res1_11 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      message: '1234567890',
    });
    if (res1_11.inquiryId) createdInquiryIds.push(res1_11.inquiryId);
    record(
      'SUITE 1',
      '1.11 Message length = 10 accepted at boundary',
      res1_11.success === true && !!res1_11.inquiryId,
      'success: true with inquiryId',
      `success: ${res1_11.success}`
    );

    // 1.12 Message boundary: 3000 characters (boundary max)
    const res1_12 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      message: 'M'.repeat(3000),
    });
    if (res1_12.inquiryId) createdInquiryIds.push(res1_12.inquiryId);
    record(
      'SUITE 1',
      '1.12 Message length = 3000 accepted at boundary',
      res1_12.success === true && !!res1_12.inquiryId,
      'success: true with inquiryId',
      `success: ${res1_12.success}`
    );

    // 1.13 Message boundary: 3001 characters (> 3000 max)
    const res1_13 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      message: 'M'.repeat(3001),
    });
    record(
      'SUITE 1',
      '1.13 Message length = 3001 rejected',
      res1_13.success === false && !!res1_13.errors?.message,
      'success: false with message error',
      `success: ${res1_13.success}`
    );

    // 1.14 Subject boundary: 150 characters (boundary max)
    const res1_14 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      subject: 'S'.repeat(150),
      message: 'Valid message exceeding 10 characters long.',
    });
    if (res1_14.inquiryId) createdInquiryIds.push(res1_14.inquiryId);
    record(
      'SUITE 1',
      '1.14 Subject length = 150 accepted at boundary',
      res1_14.success === true && !!res1_14.inquiryId,
      'success: true with inquiryId',
      `success: ${res1_14.success}`
    );

    // 1.15 Subject boundary: 151 characters (> 150 max)
    const res1_15 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      subject: 'S'.repeat(151),
      message: 'Valid message exceeding 10 characters long.',
    });
    record(
      'SUITE 1',
      '1.15 Subject length = 151 rejected',
      res1_15.success === false && !!res1_15.errors?.subject,
      'success: false with subject error',
      `success: ${res1_15.success}`
    );

    // 1.16 Phone validation: omitted/empty phone accepted
    const res1_16 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      phone: '',
      message: 'Valid message exceeding 10 characters long.',
    });
    if (res1_16.inquiryId) createdInquiryIds.push(res1_16.inquiryId);
    record(
      'SUITE 1',
      '1.16 Empty phone string accepted as optional',
      res1_16.success === true && !!res1_16.inquiryId,
      'success: true with inquiryId',
      `success: ${res1_16.success}`
    );

    // 1.17 Phone validation: valid 10-digit ("9876543210") accepted
    const res1_17 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      phone: '9876543210',
      message: 'Valid message exceeding 10 characters long.',
    });
    if (res1_17.inquiryId) createdInquiryIds.push(res1_17.inquiryId);
    record(
      'SUITE 1',
      '1.17 Valid 10-digit Indian phone accepted',
      res1_17.success === true && !!res1_17.inquiryId,
      'success: true with inquiryId',
      `success: ${res1_17.success}`
    );

    // 1.18 Phone validation: valid phone with +91 and spaces
    const res1_18 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      phone: '+91 98765-43210',
      message: 'Valid message exceeding 10 characters long.',
    });
    if (res1_18.inquiryId) createdInquiryIds.push(res1_18.inquiryId);
    record(
      'SUITE 1',
      '1.18 Formatted phone (+91 98765-43210) accepted',
      res1_18.success === true && !!res1_18.inquiryId,
      'success: true with inquiryId',
      `success: ${res1_18.success}`
    );

    // 1.19 Phone validation: starting with invalid Indian mobile prefix (1-5)
    const res1_19 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      phone: '1234567890',
      message: 'Valid message exceeding 10 characters long.',
    });
    record(
      'SUITE 1',
      '1.19 Phone starting with 1-5 rejected',
      res1_19.success === false && !!res1_19.errors?.phone,
      'success: false with phone error',
      `success: ${res1_19.success}`
    );

    // 1.20 Phone validation: incomplete phone number
    const res1_20 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      phone: '98765',
      message: 'Valid message exceeding 10 characters long.',
    });
    record(
      'SUITE 1',
      '1.20 Short/incomplete phone rejected',
      res1_20.success === false && !!res1_20.errors?.phone,
      'success: false with phone error',
      `success: ${res1_20.success}`
    );

    // 1.21 Phone validation: alpha characters in phone
    const res1_21 = await submitContactInquiry({
      name: 'Valid Name',
      email: 'valid@example.com',
      phone: '98765abcde',
      message: 'Valid message exceeding 10 characters long.',
    });
    record(
      'SUITE 1',
      '1.21 Non-numeric phone rejected',
      res1_21.success === false && !!res1_21.errors?.phone,
      'success: false with phone error',
      `success: ${res1_21.success}`
    );

    // =========================================================================
    // SUITE 2: Contact Form Email Hardening & Normalization
    // =========================================================================
    console.log('\n📌 SUITE 2: Contact Form Email Hardening & Normalization');

    const malformedEmails = [
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      'username@domain..com',
      'user name@domain.com',
      'user@domain,com',
      'user@',
      'A'.repeat(250) + '@toolongdomainnameverylong' + 'B'.repeat(50) + '.com',
    ];

    for (const badEmail of malformedEmails) {
      const res = await submitContactInquiry({
        name: 'Email Tester',
        email: badEmail,
        message: 'Valid message exceeding 10 characters long.',
      });
      record(
        'SUITE 2',
        `2.1 Reject invalid email: "${badEmail.slice(0, 30)}..."`,
        res.success === false && !!res.errors?.email,
        'success: false with email error',
        `success: ${res.success}`
      );
    }

    // 2.2 Email Case Normalization & Whitespace Trimming
    const mixedEmail = '  Adversarial.Tester@DIVIJA-ART.TEST  ';
    const res2_2 = await submitContactInquiry({
      name: 'Case Normalization Tester',
      email: mixedEmail,
      message: 'Testing lowercase email normalization in database.',
    });
    if (res2_2.inquiryId) {
      createdInquiryIds.push(res2_2.inquiryId);
      const dbRecord = await prisma.contactInquiry.findUnique({
        where: { id: res2_2.inquiryId },
      });
      record(
        'SUITE 2',
        '2.2 Email normalized to lowercase and trimmed in MySQL',
        dbRecord?.email === 'adversarial.tester@divija-art.test',
        'adversarial.tester@divija-art.test',
        dbRecord?.email || 'null'
      );
    }

    // =========================================================================
    // SUITE 3: Contact Form Security, Special Characters & Persistence
    // =========================================================================
    console.log('\n📌 SUITE 3: Contact Form Security, Special Characters & MySQL Persistence');

    // 3.1 XSS payload in name, subject, and message
    const xssPayload = {
      name: '<script>alert("XSS-Name")</script>',
      email: 'xss.victim@example.com',
      subject: '"><svg onload=alert("XSS-Subject")>',
      message: '<p>Inquiry message with <script>evil()</script> and &amp; entities.</p>',
    };
    const res3_1 = await submitContactInquiry(xssPayload);
    if (res3_1.inquiryId) {
      createdInquiryIds.push(res3_1.inquiryId);
      const dbXSS = await prisma.contactInquiry.findUnique({
        where: { id: res3_1.inquiryId },
      });
      record(
        'SUITE 3',
        '3.1 XSS strings safely persisted without syntax corruption or execution',
        dbXSS?.name === xssPayload.name && dbXSS?.subject === xssPayload.subject,
        'Exact string persisted without corruption',
        `db name: ${dbXSS?.name}`
      );
    }

    // 3.2 SQL Injection strings in input fields
    const sqliPayload = {
      name: "Robert'); DROP TABLE contact_inquiries;--",
      email: "sqli@example.com",
      subject: "' OR '1'='1' -- ",
      message: "SELECT * FROM users WHERE '1'='1'; UPDATE orders SET totalAmount=0;",
    };
    const res3_2 = await submitContactInquiry(sqliPayload);
    if (res3_2.inquiryId) {
      createdInquiryIds.push(res3_2.inquiryId);
      // Verify table still exists and record is present
      const count = await prisma.contactInquiry.count();
      record(
        'SUITE 3',
        '3.2 SQL Injection strings safely parameterized (no table drop / syntax error)',
        res3_2.success === true && count > 0,
        'success: true, table intact',
        `success: ${res3_2.success}, table count: ${count}`
      );
    }

    // 3.3 Unicode and Emojis
    const unicodePayload = {
      name: 'दिविजा क्राफ्ट्स 🌸',
      email: 'unicode.crochet@example.com',
      subject: 'Handmade Crochet Rose 🌹 & Peony 💐',
      message: 'नमस्ते! We love your hand-knitted everlasting bouquets 🌷✨. Please deliver with ribbon.',
    };
    const res3_3 = await submitContactInquiry(unicodePayload);
    if (res3_3.inquiryId) {
      createdInquiryIds.push(res3_3.inquiryId);
      const dbUnicode = await prisma.contactInquiry.findUnique({
        where: { id: res3_3.inquiryId },
      });
      record(
        'SUITE 3',
        '3.3 Multilingual Devanagari and Emojis stored accurately in MySQL',
        dbUnicode?.name === unicodePayload.name && dbUnicode?.message === unicodePayload.message,
        'UTF-8 / Emojis preserved verbatim',
        `Stored name: ${dbUnicode?.name}`
      );
    }

    // 3.4 Initial Database Status = 'NEW'
    const res3_4 = await submitContactInquiry({
      name: 'Status Checker',
      email: 'status.check@example.com',
      message: 'Verifying initial contact inquiry status in database.',
    });
    if (res3_4.inquiryId) {
      createdInquiryIds.push(res3_4.inquiryId);
      const dbStatus = await prisma.contactInquiry.findUnique({
        where: { id: res3_4.inquiryId },
      });
      record(
        'SUITE 3',
        '3.4 Contact inquiry initial status is strictly "NEW"',
        dbStatus?.status === 'NEW',
        'NEW',
        dbStatus?.status || 'null'
      );
    }

    // 3.5 Invocations via all 3 supported signatures
    // 3.5a: Plain JavaScript object
    const res3_5a = await submitContactInquiry({
      name: 'Sig Plain Object',
      email: 'sig.obj@example.com',
      message: 'Testing plain JS object signature invocation.',
    });
    if (res3_5a.inquiryId) createdInquiryIds.push(res3_5a.inquiryId);

    // 3.5b: Single FormData argument
    const fd1 = new FormData();
    fd1.append('name', 'Sig Single FormData');
    fd1.append('email', 'sig.fd1@example.com');
    fd1.append('message', 'Testing single FormData signature invocation.');
    const res3_5b = await submitContactInquiry(fd1);
    if (res3_5b.inquiryId) createdInquiryIds.push(res3_5b.inquiryId);

    // 3.5c: useFormState signature: submitContactInquiry(prevState, formData)
    const fd2 = new FormData();
    fd2.append('name', 'Sig useFormState');
    fd2.append('email', 'sig.useformstate@example.com');
    fd2.append('message', 'Testing useFormState (prevState, formData) signature.');
    const res3_5c = await submitContactInquiry(null, fd2);
    if (res3_5c.inquiryId) createdInquiryIds.push(res3_5c.inquiryId);

    record(
      'SUITE 3',
      '3.5 Multi-signature invocation support (Plain Object, FormData, useFormState)',
      res3_5a.success && res3_5b.success && res3_5c.success,
      'All 3 signatures return success: true',
      `obj: ${res3_5a.success}, fd: ${res3_5b.success}, useFormState: ${res3_5c.success}`
    );

    // =========================================================================
    // Create Test Fixture Orders for Tracking Stress Testing
    // =========================================================================
    console.log('\n--- Setting up Order Tracking Test Fixtures in Database ---');

    // Create a base confidential order with sensitive PII for leakage testing
    const confidentialOrder = await prisma.order.create({
      data: {
        orderNumber: 'DAH-2026-CONFIDENTIAL99',
        customerName: 'Secret Customer Aditi Sharma',
        customerEmail: 'confidential.aditi@secret-corp.internal',
        customerPhone: '9988776655',
        shippingAddressLine1: 'Penthouse 1402, Highly Secret Tower B',
        shippingAddressLine2: 'Off Private Restricted Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560099',
        deliveryInstructions: 'Ring private gate bell twice, leave with bodyguard',
        subtotal: 249900,
        shippingFee: 0,
        totalAmount: 249900,
        paymentMethod: PaymentMethod.RAZORPAY,
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.PROCESSING,
        razorpayOrderId: 'order_sec_12345',
        razorpayPaymentId: 'pay_sec_67890',
        razorpaySignature: 'sig_sec_abcdef',
        trackingCourier: 'Blue Dart Express',
        trackingNumber: 'BD123456789IN',
        items: {
          create: [
            {
              productName: 'Everlasting Peony & Rose Garden Bouquet',
              productSlug: 'everlasting-peony-rose-garden-bouquet',
              variantName: 'Blush & White',
              unitPrice: 249900,
              quantity: 1,
              lineSubtotal: 249900,
              personalizationText: 'To my dearest sister, congratulations!',
            },
          ],
        },
      },
      include: { items: true },
    });
    createdOrderIds.push(confidentialOrder.id);

    // =========================================================================
    // SUITE 4: Order Tracking Input Hardening & Error Handling
    // =========================================================================
    console.log('📌 SUITE 4: Order Tracking Input Hardening & Error Handling');

    // 4.1 Non-existent order numbers return success: false, friendly error, zero 500 crashes
    const nonExistentOrders = [
      'DAH-9999-999999',
      'DAH-0000-000000',
      'NON-EXISTENT-ORDER-KEY',
      'DAH-2026-XYZ123456',
    ];

    for (const badNum of nonExistentOrders) {
      const res = await trackOrder(badNum);
      record(
        'SUITE 4',
        `4.1 Non-existent order "${badNum}" returns friendly error`,
        res.success === false && typeof res.error === 'string' && res.error.includes('No order found'),
        'success: false with friendly error message',
        `success: ${res.success}, error: "${res.error}"`
      );
    }

    // 4.2 Blank and empty strings
    const blankInputs = ['', '   ', '\t', '\n'];
    for (const blank of blankInputs) {
      const res = await trackOrder(blank);
      record(
        'SUITE 4',
        `4.2 Blank/whitespace input "${blank.replace(/\s/g, '\\s')}" rejected gracefully`,
        res.success === false && typeof res.error === 'string' && res.error.includes('Please enter a valid order number'),
        'success: false with prompt error',
        `success: ${res.success}, error: "${res.error}"`
      );
    }

    // 4.3 Null / undefined input
    const res4_3a = await trackOrder(null as any);
    const res4_3b = await trackOrder(undefined as any);
    record(
      'SUITE 4',
      '4.3 Null / undefined input handled gracefully without crash',
      res4_3a.success === false && res4_3b.success === false,
      'Both return success: false without throwing exception',
      `null res: ${res4_3a.success}, undefined res: ${res4_3b.success}`
    );

    // =========================================================================
    // SUITE 5: Order Tracking Normalization & Flexibility
    // =========================================================================
    console.log('\n📌 SUITE 5: Order Tracking Case & Whitespace Normalization');

    // 5.1 Lowercase lookup
    const res5_1 = await trackOrder(confidentialOrder.orderNumber.toLowerCase());
    record(
      'SUITE 5',
      '5.1 Lowercase order number ("dah-2026-...") resolves successfully',
      res5_1.success === true && res5_1.order?.orderNumber === confidentialOrder.orderNumber,
      `orderNumber: ${confidentialOrder.orderNumber}`,
      `returned: ${res5_1.order?.orderNumber}`
    );

    // 5.2 Mixed-case lookup
    const mixedCaseNum = 'DaH-2026-CoNfIdEnTiAl99';
    const res5_2 = await trackOrder(mixedCaseNum);
    record(
      'SUITE 5',
      '5.2 Mixed-case order number resolves successfully',
      res5_2.success === true && res5_2.order?.orderNumber === confidentialOrder.orderNumber,
      `orderNumber: ${confidentialOrder.orderNumber}`,
      `returned: ${res5_2.order?.orderNumber}`
    );

    // 5.3 Whitespace padded lookup
    const res5_3 = await trackOrder(`   ${confidentialOrder.orderNumber}   `);
    record(
      'SUITE 5',
      '5.3 Space-padded order number resolves successfully',
      res5_3.success === true && res5_3.order?.orderNumber === confidentialOrder.orderNumber,
      `orderNumber: ${confidentialOrder.orderNumber}`,
      `returned: ${res5_3.order?.orderNumber}`
    );

    // 5.4 Tabs and newlines padded lookup
    const res5_4 = await trackOrder(`\t\n${confidentialOrder.orderNumber}\r\n`);
    record(
      'SUITE 5',
      '5.4 Tab/newline padded order number resolves successfully',
      res5_4.success === true && res5_4.order?.orderNumber === confidentialOrder.orderNumber,
      `orderNumber: ${confidentialOrder.orderNumber}`,
      `returned: ${res5_4.order?.orderNumber}`
    );

    // =========================================================================
    // SUITE 6: Order Tracking SQL Injection Attacks
    // =========================================================================
    console.log('\n📌 SUITE 6: Order Tracking SQL Injection Attacks');

    const sqliAttempts = [
      "' OR 1=1 --",
      "DAH-2026' OR '1'='1",
      "'; DROP TABLE orders; --",
      '" UNION SELECT * FROM users --',
      "' UNION ALL SELECT NULL, NULL, NULL --",
      "admin'--",
      "1; WAITFOR DELAY '0:0:5'--",
      "DAH-2026' AND 1=(SELECT COUNT(*) FROM users) --",
    ];

    for (const sqli of sqliAttempts) {
      const res = await trackOrder(sqli);
      // Query should gracefully fail to find order, never execute raw SQL or crash
      record(
        'SUITE 6',
        `6.1 SQLi injection attack safely handled: "${sqli.slice(0, 25)}"`,
        res.success === false && typeof res.error === 'string',
        'success: false without SQL error or crash',
        `success: ${res.success}, error: ${res.error?.slice(0, 40)}...`
      );
    }

    // Verify orders table was not dropped or corrupted
    const orderCountAfterSQLi = await prisma.order.count();
    record(
      'SUITE 6',
      '6.2 Orders database table intact after SQLi attack barrage',
      orderCountAfterSQLi > 0,
      'Orders table count > 0',
      `Count: ${orderCountAfterSQLi}`
    );

    // =========================================================================
    // SUITE 7: Public Tracking PII & Address Sanitization Audit
    // =========================================================================
    console.log('\n📌 SUITE 7: Public Tracking PII & Address Sanitization Audit');

    const trackingRes = await trackOrder(confidentialOrder.orderNumber);
    const sanitizedOrder = trackingRes.order!;
    const serializedJson = JSON.stringify(sanitizedOrder);

    // 7.1 Address Line 1 MUST NOT be present or leaked
    record(
      'SUITE 7',
      '7.1 Customer address line 1 is NOT leaked in response object or JSON',
      (sanitizedOrder as any).shippingAddressLine1 === undefined &&
        (sanitizedOrder as any).addressLine1 === undefined &&
        !serializedJson.includes('Penthouse 1402') &&
        !serializedJson.includes('Highly Secret Tower B'),
      'Zero occurrences of Penthouse 1402 / Highly Secret Tower B',
      `Leaked in JSON: ${serializedJson.includes('Penthouse 1402')}`
    );

    // 7.2 Address Line 2 MUST NOT be present
    record(
      'SUITE 7',
      '7.2 Customer address line 2 is NOT leaked',
      (sanitizedOrder as any).shippingAddressLine2 === undefined &&
        !serializedJson.includes('Off Private Restricted Road'),
      'Zero occurrences of Address Line 2',
      `Leaked in JSON: ${serializedJson.includes('Off Private Restricted Road')}`
    );

    // 7.3 Customer Full Name MUST NOT be present
    record(
      'SUITE 7',
      '7.3 Customer full name is NOT leaked publicly',
      (sanitizedOrder as any).customerName === undefined &&
        !serializedJson.includes('Secret Customer Aditi Sharma'),
      'Zero occurrences of Customer Name',
      `Leaked in JSON: ${serializedJson.includes('Secret Customer Aditi Sharma')}`
    );

    // 7.4 Customer Email MUST NOT be present
    record(
      'SUITE 7',
      '7.4 Customer email is NOT leaked publicly',
      (sanitizedOrder as any).customerEmail === undefined &&
        !serializedJson.includes('confidential.aditi'),
      'Zero occurrences of Customer Email',
      `Leaked in JSON: ${serializedJson.includes('confidential.aditi')}`
    );

    // 7.5 Customer Phone MUST NOT be present
    record(
      'SUITE 7',
      '7.5 Customer phone is NOT leaked publicly',
      (sanitizedOrder as any).customerPhone === undefined &&
        !serializedJson.includes('9988776655'),
      'Zero occurrences of Customer Phone',
      `Leaked in JSON: ${serializedJson.includes('9988776655')}`
    );

    // 7.6 Pincode / Postal Code MUST NOT be present
    record(
      'SUITE 7',
      '7.6 Customer exact pincode is NOT leaked publicly',
      (sanitizedOrder as any).pincode === undefined &&
        !serializedJson.includes('560099'),
      'Zero occurrences of Pincode',
      `Leaked in JSON: ${serializedJson.includes('560099')}`
    );

    // 7.7 Private delivery instructions MUST NOT be present
    record(
      'SUITE 7',
      '7.7 Private delivery instructions are NOT leaked',
      (sanitizedOrder as any).deliveryInstructions === undefined &&
        !serializedJson.includes('bodyguard'),
      'Zero occurrences of Delivery Instructions',
      `Leaked in JSON: ${serializedJson.includes('bodyguard')}`
    );

    // 7.8 Payment gateway tokens MUST NOT be present
    record(
      'SUITE 7',
      '7.8 Razorpay payment tokens and signatures are NOT leaked',
      (sanitizedOrder as any).razorpayPaymentId === undefined &&
        (sanitizedOrder as any).razorpaySignature === undefined &&
        !serializedJson.includes('pay_sec_67890') &&
        !serializedJson.includes('sig_sec_abcdef'),
      'Zero occurrences of Payment Secret Tokens',
      `Leaked in JSON: ${serializedJson.includes('pay_sec_67890')}`
    );

    // 7.9 Allowed public summary fields are present
    record(
      'SUITE 7',
      '7.9 Permitted public summary fields (City, State, Courier, Items) are present',
      sanitizedOrder.shippingCity === 'Bengaluru' &&
        sanitizedOrder.shippingState === 'Karnataka' &&
        sanitizedOrder.trackingCourier === 'Blue Dart Express' &&
        sanitizedOrder.trackingNumber === 'BD123456789IN' &&
        sanitizedOrder.items.length === 1 &&
        sanitizedOrder.totalAmount === 249900,
      'City: Bengaluru, State: Karnataka, Total: 249900',
      `City: ${sanitizedOrder.shippingCity}, State: ${sanitizedOrder.shippingState}, Total: ${sanitizedOrder.totalAmount}`
    );

    // =========================================================================
    // SUITE 8: Stepper State Transitions & Delivery Window Logic
    // =========================================================================
    console.log('\n📌 SUITE 8: Stepper State Transitions & Delivery Window Logic');

    const statusTestCases: {
      status: OrderStatus;
      expectedStep: number;
      expectedCancelled: boolean;
      expectedDeliveryPattern: RegExp | string;
    }[] = [
      { status: OrderStatus.PENDING, expectedStep: 1, expectedCancelled: false, expectedDeliveryPattern: /\d+ \w+ – \d+ \w+ \d{4}/ },
      { status: OrderStatus.PENDING_COD, expectedStep: 1, expectedCancelled: false, expectedDeliveryPattern: /\d+ \w+ – \d+ \w+ \d{4}/ },
      { status: OrderStatus.CONFIRMED, expectedStep: 1, expectedCancelled: false, expectedDeliveryPattern: /\d+ \w+ – \d+ \w+ \d{4}/ },
      { status: OrderStatus.PROCESSING, expectedStep: 2, expectedCancelled: false, expectedDeliveryPattern: /\d+ \w+ – \d+ \w+ \d{4}/ },
      { status: OrderStatus.SHIPPED, expectedStep: 3, expectedCancelled: false, expectedDeliveryPattern: /\d+ \w+ – \d+ \w+ \d{4}/ },
      { status: OrderStatus.DELIVERED, expectedStep: 4, expectedCancelled: false, expectedDeliveryPattern: 'Delivered' },
      { status: OrderStatus.CANCELLED, expectedStep: 0, expectedCancelled: true, expectedDeliveryPattern: 'Cancelled' },
    ];

    for (let i = 0; i < statusTestCases.length; i++) {
      const tc = statusTestCases[i];
      const testOrderNum = `DAH-2026-STEPPER${i + 1}`;
      const order = await prisma.order.create({
        data: {
          orderNumber: testOrderNum,
          customerName: 'Stepper Test Customer',
          customerEmail: 'stepper@test.com',
          customerPhone: '9876543210',
          shippingAddressLine1: 'Test Address Line 1',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          subtotal: 100000,
          totalAmount: 100000,
          orderStatus: tc.status,
          items: {
            create: [
              {
                productName: 'Mini Flower Pot',
                productSlug: 'mini-flower-pot',
                unitPrice: 100000,
                quantity: 1,
                lineSubtotal: 100000,
              },
            ],
          },
        },
      });
      createdOrderIds.push(order.id);

      const res = await trackOrder(testOrderNum);
      const isDeliveryValid =
        typeof tc.expectedDeliveryPattern === 'string'
          ? res.order?.estimatedDelivery === tc.expectedDeliveryPattern
          : tc.expectedDeliveryPattern.test(res.order?.estimatedDelivery || '');

      record(
        'SUITE 8',
        `8.${i + 1} Status "${tc.status}" maps to step ${tc.expectedStep} (cancelled=${tc.expectedCancelled})`,
        res.success === true &&
          res.order?.currentStep === tc.expectedStep &&
          res.order?.isCancelled === tc.expectedCancelled &&
          isDeliveryValid,
        `step: ${tc.expectedStep}, cancelled: ${tc.expectedCancelled}, delivery: ${tc.expectedDeliveryPattern}`,
        `step: ${res.order?.currentStep}, cancelled: ${res.order?.isCancelled}, delivery: ${res.order?.estimatedDelivery}`
      );
    }

    // =========================================================================
    // SUITE 9: Concurrency Stress Testing
    // =========================================================================
    console.log('\n📌 SUITE 9: Concurrency Stress Testing');

    // 9.1 Concurrent contact submissions
    const CONCURRENT_CONTACTS = 15;
    const contactPromises = Array.from({ length: CONCURRENT_CONTACTS }).map((_, idx) =>
      submitContactInquiry({
        name: `Concurrent User ${idx + 1}`,
        email: `concurrent.user${idx + 1}@example.com`,
        subject: `Concurrent Test Inquiry ${idx + 1}`,
        message: `This is automated concurrent inquiry message number ${idx + 1} with over 10 chars.`,
      })
    );

    const contactResults = await Promise.all(contactPromises);
    const allContactsSucceeded = contactResults.every((r) => r.success && !!r.inquiryId);
    contactResults.forEach((r) => {
      if (r.inquiryId) createdInquiryIds.push(r.inquiryId);
    });

    record(
      'SUITE 9',
      `9.1 ${CONCURRENT_CONTACTS} simultaneous contact form submissions succeeded`,
      allContactsSucceeded,
      `${CONCURRENT_CONTACTS}/${CONCURRENT_CONTACTS} success: true`,
      `${contactResults.filter((r) => r.success).length}/${CONCURRENT_CONTACTS} succeeded`
    );

    // 9.2 Concurrent order tracking lookups
    const CONCURRENT_LOOKUPS = 20;
    const lookupPromises = Array.from({ length: CONCURRENT_LOOKUPS }).map((_, idx) => {
      // Alternate between existing and non-existing
      const target = idx % 2 === 0 ? confidentialOrder.orderNumber : `DAH-NON-EXISTENT-${idx}`;
      return trackOrder(target);
    });

    const lookupResults = await Promise.all(lookupPromises);
    const lookupsNoCrash = lookupResults.every((r) => typeof r.success === 'boolean');
    const existingLookupsPassed = lookupResults
      .filter((_, idx) => idx % 2 === 0)
      .every((r) => r.success === true);
    const nonExistingLookupsFailedGracefully = lookupResults
      .filter((_, idx) => idx % 2 !== 0)
      .every((r) => r.success === false && typeof r.error === 'string');

    record(
      'SUITE 9',
      `9.2 ${CONCURRENT_LOOKUPS} simultaneous order tracking lookups handled cleanly`,
      lookupsNoCrash && existingLookupsPassed && nonExistingLookupsFailedGracefully,
      'All concurrent lookups returned cleanly with zero connection starvation',
      `passed: ${lookupsNoCrash && existingLookupsPassed && nonExistingLookupsFailedGracefully}`
    );
  } finally {
    // =========================================================================
    // CLEANUP FIXTURES
    // =========================================================================
    console.log('\n--- Cleaning up Test Fixtures from MySQL ---');

    if (createdInquiryIds.length > 0) {
      const deletedInquiries = await prisma.contactInquiry.deleteMany({
        where: { id: { in: createdInquiryIds } },
      });
      console.log(`🧹 Cleaned up ${deletedInquiries.count} test contact inquiries.`);
    }

    if (createdOrderIds.length > 0) {
      // Delete child order items first or cascade
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: createdOrderIds } },
      });
      const deletedOrders = await prisma.order.deleteMany({
        where: { id: { in: createdOrderIds } },
      });
      console.log(`🧹 Cleaned up ${deletedOrders.count} test orders and order items.`);
    }

    await prisma.$disconnect();
  }

  // =========================================================================
  // SUMMARY REPORT
  // =========================================================================
  console.log('\n========================================================================');
  console.log('📊 Milestone 8 Adversarial Test Results Summary');
  console.log('========================================================================');

  const passedCount = assertions.filter((a) => a.passed).length;
  const failedCount = assertions.filter((a) => !a.passed).length;
  const totalCount = assertions.length;

  console.log(`Total Assertions: ${totalCount}`);
  console.log(`Passed:           ${passedCount}`);
  console.log(`Failed:           ${failedCount}`);

  if (failedCount > 0) {
    console.error('\n❌ FAILED ASSERTIONS:');
    assertions
      .filter((a) => !a.passed)
      .forEach((a) => {
        console.error(`- [${a.suite}] ${a.name}`);
        console.error(`  Expected: ${a.expected}`);
        console.error(`  Actual:   ${a.actual}`);
      });
    process.exit(1);
  } else {
    console.log(`\n🎉 All ${totalCount}/${totalCount} Adversarial & Stress Assertions PASSED!`);
    process.exit(0);
  }
}

runAdversarialSuite().catch((err) => {
  console.error('Fatal crash during adversarial test execution:', err);
  process.exit(1);
});
