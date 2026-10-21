'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendNewsletterWelcomeEmail } from '@/lib/email';

const subscriberSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required.' })
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.')
    .max(255, 'Email address is too long.'),
  source: z.string().optional().default('homepage'),
});

export interface NewsletterActionResult {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
  };
}

/**
 * Server action to subscribe an email to the newsletter in the database.
 */
export async function subscribeNewsletter(
  prevState: NewsletterActionResult | null,
  formData: FormData
): Promise<NewsletterActionResult> {
  const rawEmail = formData.get('email');
  const rawSource = formData.get('source') || 'homepage';

  const validated = subscriberSchema.safeParse({
    email: rawEmail,
    source: rawSource,
  });

  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors;
    return {
      success: false,
      message: fieldErrors.email?.[0] || 'Invalid email address provided.',
      errors: fieldErrors,
    };
  }

  const email = validated.data.email.toLowerCase();
  const source = validated.data.source;

  try {
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.subscriber.update({
          where: { email },
          data: { isActive: true },
        });

        sendNewsletterWelcomeEmail(email).catch((err) =>
          console.error('Failed to dispatch welcome newsletter email:', err)
        );

        return {
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
        };
      }
      return {
        success: true,
        message: 'You are already subscribed! Look out for our upcoming blooms and offers.',
      };
    }

    await prisma.subscriber.create({
      data: {
        email,
        source,
        isActive: true,
      },
    });

    sendNewsletterWelcomeEmail(email).catch((err) =>
      console.error('Failed to dispatch welcome newsletter email:', err)
    );

    return {
      success: true,
      message: 'Thank you for subscribing! Welcome to the DivijaArtHouse family.',
    };
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error);
    return {
      success: false,
      message: 'Something went wrong while subscribing. Please try again later.',
    };
  }
}
