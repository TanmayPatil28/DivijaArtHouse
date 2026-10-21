import { PrismaClient, OrderStatus } from '@prisma/client';
import { submitContactInquiry } from '../src/actions/contact';
import { trackOrder } from '../src/actions/tracking';
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification, sendNewsletterWelcomeEmail } from '../src/lib/email';
import { formatINR } from '../src/lib/utils';

const prisma = new PrismaClient();

async function runAdversarialStressTest() {
  console.log('🛡️ Starting Adversarial Forensic Stress-Testing for DivijaArtHouse...\n');
  let failures = 0;

  function check(desc: string, passed: boolean, extra?: string) {
    if (passed) {
      console.log(`  [PASS] ${desc}`);
    } else {
      console.error(`  [FAIL] ${desc} ${extra || ''}`);
      failures++;
    }
  }

  // 1. Boundary & Adversarial Checks on Contact Inquiry
  console.log('1. Contact Inquiry Boundary & Adversarial Testing:');
  const emptyRes = await submitContactInquiry({ name: '', email: 'test@example.com', message: 'Hello this is ten chars' });
  check('Empty name is rejected', emptyRes.success === false);

  const nineCharRes = await submitContactInquiry({ name: 'Test', email: 'test@example.com', message: '123456789' });
  check('9-character message (<10) is rejected', nineCharRes.success === false);

  const tenCharRes = await submitContactInquiry({ name: 'Test User', email: 'test@example.com', message: '1234567890' });
  check('10-character message (minimum boundary) is accepted', tenCharRes.success === true);
  if (tenCharRes.inquiryId) {
    await prisma.contactInquiry.delete({ where: { id: tenCharRes.inquiryId } });
  }

  const badPhoneRes = await submitContactInquiry({ name: 'Test User', email: 'test@example.com', phone: '12345', message: 'Valid message for testing.' });
  check('Invalid 5-digit phone is rejected', badPhoneRes.success === false);

  const formattedPhoneRes = await submitContactInquiry({ name: 'Test User', email: 'test@example.com', phone: '+91 98765 43210', message: 'Valid message for testing.' });
  check('Formatted Indian mobile (+91 98765 43210) is accepted', formattedPhoneRes.success === true);
  if (formattedPhoneRes.inquiryId) {
    await prisma.contactInquiry.delete({ where: { id: formattedPhoneRes.inquiryId } });
  }

  const longMsg = 'A'.repeat(3001);
  const longMsgRes = await submitContactInquiry({ name: 'Test User', email: 'test@example.com', message: longMsg });
  check('Oversized message (>3000 chars) is rejected', longMsgRes.success === false);

  // 2. Adversarial Checks on Order Tracking
  console.log('\n2. Order Tracking Adversarial Testing:');
  const emptyTrack = await trackOrder('');
  check('Empty tracking query is rejected', emptyTrack.success === false);

  const sqlInjectionTrack = await trackOrder("' OR '1'='1");
  check("SQL injection query (' OR '1'='1) safely rejected without exception", sqlInjectionTrack.success === false);

  const specialCharsTrack = await trackOrder('<script>alert("xss")</script>');
  check('XSS payload string safely rejected without exception', specialCharsTrack.success === false);

  // 3. Database Integer Paise Arithmetic Audit
  console.log('\n3. Database Integer Paise Arithmetic Verification:');
  const allProducts = await prisma.product.findMany();
  check('Catalog has >= 15 products', allProducts.length >= 15, `Found: ${allProducts.length}`);

  let paiseIntegrityProducts = true;
  for (const p of allProducts) {
    if (typeof p.price !== 'number' || p.price % 1 !== 0 || p.price <= 0) {
      paiseIntegrityProducts = false;
      console.error(`Invalid product price: ${p.name} -> ${p.price}`);
    }
    if (p.compareAtPrice !== null && (p.compareAtPrice % 1 !== 0 || p.compareAtPrice < p.price)) {
      paiseIntegrityProducts = false;
      console.error(`Invalid compareAtPrice: ${p.name} -> ${p.compareAtPrice}`);
    }
  }
  check('All products strictly have positive integer paise prices & valid compareAtPrice', paiseIntegrityProducts);

  const allOrders = await prisma.order.findMany({ include: { items: true } });
  let paiseIntegrityOrders = true;
  for (const o of allOrders) {
    if (o.subtotal % 1 !== 0 || o.shippingFee % 1 !== 0 || o.totalAmount % 1 !== 0) {
      paiseIntegrityOrders = false;
      console.error(`Float paise detected in order ${o.orderNumber}`);
    }
    if (o.subtotal + o.shippingFee !== o.totalAmount) {
      paiseIntegrityOrders = false;
      console.error(`Order total mismatch in ${o.orderNumber}: ${o.subtotal} + ${o.shippingFee} !== ${o.totalAmount}`);
    }
    for (const item of o.items) {
      if (item.unitPrice % 1 !== 0 || item.lineSubtotal % 1 !== 0) {
        paiseIntegrityOrders = false;
        console.error(`Float paise in order item ${item.productName}`);
      }
      if (item.unitPrice * item.quantity !== item.lineSubtotal) {
        paiseIntegrityOrders = false;
        console.error(`Line subtotal calculation mismatch in item ${item.productName}: ${item.unitPrice} * ${item.quantity} !== ${item.lineSubtotal}`);
      }
    }
  }
  check(`All ${allOrders.length} orders and line items satisfy integer paise arithmetic identity`, paiseIntegrityOrders);

  // 4. Verification of formatINR helper
  console.log('\n4. formatINR Display Currency Helper Verification:');
  check('formatINR(149900) produces ₹1,499', formatINR(149900) === '₹1,499');
  check('formatINR(9900) produces ₹99', formatINR(9900) === '₹99');
  check('formatINR(0) produces ₹0', formatINR(0) === '₹0');
  check('formatINR(349900) produces ₹3,499', formatINR(349900) === '₹3,499');

  await prisma.$disconnect();

  console.log(`\nAdversarial Stress Test Complete. Failures: ${failures}`);
  if (failures > 0) process.exit(1);
}

runAdversarialStressTest().catch((err) => {
  console.error('Fatal stress test failure:', err);
  process.exit(1);
});
