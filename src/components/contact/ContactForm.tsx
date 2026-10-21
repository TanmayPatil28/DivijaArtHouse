'use client';

import React, { useState, useTransition } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  User,
  Phone,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { submitContactInquiry, type ContactActionResult } from '@/actions/contact';

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ContactActionResult | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error message when user starts re-typing
    if (result && !result.success) {
      setResult(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const response = await submitContactInquiry(formData);
      setResult(response);
      if (response.success) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-border-subtle shadow-sm">
      <div className="space-y-2 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-main">
          Send Us a Note
        </h2>
        <p className="text-sm text-text-muted">
          Whether you have a question about our flowers, wish to place a custom
          color order, or simply want to say hello, we are here for you.
        </p>
      </div>

      {result?.success ? (
        <div className="bg-green-50/80 border border-green-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 animate-in fade-in">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-700">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 tracking-tight">
            Message Sent Successfully!
          </h3>
          <p className="text-sm text-green-800 max-w-md mx-auto leading-relaxed">
            {result.message}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setResult(null)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-green-300 text-xs font-semibold text-green-900 hover:bg-green-100/50 transition-colors shadow-sm"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {result && !result.success && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to submit inquiry</p>
                <p className="text-xs text-red-700 mt-0.5">{result.message}</p>
              </div>
            </div>
          )}

          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-text-main uppercase tracking-wider mb-2"
              >
                Your Name <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-canvas text-sm text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                    result?.errors?.name
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-border-subtle focus:border-primary'
                  }`}
                />
              </div>
              {result?.errors?.name && (
                <p className="text-xs text-red-600 mt-1">
                  {result.errors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-text-main uppercase tracking-wider mb-2"
              >
                Email Address <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="priya@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-canvas text-sm text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                    result?.errors?.email
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-border-subtle focus:border-primary'
                  }`}
                />
              </div>
              {result?.errors?.email && (
                <p className="text-xs text-red-600 mt-1">
                  {result.errors.email[0]}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Subject Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold text-text-main uppercase tracking-wider mb-2"
              >
                Phone Number <span className="text-gray-400 lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-canvas text-sm text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                    result?.errors?.phone
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-border-subtle focus:border-primary'
                  }`}
                />
              </div>
              {result?.errors?.phone && (
                <p className="text-xs text-red-600 mt-1">
                  {result.errors.phone[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-xs font-semibold text-text-main uppercase tracking-wider mb-2"
              >
                Inquiry Topic
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-canvas text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none"
                >
                  <option value="General Inquiry">General Question / Inquiry</option>
                  <option value="Custom Bouquet Request">Custom Bouquet / Color Request</option>
                  <option value="Bulk & Corporate Gifting">Bulk, Wedding, or Corporate Gifting</option>
                  <option value="Order Status & Delivery">Order Status & Delivery Query</option>
                  <option value="Press & Collaboration">Collaboration & Press</option>
                </select>
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold text-text-main uppercase tracking-wider mb-2"
            >
              Your Message <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you have in mind! If requesting a custom bouquet, let us know your preferred flowers, color palette, or special occasion..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-canvas text-sm text-text-main placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                  result?.errors?.message
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-border-subtle focus:border-primary'
                }`}
              />
            </div>
            {result?.errors?.message && (
              <p className="text-xs text-red-600 mt-1">
                {result.errors.message[0]}
              </p>
            )}
            <p className="text-[11px] text-text-muted mt-1 text-right">
              {formData.message.length} / 3000 characters
            </p>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Your Message...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Message to Divija Studio</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
