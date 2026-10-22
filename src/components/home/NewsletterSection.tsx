'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Sparkles, Send, Gift, ShieldCheck } from 'lucide-react';
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
      className="relative bg-gradient-to-r from-[#5E1420] via-[#781D2C] to-[#50101A] border-y border-gold/30 shadow-lg py-10 sm:py-12 md:py-14 overflow-hidden"
    >
      {/* Ambient Radial Spotlight */}
      <div 
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(197,154,90,0.15),transparent_75%)] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Invitation, Headline & Welcome Perk (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-3.5 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 border border-gold/30 text-gold-light text-xs font-semibold uppercase tracking-widest shadow-2xs backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>A LITTLE NOTE FROM US • THE BLOOM CLUB</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
              Good things are{' '}
              <span className="font-serif italic font-normal text-gold inline-block">
                growing.
              </span>
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#FAF5F0]/85 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              Be the first to hear about new handcrafted crochet creations, thoughtful gifting ideas, and behind-the-scenes craft stories.
            </p>

            {/* Welcome Voucher Badge */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/50 text-gold-light text-xs font-semibold tracking-wide shadow-gold-soft backdrop-blur-xs">
                <Gift className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Receive ₹100 off your first order upon joining</span>
                <Sparkles className="w-3 h-3 text-gold shrink-0" />
              </div>
            </div>
          </div>

          {/* Right Column: Unified Form & 3 Member Perks (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-3">
            {/* Unified Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 sm:gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-black/40 border border-gold/40 shadow-inner backdrop-blur-md"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (result) setResult(null);
                  }}
                  placeholder="Enter your email address..."
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 sm:py-2.5 bg-transparent text-sm text-white placeholder-[#FAF5F0]/50 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-full bg-gold hover:bg-gold-hover text-[#2E1715] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Join the Bloom Club</span>
                  </>
                )}
              </button>
            </form>

            {/* Status Feedback */}
            {result && (
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium ${
                  result.success
                    ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
                    : 'bg-red-950/80 text-red-200 border border-red-500/40'
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            {/* 3 Member Perks Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-[11px] text-[#F7ECEE]/80 pt-1">
              <span className="inline-flex items-center gap-1">
                <span className="text-gold">✦</span> Secret Bloom Drops
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-gold">✦</span> Early Holiday Access
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-gold">✦</span> Unsubscribe Anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
