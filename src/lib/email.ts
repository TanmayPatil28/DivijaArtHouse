import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { formatINR, formatDate } from '@/lib/utils';

export interface EmailResult {
  success: boolean;
  simulated?: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Resolves SMTP configuration from environment variables with sensible defaults
 */
function getEmailConfig() {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587', 10);
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || '';
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || '';
  const from =
    process.env.EMAIL_FROM ||
    process.env.SMTP_FROM ||
    'DivijaArtHouse <orders@divijaarthouse.com>';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@divijaarthouse.com';

  const isConfigured = Boolean(
    user &&
    pass &&
    !user.includes('placeholder') &&
    !pass.includes('placeholder') &&
    user.trim() !== '' &&
    pass.trim() !== ''
  );

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from,
    adminEmail,
    isConfigured,
  };
}

/**
 * Creates or retrieves the Nodemailer transporter
 */
function createTransporter() {
  const config = getEmailConfig();
  if (!config.isConfigured) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

/**
 * Base URL helper for links inside transactional emails
 */
function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

/**
 * Internal sender that dispatches via Nodemailer or simulates in dev console
 */
async function sendMailSafely(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<EmailResult> {
  const config = getEmailConfig();
  const transporter = createTransporter();

  if (!transporter || !config.isConfigured) {
    // Safe Development Console Simulation Fallback
    console.log('\n============================================================');
    console.log('[Nodemailer Simulated Email - SMTP Not Configured]');
    console.log(`To:      ${options.to}`);
    console.log(`From:    ${config.from}`);
    console.log(`Subject: ${options.subject}`);
    console.log('------------------------------------------------------------');
    console.log(options.text || '[HTML Body Generated]');
    console.log('============================================================\n');

    return {
      success: true,
      simulated: true,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return {
      success: true,
      simulated: false,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Nodemailer transmission error:', error);
    return {
      success: false,
      simulated: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * 1. Customer Order Confirmation Email
 */
export async function sendOrderConfirmationEmail(orderId: string): Promise<EmailResult> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.warn(`[sendOrderConfirmationEmail] Order ${orderId} not found`);
      return { success: false, error: 'Order record not found' };
    }

    const baseUrl = getBaseUrl();
    const trackingUrl = `${baseUrl}/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`;
    const formattedDate = formatDate(order.createdAt);
    const subtotalFormatted = formatINR(order.subtotal);
    const shippingFormatted = order.shippingFee === 0 ? 'FREE' : formatINR(order.shippingFee);
    const totalFormatted = formatINR(order.totalAmount);
    const paymentLabel = order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Razorpay)';

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #ECE7E1;">
            <p style="margin: 0; font-weight: 600; color: #1A1A1A; font-size: 14px;">${item.productName}</p>
            ${item.variantName ? `<p style="margin: 2px 0 0 0; color: #666666; font-size: 12px;">Variant: ${item.variantName}</p>` : ''}
            ${item.personalizationText ? `<p style="margin: 2px 0 0 0; color: #A32D3B; font-size: 12px; font-style: italic;">Note: &ldquo;${item.personalizationText}&rdquo;</p>` : ''}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #ECE7E1; text-align: center; color: #666666; font-size: 13px;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #ECE7E1; text-align: right; font-weight: 600; color: #1A1A1A; font-size: 14px;">
            ${formatINR(item.lineSubtotal)}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your DivijaArtHouse Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFDF9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFDF9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #ECE7E1; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #A32D3B; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-family: Georgia, serif; font-size: 26px; font-weight: normal; letter-spacing: 0.5px;">DivijaArtHouse</h1>
              <p style="margin: 6px 0 0 0; color: #FCEEEF; font-size: 13px; font-style: italic; letter-spacing: 0.3px;">Little Blooms, Lasting Feelings.</p>
            </td>
          </tr>

          <!-- Confirmation Hero -->
          <tr>
            <td style="padding: 32px 30px 20px 30px; text-align: center;">
              <span style="display: inline-block; background-color: #FCEEEF; color: #A32D3B; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; letter-spacing: 1px;">Order Confirmed</span>
              <h2 style="margin: 14px 0 8px 0; color: #1A1A1A; font-size: 20px; font-family: Georgia, serif;">Thank you for your order, ${order.customerName}!</h2>
              <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">Our artisans have received your order and are preparing your everlasting handcrafted flowers with care.</p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFDF9; border-radius: 12px; border: 1px solid #ECE7E1; padding: 16px 20px;">
                <tr>
                  <td width="50%" style="font-size: 13px; color: #666666; padding-bottom: 6px;">Order Number:</td>
                  <td width="50%" align="right" style="font-size: 13px; font-weight: bold; color: #A32D3B; font-family: monospace; padding-bottom: 6px;">${order.orderNumber}</td>
                </tr>
                <tr>
                  <td width="50%" style="font-size: 13px; color: #666666; padding-bottom: 6px;">Order Date:</td>
                  <td width="50%" align="right" style="font-size: 13px; color: #1A1A1A; padding-bottom: 6px;">${formattedDate}</td>
                </tr>
                <tr>
                  <td width="50%" style="font-size: 13px; color: #666666;">Payment Method:</td>
                  <td width="50%" align="right" style="font-size: 13px; color: #1A1A1A;">${paymentLabel}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <thead>
                  <tr style="border-bottom: 2px solid #A32D3B;">
                    <th align="left" style="padding-bottom: 8px; font-size: 11px; text-transform: uppercase; color: #666666; letter-spacing: 0.5px;">Item</th>
                    <th align="center" style="padding-bottom: 8px; font-size: 11px; text-transform: uppercase; color: #666666; letter-spacing: 0.5px;">Qty</th>
                    <th align="right" style="padding-bottom: 8px; font-size: 11px; text-transform: uppercase; color: #666666; letter-spacing: 0.5px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 14px;">
                <tr>
                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #666666;">Subtotal:</td>
                  <td align="right" width="100" style="padding: 4px 0; font-size: 13px; color: #1A1A1A; font-weight: 500;">${subtotalFormatted}</td>
                </tr>
                <tr>
                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #666666;">Shipping:</td>
                  <td align="right" width="100" style="padding: 4px 0; font-size: 13px; color: #1A1A1A; font-weight: 500;">${shippingFormatted}</td>
                </tr>
                <tr>
                  <td align="right" style="padding: 8px 0 0 0; font-size: 15px; font-weight: bold; color: #1A1A1A; border-top: 1px solid #ECE7E1;">Total Paid:</td>
                  <td align="right" width="100" style="padding: 8px 0 0 0; font-size: 16px; font-weight: bold; color: #A32D3B; border-top: 1px solid #ECE7E1;">${totalFormatted}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 30px 28px 30px;">
              <div style="background-color: #FFFDF9; border: 1px solid #ECE7E1; border-radius: 12px; padding: 16px 20px;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #666666; letter-spacing: 0.5px;">Delivery Address</p>
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1A1A1A;">${order.customerName}</p>
                <p style="margin: 2px 0 0 0; font-size: 13px; color: #666666; line-height: 1.4;">
                  ${order.shippingAddressLine1}${order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ''}<br>
                  ${order.city}, ${order.state} &ndash; ${order.pincode}<br>
                  Phone: ${order.customerPhone}
                </p>
              </div>
            </td>
          </tr>

          <!-- Track CTA Button -->
          <tr>
            <td align="center" style="padding: 0 30px 36px 30px;">
              <a href="${trackingUrl}" style="display: inline-block; background-color: #A32D3B; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; padding: 14px 32px; border-radius: 30px; box-shadow: 0 2px 6px rgba(163,45,59,0.25);">
                Track Your Order Status
              </a>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #888888;">
                Standard PAN-India delivery takes 4 to 7 business days.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #222222; padding: 24px 30px; text-align: center; color: #AAAAAA; font-size: 12px;">
              <p style="margin: 0 0 4px 0; color: #FFFFFF; font-weight: 600;">DivijaArtHouse Studio</p>
              <p style="margin: 0; line-height: 1.4;">Handcrafted everlasting crochet flower bouquets & bespoke floral gifts.<br>
              Have questions? Reply to this email or reach us at <a href="mailto:support@divijaarthouse.com" style="color: #F5D6D9; text-decoration: underline;">support@divijaarthouse.com</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const text = `
DivijaArtHouse - Order Confirmation
Order Number: ${order.orderNumber}
Customer: ${order.customerName}
Total: ${totalFormatted}
Payment: ${paymentLabel}
Track Order: ${trackingUrl}

Thank you for choosing handcrafted everlasting blooms!
    `.trim();

    return await sendMailSafely({
      to: order.customerEmail,
      subject: `Order Confirmed: ${order.orderNumber} — DivijaArtHouse`,
      html,
      text,
    });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 2. Admin New Order Notification Email
 */
export async function sendAdminNewOrderNotification(orderId: string): Promise<EmailResult> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.warn(`[sendAdminNewOrderNotification] Order ${orderId} not found`);
      return { success: false, error: 'Order record not found' };
    }

    const config = getEmailConfig();
    const baseUrl = getBaseUrl();
    const adminOrdersUrl = `${baseUrl}/admin/orders`;
    const totalFormatted = formatINR(order.totalAmount);
    const totalItems = order.items.reduce((acc, i) => acc + i.quantity, 0);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Admin Alert: New Order Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFDF9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 24px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #ECE7E1; overflow: hidden;">
          <tr>
            <td style="background-color: #1A1A1A; padding: 20px 24px; color: #FFFFFF;">
              <h2 style="margin: 0; font-size: 18px; font-weight: 600;">🌸 New Order Received: ${order.orderNumber}</h2>
              <p style="margin: 4px 0 0 0; color: #AAAAAA; font-size: 13px;">DivijaArtHouse Admin Dispatch Alert</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.6;">
                <tr>
                  <td width="35%" style="color: #666666;">Customer Name:</td>
                  <td style="font-weight: 600; color: #1A1A1A;">${order.customerName}</td>
                </tr>
                <tr>
                  <td style="color: #666666;">Email & Phone:</td>
                  <td style="color: #1A1A1A;">${order.customerEmail} &bull; ${order.customerPhone}</td>
                </tr>
                <tr>
                  <td style="color: #666666;">Destination:</td>
                  <td style="color: #1A1A1A;">${order.city}, ${order.state} (${order.pincode})</td>
                </tr>
                <tr>
                  <td style="color: #666666;">Payment Method:</td>
                  <td style="font-weight: 600; color: #1A1A1A;">${order.paymentMethod} (${order.paymentStatus})</td>
                </tr>
                <tr>
                  <td style="color: #666666;">Total Value:</td>
                  <td style="font-weight: bold; color: #A32D3B; font-size: 16px;">${totalFormatted}</td>
                </tr>
                <tr>
                  <td style="color: #666666;">Items Count:</td>
                  <td style="color: #1A1A1A;">${totalItems} item(s) across ${order.items.length} line item(s)</td>
                </tr>
              </table>

              <div style="margin-top: 24px; text-align: center;">
                <a href="${adminOrdersUrl}" style="display: inline-block; background-color: #A32D3B; color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 8px;">
                  View in Admin Dashboard &rarr;
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const text = `
[Admin Alert] New Order Received!
Order Number: ${order.orderNumber}
Customer: ${order.customerName} (${order.customerEmail}, ${order.customerPhone})
Total: ${totalFormatted} (${order.paymentMethod})
Items: ${totalItems}
View order: ${adminOrdersUrl}
    `.trim();

    return await sendMailSafely({
      to: config.adminEmail,
      subject: `[Admin Alert] New Order ${order.orderNumber} - ${totalFormatted}`,
      html,
      text,
    });
  } catch (error) {
    console.error('Failed to send admin order notification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 3. Newsletter Welcome Email with Discount Coupon
 */
export async function sendNewsletterWelcomeEmail(email: string): Promise<EmailResult> {
  const baseUrl = getBaseUrl();
  const shopUrl = `${baseUrl}/shop`;
  const discountCode = 'BLOOM10';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to the DivijaArtHouse Family!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFDF9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #ECE7E1; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #A32D3B; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-family: Georgia, serif; font-size: 26px; font-weight: normal; letter-spacing: 0.5px;">DivijaArtHouse</h1>
              <p style="margin: 6px 0 0 0; color: #FCEEEF; font-size: 13px; font-style: italic;">Little Blooms, Lasting Feelings.</p>
            </td>
          </tr>

          <!-- Main Note -->
          <tr>
            <td style="padding: 36px 32px 24px 32px; text-align: center;">
              <span style="display: inline-block; background-color: #FCEEEF; color: #A32D3B; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; letter-spacing: 1px;">Welcome to the Family</span>
              <h2 style="margin: 16px 0 12px 0; color: #1A1A1A; font-size: 22px; font-family: Georgia, serif;">We're Delighted You're Here!</h2>
              <p style="margin: 0 auto; max-width: 460px; color: #666666; font-size: 14px; line-height: 1.6;">
                Thank you for joining our community of handmade craft admirers. At DivijaArtHouse, we believe that life's most heartfelt sentiments shouldn't wilt in a few days.
              </p>
              <p style="margin: 12px auto 0 auto; max-width: 460px; color: #666666; font-size: 14px; line-height: 1.6;">
                Every petal you see in our shop is individually hand-knitted from 5-ply combed milk cotton yarn by skilled Indian women artisans, bringing you blooms that last a lifetime.
              </p>
            </td>
          </tr>

          <!-- Discount Coupon Card -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFDF9; border: 2px dashed #A32D3B; border-radius: 14px; padding: 20px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #A32D3B; letter-spacing: 1px;">Here is Your Special Welcome Gift</p>
                    <p style="margin: 8px 0; font-size: 26px; font-weight: bold; color: #1A1A1A; font-family: monospace; letter-spacing: 3px;">${discountCode}</p>
                    <p style="margin: 0; font-size: 13px; color: #666666;">Enjoy <strong>10% OFF</strong> your first handcrafted floral order.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 0 32px 36px 32px;">
              <a href="${shopUrl}" style="display: inline-block; background-color: #A32D3B; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; padding: 14px 34px; border-radius: 30px; box-shadow: 0 2px 8px rgba(163,45,59,0.25);">
                Explore All Handcrafted Blooms &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #222222; padding: 24px 30px; text-align: center; color: #AAAAAA; font-size: 12px;">
              <p style="margin: 0 0 4px 0; color: #FFFFFF; font-weight: 600;">DivijaArtHouse Studio</p>
              <p style="margin: 0; line-height: 1.4;">
                Handcrafted everlasting crochet flower bouquets, desk pots & gifts.<br>
                Bangalore, Karnataka, India &bull; <a href="mailto:support@divijaarthouse.com" style="color: #F5D6D9; text-decoration: underline;">support@divijaarthouse.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Welcome to DivijaArtHouse!
"Little Blooms, Lasting Feelings."

Thank you for subscribing to our newsletter.
Here is your welcome gift: 10% OFF with code ${discountCode}

Explore collections at: ${shopUrl}
  `.trim();

  return await sendMailSafely({
    to: email,
    subject: `Welcome to DivijaArtHouse! Your 10% Gift Inside 🌸`,
    html,
    text,
  });
}
