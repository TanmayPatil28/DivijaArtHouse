'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const contactInquirySchema = z.object({
  name: z
    .string({ required_error: 'Please enter your name.' })
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name cannot exceed 100 characters.'),
  email: z
    .string({ required_error: 'Please enter your email address.' })
    .trim()
    .email('Please enter a valid email address.')
    .max(255, 'Email cannot exceed 255 characters.'),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val.replace(/[\s\-\+]/g, '').slice(-10)),
      { message: 'Please enter a valid 10-digit mobile number.' }
    ),
  subject: z
    .string()
    .trim()
    .max(150, 'Subject cannot exceed 150 characters.')
    .optional()
    .or(z.literal('')),
  message: z
    .string({ required_error: 'Please write your message or query.' })
    .trim()
    .min(10, 'Message must be at least 10 characters long.')
    .max(3000, 'Message cannot exceed 3000 characters.'),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;

export interface ContactActionResult {
  success: boolean;
  message: string;
  inquiryId?: string;
  errors?: Record<string, string[]>;
}

/**
 * Server Action: Persists a customer message/inquiry to the Prisma ContactInquiry table.
 * Supports invocation via FormData directly, via useFormState (prevState, formData),
 * or directly with a plain JavaScript object.
 */
export async function submitContactInquiry(
  arg1: FormData | ContactInquiryInput | (ContactActionResult | null),
  arg2?: FormData
): Promise<ContactActionResult> {
  let rawData: Record<string, unknown> = {};

  if (arg2 instanceof FormData) {
    // Invoked via useFormState(submitContactInquiry, null)
    rawData = {
      name: arg2.get('name'),
      email: arg2.get('email'),
      phone: arg2.get('phone') || undefined,
      subject: arg2.get('subject') || undefined,
      message: arg2.get('message'),
    };
  } else if (arg1 instanceof FormData) {
    // Invoked directly with FormData: submitContactInquiry(formData)
    rawData = {
      name: arg1.get('name'),
      email: arg1.get('email'),
      phone: arg1.get('phone') || undefined,
      subject: arg1.get('subject') || undefined,
      message: arg1.get('message'),
    };
  } else if (arg1 && typeof arg1 === 'object') {
    // Invoked with a plain data object
    rawData = arg1 as Record<string, unknown>;
  }

  const validation = contactInquirySchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const firstErrorMessage =
      validation.error.issues[0]?.message || 'Please check the form for errors.';

    return {
      success: false,
      message: firstErrorMessage,
      errors: fieldErrors,
    };
  }

  const { name, email, phone, subject, message } = validation.data;

  try {
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone && phone.trim() !== '' ? phone.trim() : null,
        subject: subject && subject.trim() !== '' ? subject.trim() : null,
        message,
        status: 'NEW',
      },
    });

    return {
      success: true,
      message:
        'Thank you for reaching out! We have received your message and will respond within 24 hours.',
      inquiryId: inquiry.id,
    };
  } catch (error) {
    console.error('Error submitting contact inquiry to database:', error);
    return {
      success: false,
      message:
        'We encountered an issue saving your message. Please try again or email us directly at support@divijaarthouse.com.',
    };
  }
}
