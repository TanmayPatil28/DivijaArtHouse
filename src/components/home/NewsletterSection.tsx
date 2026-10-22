'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Sparkles, Send, Gift } from 'lucide-react';
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
      className="py-16 md:py-24 bg-[#FAF5F0] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Haute Velvet Wine Private Invitation Suite */}
        <div className="relative rounded-[32px] sm:rounded-[44px] bg-gradient-to-br from-[#5E1420] via-[#781D2C] to-[#4A0D17] border border-gold/40 shadow-2xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
          {/* Luminous Ambient Radial Halo */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_50%,rgba(197,154,90,0.18),transparent_75%)] pointer-events-none" 
            aria-hidden="true" 
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Wax-Seal Envelope Medallion */}
            <div className="inline-flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/10 border border-gold/40 text-gold mb-3 shadow-gold-soft backdrop-blur-sm">
              <Mail className="w-6 h-6" />
            </div>

            {/* Atelier Eyebrow */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-gold/30 text-gold-light text-xs font-semibold uppercase tracking-widest shadow-2xs backdrop-blur-sm mb-3">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>A LITTLE NOTE FROM US • PRIVATE INVITATION</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
              Good things are{' '}
              <span className="font-serif italic font-normal text-gold inline-block">
                growing.
              </span>
            </h2>

            {/* Story Description */}
            <p className="text-sm sm:text-base text-[#FAF5F0]/85 max-w-lg mx-auto mt-2.5 leading-relaxed font-normal">
              Be the first to hear about new crochet creations, thoughtful gifting ideas, and the people and process behind our designs.
            </p>

            {/* Prominent Golden Welcome Voucher Badge */}
            <div className="my-5">
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-gold/20 border border-gold/50 text-gold-light text-xs sm:text-sm font-semibold tracking-wide shadow-gold-soft backdrop-blur-xs">
                <Gift className="w-4 h-4 text-gold shrink-0" />
                <span>Receive ₹100 off your first order upon joining</span>
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              </div>
            </div>

            {/* Unified Luxury Pill Form */}
            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2 sm:gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-black/40 border border-gold/40 shadow-inner backdrop-blur-md"
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
                className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium ${
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

            {/* Privacy Micro-Reassurance */}
            <p className="text-[11px] text-[#F7ECEE]/70 mt-4 leading-relaxed">
              Just the occasional lovely thing in your inbox. No spam, ever. Unsubscribe whenever you like.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
