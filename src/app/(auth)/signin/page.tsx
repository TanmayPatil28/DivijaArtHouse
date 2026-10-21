'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Flower2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';
  const registered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      // Successful sign in: refresh and navigate
      router.refresh();
      if (email.toLowerCase().includes('admin')) {
        router.push(callbackUrl === '/account' ? '/admin' : callbackUrl);
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border-subtle/80 p-8 sm:p-10 relative overflow-hidden">
      {/* Decorative floral accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blush-soft/50 rounded-full blur-2xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blush-soft text-primary mb-3 shadow-inner">
          <Flower2 className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1 font-sans">
          Sign in to your <span className="font-semibold text-primary">DivijaArtHouse</span> account
        </p>
      </div>

      {/* Success banner after registration */}
      {registered && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>Account created successfully! Please sign in with your credentials.</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Demo Credentials Helper Pills */}
      <div className="mb-6 p-3.5 rounded-2xl bg-surface-warm border border-border-subtle">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center justify-between">
          <span>Quick Demo Access</span>
          <span className="text-[10px] text-primary font-normal">Click to prefill</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('admin@divijaarthouse.com', 'Admin@Divija123!')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-primary/20 bg-white hover:bg-blush-soft text-primary transition-all shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('ananya@example.com', 'Customer@123!')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-primary/20 bg-white hover:bg-blush-soft text-primary transition-all shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            <span>Customer</span>
          </button>
        </div>
      </div>

      {/* Sign-in Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-warm/30 text-sm text-text-main placeholder:text-text-muted/60 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-warm/30 text-sm text-text-main placeholder:text-text-muted/60 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 pt-6 border-t border-border-subtle text-center text-xs sm:text-sm text-text-muted">
        <span>Don&apos;t have an account yet? </span>
        <Link
          href="/register"
          className="font-semibold text-primary hover:text-primary-hover underline underline-offset-2 transition-colors"
        >
          Create one now
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-surface-warm/40">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl border border-border-subtle animate-pulse">
            <div className="w-12 h-12 bg-blush-soft rounded-2xl mx-auto mb-4" />
            <div className="h-6 bg-surface-warm rounded-md w-3/4 mx-auto mb-2" />
            <div className="h-4 bg-surface-warm rounded-md w-1/2 mx-auto mb-8" />
            <div className="space-y-4">
              <div className="h-10 bg-surface-warm rounded-xl" />
              <div className="h-10 bg-surface-warm rounded-xl" />
              <div className="h-10 bg-surface-warm rounded-xl" />
            </div>
          </div>
        }
      >
        <SignInContent />
      </Suspense>
    </div>
  );
}
