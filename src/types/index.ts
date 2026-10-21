import type {
  Product as PrismaProduct,
  Category as PrismaCategory,
  ProductVariant as PrismaProductVariant,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  User as PrismaUser,
  Address as PrismaAddress,
  WishlistItem as PrismaWishlistItem,
  Role,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  InquiryStatus,
} from '@prisma/client';

export type {
  Role,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  InquiryStatus,
  PrismaProduct,
  PrismaCategory,
  PrismaProductVariant,
  PrismaOrder,
  PrismaOrderItem,
  PrismaUser,
  PrismaAddress,
  PrismaWishlistItem,
};

export interface ProductWithCategory extends PrismaProduct {
  category: PrismaCategory;
  variants?: PrismaProductVariant[];
}

export interface CategoryWithProducts extends PrismaCategory {
  products?: PrismaProduct[];
  _count?: {
    products: number;
  };
}

/**
 * Standard Shopping Cart Item
 * Note: prices are strictly represented in integer paise (e.g. 149900 = ₹1,499.00)
 */
export interface CartItem {
  id: string; // composite key: `${productId}-${variantId || 'default'}`
  productId: string;
  name: string;
  slug: string;
  image: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number; // in paise
  quantity: number;
  personalization?: string;
  stock?: number;
}

export interface CartSummary {
  subtotal: number; // in paise
  shippingFee: number; // in paise
  taxAmount: number; // in paise
  totalAmount: number; // in paise
  itemCount: number;
  freeShippingThreshold: number; // e.g. 99900 paise (₹999)
  remainingForFreeShipping: number; // in paise
}

export interface AddressInput {
  fullName?: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: AddressInput;
  deliveryInstructions?: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    personalization?: string;
  }>;
  paymentMethod: 'COD' | 'RAZORPAY';
}

export interface ProductFilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
  q?: string;
  page?: number;
  limit?: number;
}
