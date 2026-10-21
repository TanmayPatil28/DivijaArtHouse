'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flower2,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { registerUser } from '@/actions/auth';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        confirmPassword,
      });

      if (!res.success) {
        setError(res.error || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      // Success: redirect to sign-in page with registered flag
      router.push('/signin?registered=true');
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-surface-warm/40">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border-subtle/80 p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative floral accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blush-soft/50 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blush-soft text-primary mb-3 shadow-inner">
            <Flower2 className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text-main tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-sans">
            Join <span className="font-semibold text-primary">DivijaArtHouse</span> for handcrafted blooms & order tracking
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-warm/30 text-sm text-text-main placeholder:text-text-muted/60 transition-all outline-none"
              />
            </div>
          </div>

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
                placeholder="ananya@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-warm/30 text-sm text-text-main placeholder:text-text-muted/60 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5"
            >
              Phone Number <span className="text-[10px] text-text-muted font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-warm/30 text-sm text-text-main placeholder:text-text-muted/60 transition-all outline-none"
              />
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
                <Sparkles className="w-4 h-4" />
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Sign In */}
        <div className="mt-8 pt-6 border-t border-border-subtle text-center text-xs sm:text-sm text-text-muted">
          <span>Already have an account? </span>
          <Link
            href="/signin"
            className="font-semibold text-primary hover:text-primary-hover underline underline-offset-2 transition-colors"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
