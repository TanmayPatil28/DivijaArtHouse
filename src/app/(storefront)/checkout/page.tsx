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
  User,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  PenLine,
} from 'lucide-react';
import { useCart, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { createOrder } from '@/actions/checkout';
import { verifyPayment } from '@/actions/payment';

import { StateSelector, getStateFromPincode } from '@/components/checkout/StateSelector';

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
    state: 'Maharashtra',
    pincode: '',
    deliveryInstructions: '',
    paymentMethod: isRazorpayToggleEnabled ? 'RAZORPAY' : ('COD' as 'COD' | 'RAZORPAY'),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoDetectedState, setAutoDetectedState] = useState<string | null>(null);

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

  const handleStateChange = (selectedState: string) => {
    setForm((prev) => ({ ...prev, state: selectedState }));
    setAutoDetectedState(null);
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      // Smart PIN code auto-fill for Indian postal circles
      if (name === 'pincode') {
        const cleanPin = value.replace(/\D/g, '');
        if (cleanPin.length === 6) {
          const detected = getStateFromPincode(cleanPin);
          if (detected) {
            next.state = detected;
            setAutoDetectedState(detected);
            if (errors.state) {
              setErrors((errs) => ({ ...errs, state: undefined }));
            }
          }
        }
      }

      return next;
    });

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
          color: '#781D2C',
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
          <div className="w-20 h-20 rounded-full bg-[#FAF6F1] border border-gold/35 flex items-center justify-center mb-6 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif font-semibold text-2xl sm:text-3xl text-text-main tracking-tight mb-2">
            Your shopping bag is empty
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
            Please add some handcrafted crochet bouquets or floral gifts to your bag before checking out.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white transition-all shadow-md hover:shadow-gold-glow cursor-pointer"
          >
            <span>Explore Boutique Blooms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const isFreeShipping = summary.subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCharge = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = summary.subtotal + shippingCharge;

  const whatsappInquiryUrl = `https://wa.me/919209284423?text=${encodeURIComponent(
    `Hi Divija Art House, I'm at checkout with an order of ${formatINR(
      grandTotal
    )} and need some assistance with my delivery.`
  )}`;

  return (
    <div className="min-h-screen bg-canvas py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-text-muted mb-6"
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

        {/* 3-Step Checkout Progress Header */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-8 sm:mb-10 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-xs">
              1
            </span>
            <span>Contact &amp; Shipping</span>
          </div>
          <div className="h-px flex-1 bg-gold/40 mx-3"></div>
          <div className="flex items-center gap-2 text-[#8C5D23] font-semibold">
            <span className="w-6 h-6 rounded-full bg-gold/20 text-[#8C5D23] border border-gold/40 flex items-center justify-center text-xs font-bold shadow-xs">
              2
            </span>
            <span>Payment</span>
          </div>
          <div className="h-px flex-1 bg-border-subtle mx-3"></div>
          <div className="flex items-center gap-2 text-text-muted">
            <span className="w-6 h-6 rounded-full bg-black/5 text-text-muted flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Page Title & Reassurance Banner */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 border border-gold/40 text-primary text-xs font-semibold uppercase tracking-widest shadow-2xs mb-2 backdrop-blur-sm">
            <Lock className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <h1 className="font-semibold text-3xl sm:text-4xl lg:text-[40px] tracking-tight text-text-main leading-tight">
            Secure Atelier{' '}
            <span className="font-serif italic font-normal text-primary">
              Checkout.
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1.5 flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Direct studio dispatch. Handcrafted with love in Pune, India.</span>
          </p>
        </div>

        {/* Error Notification Banner */}
        {generalError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              {generalError}
            </div>
          </div>
        )}

        {/* Checkout Main 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Checkout Form (Left Column: 7 cols) */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            {/* Step 1: Contact Information */}
            <div className="bg-white border border-gold/30 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3.5 border-b border-gold/20">
                <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gold" />
                  <h2 className="font-serif font-semibold text-lg sm:text-xl text-text-main tracking-tight">
                    Contact Information
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="customerName"
                    className="block text-xs font-semibold text-text-main"
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
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all ${
                      errors.customerName
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle bg-white hover:border-gold/40'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="customerEmail"
                    className="block text-xs font-semibold text-text-main"
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
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all ${
                      errors.customerEmail
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle bg-white hover:border-gold/40'
                    }`}
                  />
                  {errors.customerEmail && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.customerEmail}
                    </p>
                  )}
                  <p className="text-[11px] text-text-muted">
                    Order confirmation &amp; tracking dispatched here.
                  </p>
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="customerPhone"
                    className="block text-xs font-semibold text-text-main"
                  >
                    Mobile Phone <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">
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
                      className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all ${
                        errors.customerPhone
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-border-subtle bg-white hover:border-gold/40'
                      }`}
                    />
                  </div>
                  {errors.customerPhone && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.customerPhone}
                    </p>
                  )}
                  <p className="text-[11px] text-text-muted">
                    Used for courier delivery updates &amp; dispatch OTP.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white border border-gold/30 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3.5 border-b border-gold/20">
                <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <h2 className="font-serif font-semibold text-lg sm:text-xl text-text-main tracking-tight">
                    Shipping Address
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Address Line 1 */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="addressLine1"
                    className="block text-xs font-semibold text-text-main"
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
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all ${
                      errors.addressLine1
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle bg-white hover:border-gold/40'
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.addressLine1}
                    </p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="addressLine2"
                    className="block text-xs font-semibold text-text-main"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-white hover:border-gold/40 focus:border-gold focus:ring-2 focus:ring-gold/30 text-sm text-text-main placeholder:text-gray-400 transition-all"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="city"
                    className="block text-xs font-semibold text-text-main"
                  >
                    City / Town <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Pune"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all ${
                      errors.city
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle bg-white hover:border-gold/40'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="state-trigger"
                      className="block text-xs font-semibold text-text-main"
                    >
                      State / UT <span className="text-primary">*</span>
                    </label>
                    {autoDetectedState && autoDetectedState === form.state && (
                      <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-in fade-in duration-200">
                        <Sparkles className="w-2.5 h-2.5 text-gold shrink-0" /> Auto-matched
                      </span>
                    )}
                  </div>
                  <StateSelector
                    value={form.state}
                    onChange={handleStateChange}
                    error={errors.state}
                    id="state"
                    name="state"
                  />
                  {errors.state && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* PIN Code */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="pincode"
                    className="block text-xs font-semibold text-text-main"
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
                    placeholder="411028"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all ${
                      errors.pincode
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-border-subtle bg-white hover:border-gold/40'
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                {/* Country (India) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-main">
                    Country
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="India"
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-[#FAF6F1] text-sm text-text-muted cursor-not-allowed"
                  />
                </div>

                {/* Delivery Instructions / Gifting Note */}
                <div className="sm:col-span-2 space-y-1.5 pt-1">
                  <label
                    htmlFor="deliveryInstructions"
                    className="block text-xs font-semibold text-text-main flex items-center gap-1.5"
                  >
                    <PenLine className="w-3.5 h-3.5 text-gold" />
                    <span>Delivery Instructions / Special Note <span className="text-text-muted font-normal">(Optional)</span></span>
                  </label>
                  <textarea
                    id="deliveryInstructions"
                    name="deliveryInstructions"
                    rows={2}
                    value={form.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="e.g. Ring the bell twice, leave with concierge, or specific anniversary delivery note."
                    className="w-full px-4 py-2.5 rounded-xl border border-border-subtle bg-white hover:border-gold/40 focus:border-gold focus:ring-2 focus:ring-gold/30 text-sm text-text-main placeholder:text-gray-400 transition-all resize-none shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white border border-gold/30 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3.5 border-b border-gold/20">
                <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gold" />
                  <h2 className="font-serif font-semibold text-lg sm:text-xl text-text-main tracking-tight">
                    Payment Method
                  </h2>
                </div>
              </div>

              {isRazorpayToggleEnabled ? (
                /* Dual Option: Online Razorpay vs COD */
                <div className="space-y-3 pt-1">
                  {/* Razorpay Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'RAZORPAY'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border-subtle hover:border-gold/40 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={form.paymentMethod === 'RAZORPAY'}
                      onChange={() => setForm((prev) => ({ ...prev, paymentMethod: 'RAZORPAY' }))}
                      className="mt-1 text-primary focus:ring-primary accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-text-main flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span>Online Payment (UPI, Cards, NetBanking via Razorpay)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        Instant payment via Google Pay, PhonePe, Paytm, all Cards, UPI &amp; NetBanking.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'COD'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border-subtle hover:border-gold/40 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={form.paymentMethod === 'COD'}
                      onChange={() => setForm((prev) => ({ ...prev, paymentMethod: 'COD' }))}
                      className="mt-1 text-primary focus:ring-primary accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-text-main flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-primary" />
                          <span>Cash on Delivery (COD)</span>
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        Pay cash or UPI upon delivery to the courier agent. No upfront card payment required.
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                /* Razorpay disabled: Single Cash on Delivery option with prominent badge */
                <div className="pt-1">
                  <div className="p-4 rounded-xl border border-gold/30 bg-[#FAF6F1] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-text-main">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-primary bg-white px-2.5 py-0.5 rounded-full border border-primary/20 shadow-2xs">
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
                className="w-full py-4 px-6 rounded-xl font-semibold uppercase tracking-wider text-sm sm:text-base text-white bg-primary hover:bg-primary-hover active:scale-[0.99] transition-all shadow-md hover:shadow-gold-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Processing Your Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-gold" />
                    <span>
                      {form.paymentMethod === 'RAZORPAY' && isRazorpayToggleEnabled
                        ? `Pay ${formatINR(grandTotal)} Securely`
                        : `Place Order • ${formatINR(grandTotal)} (Cash on Delivery)`}
                    </span>
                  </>
                )}
              </button>

              {/* 3-Item Trust & Artisan Guarantee Ribbon */}
              <div className="grid grid-cols-3 gap-2.5 mt-4 text-center">
                <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white border border-border-subtle shadow-2xs">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-[11px] font-semibold text-text-main">
                    100% Handcrafted
                  </span>
                  <span className="text-[10px] text-text-muted">Pune Women Artisans</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white border border-border-subtle shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-semibold text-text-main">
                    Verified Checkout
                  </span>
                  <span className="text-[10px] text-text-muted">256-Bit SSL Encrypted</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white border border-border-subtle shadow-2xs">
                  <Truck className="w-4 h-4 text-gold" />
                  <span className="text-[11px] font-semibold text-text-main">
                    Damage-Free
                  </span>
                  <span className="text-[10px] text-text-muted">Rigid Box Cushioning</span>
                </div>
              </div>
            </div>
          </form>

          {/* Minimalist Order Summary Sidebar (Right Column: 5 cols) */}
          <aside className="lg:col-span-5">
            <div className="sticky top-24 bg-[#FAF6F1] border border-gold/30 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
              
              {/* Summary Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-gold/20">
                <h2 className="font-serif font-semibold text-lg sm:text-xl text-text-main flex items-center gap-2 tracking-tight">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <span>Order Summary</span>
                </h2>
                <span className="text-xs font-semibold text-text-muted bg-white border border-gold/30 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gold/15 max-h-80 overflow-y-auto pr-1 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3">
                    {/* Item Thumbnail */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-gold/25 overflow-hidden flex-shrink-0 shadow-2xs">
                      <Image
                        src={item.image || '/images/products/blushing-peony-rose-1.svg'}
                        alt={item.name}
                        fill
                        unoptimized={Boolean(item.image?.endsWith('.svg'))}
                        className="object-contain p-1"
                        sizes="64px"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                        {item.quantity}
                      </span>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-text-main truncate">
                        {item.name}
                      </p>
                      {item.variantName && (
                        <p className="text-[11px] text-primary font-medium mt-0.5">
                          Style: {item.variantName}
                        </p>
                      )}
                      {item.personalization && (
                        <p className="text-[10px] text-text-muted italic truncate mt-0.5 flex items-center gap-1">
                          <PenLine className="w-3 h-3 text-gold flex-shrink-0" />
                          <span>Note: &ldquo;{item.personalization}&rdquo;</span>
                        </p>
                      )}
                      <p className="text-xs text-text-muted mt-1">
                        Qty: {item.quantity} × {formatINR(item.unitPrice)}
                      </p>
                    </div>

                    {/* Item Line Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs sm:text-sm font-serif font-bold text-text-main">
                        {formatINR(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-3.5 border-t border-gold/20 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Bag Subtotal</span>
                  <span className="text-text-main font-semibold">
                    {formatINR(summary.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-gold" />
                    <span>Shipping &amp; Handling</span>
                  </span>
                  {isFreeShipping ? (
                    <span className="text-emerald-800 font-semibold bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-300 text-xs">
                      FREE
                    </span>
                  ) : (
                    <span className="text-text-main font-semibold">
                      {formatINR(STANDARD_SHIPPING_FEE)}
                    </span>
                  )}
                </div>

                {!isFreeShipping && (
                  <p className="text-[11px] text-primary bg-primary/5 p-2 rounded-lg border border-primary/20 leading-snug">
                    💡 Free shipping on all orders over ₹999. Add items worth{' '}
                    <strong>{formatINR(summary.remainingForFreeShipping)}</strong> more to get free delivery!
                  </p>
                )}

                <div className="pt-3 border-t border-gold/20 flex justify-between items-baseline text-base sm:text-lg">
                  <span className="font-semibold text-text-main tracking-tight">
                    Total Payable
                  </span>
                  <span className="font-serif font-bold text-primary text-xl sm:text-2xl tracking-tight">
                    {formatINR(grandTotal)}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted text-right">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Authentic 100% Secure Checkout Badges */}
              <div className="pt-3 border-t border-gold/20 flex flex-wrap items-center justify-center gap-2">
                <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium mr-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Secure:
                </span>

                {/* Razorpay Badge */}
                <div
                  className="h-5 w-16 relative bg-white rounded px-1 flex items-center justify-center border border-border-subtle shadow-2xs overflow-hidden"
                  title="Razorpay"
                >
                  <Image
                    src="/images/badges/razorpay.svg"
                    alt="Razorpay"
                    fill
                    unoptimized
                    className="object-contain p-0.5"
                  />
                </div>

                {/* UPI Badge */}
                <div
                  className="h-5 w-12 relative bg-white rounded px-1 flex items-center justify-center border border-border-subtle shadow-2xs overflow-hidden"
                  title="UPI"
                >
                  <Image
                    src="/images/badges/upi.svg"
                    alt="UPI"
                    fill
                    unoptimized
                    className="object-contain p-0.5"
                  />
                </div>

                {/* COD Badge */}
                <div
                  className="h-5 w-12 relative bg-white rounded px-1 flex items-center justify-center border border-border-subtle shadow-2xs overflow-hidden"
                  title="Cash on Delivery"
                >
                  <Image
                    src="/images/badges/cod.svg"
                    alt="Cash on Delivery"
                    fill
                    unoptimized
                    className="object-contain p-0.5"
                  />
                </div>

                {/* Secure SSL Badge */}
                <div
                  className="h-5 w-14 relative bg-white rounded px-1 flex items-center justify-center border border-border-subtle shadow-2xs overflow-hidden"
                  title="256-Bit SSL Encrypted"
                >
                  <Image
                    src="/images/badges/secure.svg"
                    alt="SSL Encrypted"
                    fill
                    unoptimized
                    className="object-contain p-0.5"
                  />
                </div>
              </div>

              {/* Direct WhatsApp Concierge Helpline */}
              <div className="flex items-center justify-center pt-1">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-text-muted hover:text-emerald-700 transition-colors group"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Need help with this order? <strong>Chat on WhatsApp</strong></span>
                </a>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
