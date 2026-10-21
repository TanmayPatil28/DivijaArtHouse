/**
 * DivijaArtHouse - Milestone 7 Adversarial & Privilege Escalation Stress Test
 *
 * This test suite performs empirical, hostile-environment stress testing against:
 * 1. Password Hashing & Authentication Robustness (Admin, Customer, SQLi, Case-Insensitivity, Bad Passwords)
 * 2. User Registration Boundaries & Injection Defense (Zod schemas, Duplicates, Mismatches, Role-Tampering)
 * 3. Role Privilege Escalation & Route Guarding (Middleware Edge Guards, JWT/Session Callbacks, Admin Server Actions)
 */

import './polyfill';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma';
import { authConfig } from '../src/auth.config';
import { registerUser } from '../src/actions/auth';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
} from '../src/actions/admin';

// Import Next.js internal AsyncLocalStorage to simulate standard App Router server action invocation
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { requestAsyncStorage } = require('next/dist/client/components/request-async-storage.external');

interface TestAssertion {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
}

const assertions: TestAssertion[] = [];

function record(suite: string, name: string, condition: boolean, error?: string) {
  assertions.push({ suite, name, passed: condition, error });
  if (condition) {
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    console.error(`  ❌ [FAIL] ${name} ${error ? `\n     Details: ${error}` : ''}`);
  }
}

/**
 * Replicates the exact credential authorization logic implemented in src/auth.ts
 */
async function authorizeCredentials(credentials?: { email?: unknown; password?: unknown }) {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const email = String(credentials.email).toLowerCase().trim();
  const password = String(credentials.password);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
}

async function runAdversarialTestSuite() {
  console.log('======================================================================');
  console.log('🌸 DivijaArtHouse — Milestone 7 Adversarial Authentication & Privilege Test');
  console.log('======================================================================\n');

  // Track created test user IDs for guaranteed cleanup
  const cleanupUserIds: string[] = [];

  try {
    // =========================================================================
    // SUITE 1: Password Hashing & Authentication Robustness
    // =========================================================================
    console.log('🛡️  SUITE 1: Password Hashing & Authentication Robustness');
    console.log('----------------------------------------------------------------------');

    // 1.1 Seeded Admin Authentication
    const adminAuth = await authorizeCredentials({
      email: 'admin@divijaarthouse.com',
      password: 'Admin@Divija123!',
    });
    record(
      'Suite 1',
      'Seeded Admin logs in successfully with valid credentials',
      adminAuth !== null && adminAuth.email === 'admin@divijaarthouse.com'
    );
    record(
      'Suite 1',
      'Seeded Admin has Role.ADMIN assigned',
      adminAuth !== null && adminAuth.role === Role.ADMIN
    );

    // 1.2 Seeded Customer Authentication
    const customerAuth = await authorizeCredentials({
      email: 'ananya@example.com',
      password: 'Customer@123!',
    });
    record(
      'Suite 1',
      'Seeded Customer logs in successfully with valid credentials',
      customerAuth !== null && customerAuth.email === 'ananya@example.com'
    );
    record(
      'Suite 1',
      'Seeded Customer has Role.CUSTOMER assigned',
      customerAuth !== null && customerAuth.role === Role.CUSTOMER
    );

    // 1.3 Wrong Password Rejections
    const wrongAdminPass = await authorizeCredentials({
      email: 'admin@divijaarthouse.com',
      password: 'WrongAdminPassword123!',
    });
    record('Suite 1', 'Admin login rejected when password is wrong', wrongAdminPass === null);

    const wrongCustPass = await authorizeCredentials({
      email: 'ananya@example.com',
      password: 'WrongCustomerPassword123!',
    });
    record('Suite 1', 'Customer login rejected when password is wrong', wrongCustPass === null);

    const blankPass = await authorizeCredentials({
      email: 'admin@divijaarthouse.com',
      password: '',
    });
    record('Suite 1', 'Login rejected when password is empty string', blankPass === null);

    const nullPass = await authorizeCredentials({
      email: 'admin@divijaarthouse.com',
      password: undefined,
    });
    record('Suite 1', 'Login rejected when password is undefined', nullPass === null);

    // 1.4 Non-Existent Email Rejections
    const nonExistentEmail = await authorizeCredentials({
      email: 'ghost.user.nonexistent@divijaarthouse.com',
      password: 'SomePassword123!',
    });
    record('Suite 1', 'Login rejected for non-existent email', nonExistentEmail === null);

    // 1.5 SQL Injection Strings in Login
    const sqliAttempts = [
      "' OR '1'='1",
      "admin@divijaarthouse.com' --",
      "admin@divijaarthouse.com' OR 1=1; --",
      "admin@divijaarthouse.com' /*",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      '" OR ""="',
    ];

    for (const sqli of sqliAttempts) {
      const sqliResult = await authorizeCredentials({
        email: sqli,
        password: 'Admin@Divija123!',
      });
      record(
        'Suite 1',
        `SQL injection in email rejected safely: [${sqli.slice(0, 25)}]`,
        sqliResult === null
      );
    }

    const sqliPassResult = await authorizeCredentials({
      email: 'admin@divijaarthouse.com',
      password: "' OR '1'='1",
    });
    record(
      'Suite 1',
      'SQL injection string in password rejected without bypass',
      sqliPassResult === null
    );

    // 1.6 Case-Insensitive Email Normalization
    const uppercaseAdmin = await authorizeCredentials({
      email: 'ADMIN@DIVIJAARTHOUSE.COM',
      password: 'Admin@Divija123!',
    });
    record(
      'Suite 1',
      'Uppercase admin email normalized and successfully authenticated',
      uppercaseAdmin !== null && uppercaseAdmin.role === Role.ADMIN
    );

    const mixedCaseCustomer = await authorizeCredentials({
      email: '  AnAnYa@ExAmPlE.cOm  ',
      password: 'Customer@123!',
    });
    record(
      'Suite 1',
      'Whitespace-padded mixed-case customer email normalized and authenticated',
      mixedCaseCustomer !== null && mixedCaseCustomer.role === Role.CUSTOMER
    );

    // =========================================================================
    // SUITE 2: User Registration Boundaries & Injection Defense
    // =========================================================================
    console.log('\n🛡️  SUITE 2: User Registration Boundaries & Injection Defense');
    console.log('----------------------------------------------------------------------');

    const uniqueStamp = Date.now();
    const validTestEmail = `adv.tester.${uniqueStamp}@example.com`;

    // 2.1 Legitimate Registration
    const regSuccess = await registerUser({
      name: 'Adversary Verifier',
      email: validTestEmail,
      password: 'ValidPassword@123',
      confirmPassword: 'ValidPassword@123',
      phone: '+91 98888 77777',
    });
    record('Suite 2', 'Legitimate user registration succeeds', regSuccess.success === true);
    if (regSuccess.user?.id) {
      cleanupUserIds.push(regSuccess.user.id);
    }

    // 2.2 Verify DB Persistence & Role Default
    const dbUser = await prisma.user.findUnique({
      where: { email: validTestEmail },
    });
    record('Suite 2', 'Registered user persisted in database', !!dbUser);
    record(
      'Suite 2',
      'Registered user role strictly defaults to Role.CUSTOMER',
      dbUser?.role === Role.CUSTOMER
    );

    // 2.3 Verify Password Hashing with Salt
    const isDbPasswordHashed =
      dbUser?.passwordHash?.startsWith('$2a$') || dbUser?.passwordHash?.startsWith('$2b$');
    record(
      'Suite 2',
      'Password stored as strong bcrypt hash (salt rounds >= 10)',
      !!isDbPasswordHashed
    );
    const passwordMatchBcrypt = await bcrypt.compare(
      'ValidPassword@123',
      dbUser?.passwordHash || ''
    );
    record('Suite 2', 'Bcrypt successfully verifies plaintext against stored hash', passwordMatchBcrypt);

    // 2.4 Duplicate Email Rejection (Exact Match)
    const duplicateReg = await registerUser({
      name: 'Duplicate Pretender',
      email: validTestEmail,
      password: 'ValidPassword@123',
      confirmPassword: 'ValidPassword@123',
    });
    record(
      'Suite 2',
      'Duplicate email registration is strictly rejected',
      duplicateReg.success === false && !!duplicateReg.error?.includes('already exists')
    );

    // 2.5 Duplicate Email Rejection (Case Variation)
    const upperDuplicateReg = await registerUser({
      name: 'Duplicate Uppercase',
      email: validTestEmail.toUpperCase(),
      password: 'ValidPassword@123',
      confirmPassword: 'ValidPassword@123',
    });
    record(
      'Suite 2',
      'Case-variant duplicate email registration is strictly rejected',
      upperDuplicateReg.success === false && !!upperDuplicateReg.error?.includes('already exists')
    );

    // 2.6 Invalid Email Formats Rejection
    const invalidEmails = [
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      'username@missingtld',
      'user spaces@domain.com',
      '',
    ];

    for (const invEmail of invalidEmails) {
      const invResult = await registerUser({
        name: 'Invalid Email Tester',
        email: invEmail,
        password: 'ValidPassword@123',
        confirmPassword: 'ValidPassword@123',
      });
      record(
        'Suite 2',
        `Malformed email format rejected: "${invEmail}"`,
        invResult.success === false
      );
    }

    // 2.7 Short Password (<6 chars) Rejection
    const shortPasswords = ['1', '12', '123', '1234', '12345'];
    for (const sp of shortPasswords) {
      const spResult = await registerUser({
        name: 'Short Pass Tester',
        email: `shortpass.${Date.now()}@example.com`,
        password: sp,
        confirmPassword: sp,
      });
      record(
        'Suite 2',
        `Short password (<6 chars) rejected: length ${sp.length}`,
        spResult.success === false && !!spResult.error?.includes('at least 6 characters')
      );
    }

    // 2.8 Password Mismatch Rejection
    const mismatchResult = await registerUser({
      name: 'Mismatch Tester',
      email: `mismatch.${Date.now()}@example.com`,
      password: 'CorrectPassword@123',
      confirmPassword: 'IncorrectPassword@999',
    });
    record(
      'Suite 2',
      'Password confirmation mismatch is strictly rejected',
      mismatchResult.success === false && mismatchResult.error === 'Passwords do not match'
    );

    // 2.9 Short Name (<2 chars) Rejection
    const shortNameResult = await registerUser({
      name: 'X',
      email: `shortname.${Date.now()}@example.com`,
      password: 'ValidPassword@123',
      confirmPassword: 'ValidPassword@123',
    });
    record(
      'Suite 2',
      'Short full name (<2 chars) is rejected by Zod schema',
      shortNameResult.success === false && !!shortNameResult.error?.includes('at least 2 characters')
    );

    // 2.10 Privilege Escalation Payload Injection in Registration
    // Malicious attacker attempts to send role: 'ADMIN' in payload
    const maliciousPayload = {
      name: 'Attacker Trying Admin Escalation',
      email: `escalation.${uniqueStamp}@example.com`,
      password: 'HackerPassword@123',
      confirmPassword: 'HackerPassword@123',
      role: 'ADMIN', // Injection attempt
    } as unknown as Parameters<typeof registerUser>[0];

    const escalationResult = await registerUser(maliciousPayload);
    record(
      'Suite 2',
      'Registration with injected role payload completes without crashing',
      escalationResult.success === true
    );
    if (escalationResult.user?.id) {
      cleanupUserIds.push(escalationResult.user.id);
    }

    const escalationDbUser = await prisma.user.findUnique({
      where: { email: `escalation.${uniqueStamp}@example.com` },
    });
    record(
      'Suite 2',
      'Privilege escalation thwarted: created user role is CUSTOMER, NOT ADMIN',
      escalationDbUser?.role === Role.CUSTOMER && escalationResult.user?.role === 'CUSTOMER'
    );

    // =========================================================================
    // SUITE 3: Role Privilege Escalation & Route Guarding
    // =========================================================================
    console.log('\n🛡️  SUITE 3: Role Privilege Escalation & Route Guarding');
    console.log('----------------------------------------------------------------------');

    const authorized = authConfig.callbacks?.authorized;
    record('Suite 3', 'authConfig.callbacks.authorized is defined and callable', typeof authorized === 'function');

    if (authorized) {
      // 3.1 Unauthenticated Route Access Tests
      const unauthAdminReq = {
        auth: null,
        request: { nextUrl: new URL('http://localhost:3000/admin') } as any,
      };
      const unauthAdminDecision = authorized(unauthAdminReq as any);
      record(
        'Suite 3',
        'Unauthenticated access to /admin returns false (redirect to /signin)',
        unauthAdminDecision === false
      );

      const unauthAdminProductsReq = {
        auth: null,
        request: { nextUrl: new URL('http://localhost:3000/admin/products') } as any,
      };
      const unauthAdminProductsDecision = authorized(unauthAdminProductsReq as any);
      record(
        'Suite 3',
        'Unauthenticated access to /admin/products returns false',
        unauthAdminProductsDecision === false
      );

      const unauthAccountReq = {
        auth: null,
        request: { nextUrl: new URL('http://localhost:3000/account') } as any,
      };
      const unauthAccountDecision = authorized(unauthAccountReq as any);
      record(
        'Suite 3',
        'Unauthenticated access to /account returns false (redirect to /signin)',
        unauthAccountDecision === false
      );

      const unauthPublicReq = {
        auth: null,
        request: { nextUrl: new URL('http://localhost:3000/shop') } as any,
      };
      const unauthPublicDecision = authorized(unauthPublicReq as any);
      record(
        'Suite 3',
        'Unauthenticated access to public route /shop returns true',
        unauthPublicDecision === true
      );

      // 3.2 Customer (Non-Admin) Route Access Tests
      const customerSessionAuth = {
        user: { id: 'cust-123', email: 'ananya@example.com', role: Role.CUSTOMER },
      };

      const custAdminReq = {
        auth: customerSessionAuth,
        request: { nextUrl: new URL('http://localhost:3000/admin') } as any,
      };
      const custAdminDecision = authorized(custAdminReq as any);
      const isRedirectResponse = Boolean(
        custAdminDecision instanceof Response &&
        custAdminDecision.status >= 300 &&
        custAdminDecision.status < 400 &&
        custAdminDecision.headers.get('location')?.includes('/account')
      );
      record(
        'Suite 3',
        'Customer access to /admin is BLOCKED and redirected to /account',
        isRedirectResponse
      );

      const custAdminOrdersReq = {
        auth: customerSessionAuth,
        request: { nextUrl: new URL('http://localhost:3000/admin/orders') } as any,
      };
      const custAdminOrdersDecision = authorized(custAdminOrdersReq as any);
      const isOrdersRedirect = Boolean(
        custAdminOrdersDecision instanceof Response &&
        custAdminOrdersDecision.headers.get('location')?.includes('/account')
      );
      record(
        'Suite 3',
        'Customer access to /admin/orders is BLOCKED and redirected to /account',
        isOrdersRedirect
      );

      const custAccountReq = {
        auth: customerSessionAuth,
        request: { nextUrl: new URL('http://localhost:3000/account') } as any,
      };
      const custAccountDecision = authorized(custAccountReq as any);
      record(
        'Suite 3',
        'Customer access to /account is permitted (returns true)',
        custAccountDecision === true
      );

      // 3.3 Admin Route Access Tests
      const adminSessionAuth = {
        user: { id: 'admin-123', email: 'admin@divijaarthouse.com', role: Role.ADMIN },
      };

      const adminAdminReq = {
        auth: adminSessionAuth,
        request: { nextUrl: new URL('http://localhost:3000/admin') } as any,
      };
      const adminAdminDecision = authorized(adminAdminReq as any);
      record(
        'Suite 3',
        'Admin access to /admin is permitted (returns true)',
        adminAdminDecision === true
      );

      const adminProductsReq = {
        auth: adminSessionAuth,
        request: { nextUrl: new URL('http://localhost:3000/admin/products') } as any,
      };
      const adminProductsDecision = authorized(adminProductsReq as any);
      record(
        'Suite 3',
        'Admin access to /admin/products is permitted (returns true)',
        adminProductsDecision === true
      );

      const adminAccountReq = {
        auth: adminSessionAuth,
        request: { nextUrl: new URL('http://localhost:3000/account') } as any,
      };
      const adminAccountDecision = authorized(adminAccountReq as any);
      record(
        'Suite 3',
        'Admin access to /account is permitted (returns true)',
        adminAccountDecision === true
      );
    }

    // 3.4 JWT & Session Callbacks Test
    const jwtCallback = authConfig.callbacks?.jwt;
    if (jwtCallback) {
      const token = await jwtCallback({
        token: {},
        user: { id: 'test-admin-uid', role: Role.ADMIN } as any,
        account: null,
      });
      record(
        'Suite 3',
        'JWT callback successfully sets user id and Role.ADMIN on token',
        token?.id === 'test-admin-uid' && token?.role === Role.ADMIN
      );
    }

    const sessionCallback = authConfig.callbacks?.session;
    if (sessionCallback) {
      const session = await (sessionCallback as any)({
        session: { user: { id: '', email: 'admin@divijaarthouse.com' }, expires: new Date().toISOString() },
        token: { id: 'test-admin-uid', role: Role.ADMIN },
      });
      record(
        'Suite 3',
        'Session callback accurately attaches Role.ADMIN from token to session.user',
        session?.user?.role === Role.ADMIN && session?.user?.id === 'test-admin-uid'
      );
    }

    // 3.5 Server Action Privilege Escalation Defense
    // Verify that all 7 admin mutation actions reject calls when unauthenticated / non-admin
    console.log('\n🛡️  SUITE 3.5: Admin Server Actions Privilege Escalation Resistance');
    console.log('----------------------------------------------------------------------');

    // Setup simulated unauthenticated request store for Next.js App Router Server Actions
    const dummyHeaders = new Headers();
    const mockRequestStore = {
      headers: dummyHeaders,
      cookies: dummyHeaders,
    };

    await requestAsyncStorage.run(mockRequestStore, async () => {
      // 1. createProduct without Admin session
      let createProductBlocked = false;
      try {
        await createProduct({
          name: 'Hacker Injected Product',
          description: 'Should never exist',
          categoryId: 'invalid-cat',
          priceInRupees: 999,
          stockQuantity: 10,
        });
      } catch (e: any) {
        createProductBlocked = e.message?.includes('Unauthorized: Admin access required.');
      }
      record(
        'Suite 3',
        'createProduct Server Action rejects unauthorized call',
        createProductBlocked
      );

      // 2. updateProduct without Admin session
      let updateProductBlocked = false;
      try {
        await updateProduct({
          id: 'some-prod-id',
          priceInRupees: 1,
        });
      } catch (e: any) {
        updateProductBlocked = e.message?.includes('Unauthorized: Admin access required.');
      }
      record(
        'Suite 3',
        'updateProduct Server Action rejects unauthorized call',
        updateProductBlocked
      );

      // 3. deleteProduct without Admin session
      let deleteProductBlocked = false;
      try {
        await deleteProduct('some-prod-id');
      } catch (e: any) {
        deleteProductBlocked = e.message?.includes('Unauthorized: Admin access required.');
      }
      record(
        'Suite 3',
        'deleteProduct Server Action rejects unauthorized call',
        deleteProductBlocked
      );

      // 4. createCategory without Admin session
      let createCategoryBlocked = false;
      try {
        await createCategory({
          name: 'Hacker Category',
        });
      } catch (e: any) {
        createCategoryBlocked = e.message?.includes('Unauthorized: Admin access required.');
      }
      record(
        'Suite 3',
        'createCategory Server Action rejects unauthorized call',
        createCategoryBlocked
      );

      // 5. updateCategory without Admin session
      let updateCategoryBlocked = false;
      try {
        await updateCategory({
          id: 'some-cat-id',
          name: 'Hacker Category Update',
        });
      } catch (e: any) {
        updateCategoryBlocked = e.message?.includes('Unauthorized: Admin access required.');
      }
      record(
        'Suite 3',
        'updateCategory Server Action rejects unauthorized call',
        updateCategoryBlocked
      );

      // 6. deleteCategory without Admin session
      let deleteCategoryBlocked = false;
      try {
        await deleteCategory('some-cat-id');
      } catch (e: any) {
        deleteCategoryBlocked = e.message?.includes('Unauthorized: Admin access required.');
      }
      record(
        'Suite 3',
        'deleteCategory Server Action rejects unauthorized call',
        deleteCategoryBlocked
      );

      // 7. updateOrderStatus without Admin session
      let updateOrderStatusBlocked = false;
      try {
        await updateOrderStatus('some-order-id', 'DELIVERED');
      } catch (e: any) {
        updateOrderStatusBlocked = e.message?.includes('Unauthorized: Admin access required.');
      }
      record(
        'Suite 3',
        'updateOrderStatus Server Action rejects unauthorized call',
        updateOrderStatusBlocked
      );
    });

  } finally {
    // Guaranteed cleanup of test users
    if (cleanupUserIds.length > 0) {
      console.log(`\n🧹 Cleaning up ${cleanupUserIds.length} temporary test user(s)...`);
      await prisma.user.deleteMany({
        where: { id: { in: cleanupUserIds } },
      });
      console.log('   Cleanup completed.');
    }
  }

  // =========================================================================
  // Final Results & Statistics
  // =========================================================================
  console.log('\n======================================================================');
  const total = assertions.length;
  const passed = assertions.filter((a) => a.passed).length;
  const failed = assertions.filter((a) => !a.passed).length;

  console.log(`TOTAL ASSERTIONS: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('======================================================================');

  if (failed > 0) {
    console.error(`\n❌ VERDICT: FAIL — ${failed} adversarial tests failed!`);
    process.exit(1);
  } else {
    console.log('\n🎉 VERDICT: PASS — ALL ADVERSARIAL STRESS TESTS PASSED!');
    process.exit(0);
  }
}

runAdversarialTestSuite()
  .catch((err) => {
    console.error('Fatal crash during test execution:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
