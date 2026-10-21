'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signOut } from '@/auth';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters').trim(),
    email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export interface RegisterResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

/**
 * Server action to register a new customer account
 */
export async function registerUser(
  input:
    | FormData
    | {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        phone?: string;
      }
): Promise<RegisterResult> {
  try {
    let rawData: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      phone?: string;
    };

    if (input instanceof FormData) {
      rawData = {
        name: String(input.get('name') || ''),
        email: String(input.get('email') || ''),
        password: String(input.get('password') || ''),
        confirmPassword: String(input.get('confirmPassword') || ''),
        phone: (input.get('phone') as string) || undefined,
      };
    } else {
      rawData = input;
    }

    const validation = registerSchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || 'Invalid registration data';
      return { success: false, error: firstError };
    }

    const { name, email, password, phone } = validation.data;

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      };
    }

    // Hash password with bcryptjs
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
        role: 'CUSTOMER',
      },
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error('Error during registerUser:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed. Please try again.',
    };
  }
}

/**
 * Server action to sign out
 */
export async function handleSignOut() {
  await signOut({ redirectTo: '/signin' });
}
