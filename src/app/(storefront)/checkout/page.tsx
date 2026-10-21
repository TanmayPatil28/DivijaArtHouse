'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Banknote,
  Sparkles,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useCart, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { createOrder } from '@/actions/checkout';
import { verifyPayment } from '@/actions/payment';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

interface FormErrors {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, clearCart, isHydrated } = useCart();

  const isRazorpayToggleEnabled =
    process.env.NEXT_PUBLIC_RAZORPAY_ENABLED === 'true';

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    deliveryInstructions: '',
    paymentMethod: isRazorpayToggleEnabled ? 'RAZORPAY' : ('COD' as 'COD' | 'RAZORPAY'),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.customerName.trim() || form.customerName.trim().length < 2) {
      newErrors.customerName = 'Please enter your full name (at least 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.customerEmail.trim() || !emailRegex.test(form.customerEmail.trim())) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    const phoneClean = form.customerPhone.trim().replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneClean)) {
      newErrors.customerPhone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!form.addressLine1.trim() || form.addressLine1.trim().length < 3) {
      newErrors.addressLine1 = 'Please enter your house/flat number and street name';
    }

    if (!form.city.trim() || form.city.trim().length < 2) {
      newErrors.city = 'Please enter your city';
    }

    if (!form.state.trim()) {
      newErrors.state = 'Please select your state';
    }

    const pinClean = form.pincode.trim().replace(/\D/g, '');
    if (!/^\d{6}$/.test(pinClean)) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  // Helper to load Razorpay modal script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      // Check if Razorpay already loaded
      if ((window as unknown as { Razorpay: unknown }).Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (items.length === 0) {
      setGeneralError('Your shopping bag is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim().replace(/\D/g, ''),
        shippingAddress: {
          fullName: form.customerName.trim(),
          phone: form.customerPhone.trim().replace(/\D/g, ''),
          addressLine1: form.addressLine1.trim(),
          addressLine2: form.addressLine2.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim().replace(/\D/g, ''),
          country: 'India',
        },
        deliveryInstructions: form.deliveryInstructions.trim() || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          personalization: i.personalization,
        })),
        paymentMethod: (isRazorpayToggleEnabled && form.paymentMethod === 'RAZORPAY')
          ? ('RAZORPAY' as const)
          : ('COD' as const),
      };

      const result = await createOrder(payload);

      if (!result.success || !result.orderId) {
        setGeneralError(
          result.error || 'Failed to place your order. Please check your details and try again.'
        );
        setIsSubmitting(false);
        return;
      }

      // Handle Cash on Delivery
      if (result.paymentMethod === 'COD' || !result.razorpayOrder) {
        clearCart();
        router.push(`/order-confirmation/${result.orderId}`);
        return;
      }

      // Handle Razorpay Online Payment
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setGeneralError('Could not load secure payment gateway. Please try Cash on Delivery or refresh.');
        setIsSubmitting(false);
        return;
      }

      interface RazorpayResponse {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }

      interface RazorpayModalOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        prefill: {
          name: string;
          email: string;
          contact: string;
        };
        theme: {
          color: string;
        };
        handler: (response: RazorpayResponse) => Promise<void>;
        modal: {
          ondismiss: () => void;
        };
      }

      const options: RazorpayModalOptions = {
        key: result.razorpayOrder.keyId,
        amount: result.razorpayOrder.amount,
        currency: result.razorpayOrder.currency,
        name: 'DivijaArtHouse',
        description: `Order ${result.orderNumber}`,
        order_id: result.razorpayOrder.id,
        prefill: {
          name: form.customerName,
          email: form.customerEmail,
          contact: form.customerPhone,
        },
        theme: {
          color: '#A32D3B',
        },
        handler: async function (response: RazorpayResponse) {
          try {
            const verification = await verifyPayment({
              orderId: result.orderId!,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verification.success) {
              clearCart();
              router.push(`/order-confirmation/${result.orderId}`);
            } else {
              setGeneralError(
                verification.error || 'Payment signature verification failed. Please contact support.'
              );
              setIsSubmitting(false);
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setGeneralError('Failed to verify payment. Please check your order status.');
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const RazorpayConstructor = (
        window as unknown as { Razorpay: new (opts: RazorpayModalOptions) => { open: () => void } }
      ).Razorpay;

      const rzpInstance = new RazorpayConstructor(options);
      rzpInstance.open();
    } catch (err) {
      console.error('Error during checkout submit:', err);
      setGeneralError('A network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-canvas py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-canvas py-16 px-4">
        <div className="max-w-md mx-auto text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blush-soft border border-blush flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl text-text-main mb-2">
            Your shopping bag is empty
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
            Please add some handcrafted crochet bouquets or floral gifts to your bag before checking out.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white transition-all shadow-sm"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const isFreeShipping = summary.subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCharge = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = summary.subtotal + shippingCharge;

  return (
    <div className="min-h-screen bg-surface-warm/40 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-text-muted mb-8"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/cart" className="hover:text-primary transition-colors">
            Shopping Bag
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-text-main font-semibold">Checkout</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-main">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>256-bit encrypted checkout. Handcrafted with love in India.</span>
          </p>
        </div>

        {/* Error Notification Banner */}
        {generalError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              {generalError}
            </div>
          </div>
        )}

        {/* Checkout Form & Order Summary Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Checkout Form (Left Column) */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-7 space-y-8"
          >
            {/* Step 1: Contact Information */}
            <div className="bg-canvas border border-border-subtle rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border-subtle">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-text-main">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label
                    htmlFor="customerName"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-main"
                  >
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ananya Sharma"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.customerName
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle hover:border-gray-400 focus:border-primary'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label
                    htmlFor="customerEmail"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-main"
                  >
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={form.customerEmail}
                    onChange={handleInputChange}
                    placeholder="ananya@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.customerEmail
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle hover:border-gray-400 focus:border-primary'
                    }`}
                  />
                  {errors.customerEmail && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.customerEmail}
                    </p>
                  )}
                  <p className="text-[11px] text-text-muted">
                    We will send order confirmation and dispatch receipt here.
                  </p>
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1">
                  <label
                    htmlFor="customerPhone"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-main"
                  >
                    Mobile Phone <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-text-muted">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      maxLength={10}
                      value={form.customerPhone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.customerPhone
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-border-subtle hover:border-gray-400 focus:border-primary'
                      }`}
                    />
                  </div>
                  {errors.customerPhone && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.customerPhone}
                    </p>
                  )}
                  <p className="text-[11px] text-text-muted">
                    Used for courier delivery and OTP verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="bg-canvas border border-border-subtle rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border-subtle">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-text-main">
                  Shipping Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Address Line 1 */}
                <div className="sm:col-span-2 space-y-1">
                  <label
                    htmlFor="addressLine1"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-main"
                  >
                    Address Line 1 <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Flat/House No., Wing, Apartment Name, Street"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.addressLine1
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle hover:border-gray-400 focus:border-primary'
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.addressLine1}
                    </p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div className="sm:col-span-2 space-y-1">
                  <label
                    htmlFor="addressLine2"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-main"
                  >
                    Address Line 2 <span className="text-text-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Landmark, Area, Colony"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle hover:border-gray-400 focus:border-primary text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label
                    htmlFor="city"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-main"
                  >
                    City / Town <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    placeholder="e.g. New Delhi"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.city
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle hover:border-gray-400 focus:border-primary'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label
                    htmlFor="state"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-main"
                  >
                    State / UT <span className="text-primary">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleInputChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-main bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.state
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle hover:border-gray-400 focus:border-primary'
                    }`}
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* PIN Code */}
                <div className="space-y-1">
                  <label
                    htmlFor="pincode"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-main"
                  >
                    PIN Code <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    maxLength={6}
                    value={form.pincode}
                    onChange={handleInputChange}
                    placeholder="110001"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.pincode
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle hover:border-gray-400 focus:border-primary'
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                {/* Country (Fixed to India) */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-main">
                    Country
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-gray-50 text-sm text-text-muted cursor-not-allowed"
                  />
                </div>

                {/* Delivery Instructions / Notes */}
                <div className="sm:col-span-2 space-y-1 pt-2">
                  <label
                    htmlFor="deliveryInstructions"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-main"
                  >
                    Delivery Instructions / Gift Note <span className="text-text-muted font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="deliveryInstructions"
                    name="deliveryInstructions"
                    rows={2}
                    value={form.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="e.g. Ring the bell twice, leave with security guard, or special gift message."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle hover:border-gray-400 focus:border-primary text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-canvas border border-border-subtle rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border-subtle">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-text-main">
                  Payment Method
                </h2>
              </div>

              {isRazorpayToggleEnabled ? (
                /* Dual Option: Online Razorpay vs COD */
                <div className="space-y-3 pt-1">
                  {/* Razorpay Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'RAZORPAY'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border-subtle hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={form.paymentMethod === 'RAZORPAY'}
                      onChange={() => setForm((prev) => ({ ...prev, paymentMethod: 'RAZORPAY' }))}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-text-main flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span>Online Payment (UPI, Cards, NetBanking via Razorpay)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        Instant payment via Google Pay, PhonePe, Paytm, all Cards, UPI & NetBanking.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'COD'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border-subtle hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={form.paymentMethod === 'COD'}
                      onChange={() => setForm((prev) => ({ ...prev, paymentMethod: 'COD' }))}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-text-main flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-primary" />
                          <span>Cash on Delivery (COD)</span>
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        Pay cash or UPI upon delivery.
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                /* Razorpay disabled: Single Cash on Delivery option with prominent badge */
                <div className="pt-1">
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-text-main">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-primary bg-white px-2.5 py-0.5 rounded-full border border-primary/20 shadow-xs">
                        Default Payment
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed pl-7">
                      Pay cash or UPI upon delivery to the courier agent. No upfront card payment required.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Place Order CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-full font-semibold uppercase tracking-wider text-sm sm:text-base text-white bg-primary hover:bg-primary-hover active:scale-[0.99] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Processing Your Order...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span>
                      {form.paymentMethod === 'RAZORPAY' && isRazorpayToggleEnabled
                        ? `Pay ${formatINR(grandTotal)} Securely`
                        : `Place Order • ${formatINR(grandTotal)} (Cash on Delivery)`}
                    </span>
                  </>
                )}
              </button>

              {/* Trust & Guarantee Strip */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border border-border-subtle">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-text-muted">
                    100% Handcrafted
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border border-border-subtle">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-text-muted">
                    Verified Checkout
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white border border-border-subtle">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-text-muted">
                    Careful Packaging
                  </span>
                </div>
              </div>
            </div>
          </form>

          {/* Order Summary Sidebar (Right Column) */}
          <aside className="lg:col-span-5">
            <div className="sticky top-24 bg-canvas border border-border-subtle rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <h2 className="font-display font-bold text-lg text-text-main flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <span>Order Summary</span>
                </h2>
                <span className="text-xs font-semibold text-text-muted bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-border-subtle max-h-80 overflow-y-auto pr-1 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-surface-warm border border-border-subtle overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || '/images/products/blushing-peony-rose-1.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-text-main truncate">
                        {item.name}
                      </p>
                      {item.variantName && (
                        <p className="text-[11px] text-primary font-medium mt-0.5">
                          Variant: {item.variantName}
                        </p>
                      )}
                      {item.personalization && (
                        <p className="text-[10px] text-text-muted italic truncate mt-0.5">
                          Note: &ldquo;{item.personalization}&rdquo;
                        </p>
                      )}
                      <p className="text-xs text-text-muted mt-1">
                        Qty: {item.quantity} × {formatINR(item.unitPrice)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-text-main">
                        {formatINR(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-3 border-t border-border-subtle space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Bag Subtotal</span>
                  <span className="text-text-main font-semibold">
                    {formatINR(summary.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    <span>Shipping & Handling</span>
                  </span>
                  {isFreeShipping ? (
                    <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200 text-xs">
                      FREE
                    </span>
                  ) : (
                    <span className="text-text-main font-semibold">
                      {formatINR(STANDARD_SHIPPING_FEE)}
                    </span>
                  )}
                </div>

                {!isFreeShipping && (
                  <p className="text-[11px] text-primary bg-blush-soft/60 p-2 rounded-lg border border-blush/40 leading-snug">
                    💡 Free shipping on all orders over ₹999. Add items worth{' '}
                    <strong>{formatINR(summary.remainingForFreeShipping)}</strong> more to get free delivery!
                  </p>
                )}

                <div className="pt-3 border-t border-border-subtle flex justify-between items-baseline text-base sm:text-lg">
                  <span className="font-display font-bold text-text-main">
                    Total Payable
                  </span>
                  <span className="font-display font-bold text-primary text-xl sm:text-2xl">
                    {formatINR(grandTotal)}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted text-right">
                  Inclusive of all taxes
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
