import type { NextAuthConfig } from 'next-auth';
import type { Role } from '@prisma/client';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        if (user.id) {
          token.id = user.id;
        }
        if ('role' in user && user.role) {
          token.role = user.role as Role;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id as string;
        } else if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role) {
          session.user.role = token.role as Role;
        }
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as { role?: string } | undefined)?.role;
      const pathname = nextUrl.pathname;

      // Admin routes require role 'ADMIN'
      if (pathname.startsWith('/admin')) {
        if (!isLoggedIn) {
          return false; // Redirects to /signin?callbackUrl=...
        }
        if (userRole !== 'ADMIN') {
          return Response.redirect(new URL('/account', nextUrl));
        }
        return true;
      }

      // Customer account routes require authenticated user
      if (pathname.startsWith('/account')) {
        if (!isLoggedIn) {
          return false;
        }
        return true;
      }

      return true;
    },
  },
  providers: [],
};
