'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Sparkles, Send } from 'lucide-react';
import { subscribeNewsletter } from '@/actions/newsletter';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('email', email.trim());
    formData.append('source', 'homepage_section');

    try {
      const res = await subscribeNewsletter(null, formData);
      setResult(res);
      if (res.success) {
        setEmail('');
      }
    } catch {
      setResult({
        success: false,
        message: 'Unable to connect. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-label="Newsletter Subscription"
      className="py-14 md:py-20 bg-gradient-to-br from-surface-warm via-blush-soft/50 to-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-white rounded-3xl border border-border-subtle p-8 sm:p-12 shadow-lg text-center">
          {/* Decorative Sparkle Circle */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blush-soft text-primary mb-4">
            <Mail className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join the Divija Bloom Club</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-main">
            Little Blooms, Straight to Your Inbox
          </h2>

          <p className="text-sm sm:text-base text-text-muted max-w-lg mx-auto mt-2 mb-8 leading-relaxed">
            Subscribe to receive gentle reminders for upcoming milestones,
            artisan behind-the-scenes, and ₹100 off your very first handcrafted
            bouquet.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (result) setResult(null);
                }}
                placeholder="Enter your email address"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-full border border-border-subtle bg-surface-warm/50 text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-primary focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.98] disabled:opacity-60 flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </form>

          {/* Status Feedback */}
          {result && (
            <div
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium ${
                result.success
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          <p className="text-[11px] text-text-muted mt-4">
            We value your inbox. No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
