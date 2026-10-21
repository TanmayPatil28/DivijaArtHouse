'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { formatINR, formatDate } from '@/lib/utils';
import { updateOrderStatus } from '@/actions/admin';
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface OrderItemData {
  id: string;
  productName: string;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
  lineSubtotal: number;
  image: string | null;
  personalizationText: string | null;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  deliveryInstructions: string | null;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string | null;
  trackingCourier: string | null;
  createdAt: Date | string;
  items: OrderItemData[];
}

interface OrdersManagerProps {
  initialOrders: OrderData[];
}

const STATUS_FILTERS = [
  'ALL',
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const;

function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'SHIPPED':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'PROCESSING':
    case 'CONFIRMED':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'PENDING_COD':
    case 'PENDING':
    default:
      return 'bg-amber-50 text-amber-800 border-amber-200';
  }
}

export function OrdersManager({ initialOrders }: OrdersManagerProps) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [filter, setFilter] = useState<typeof STATUS_FILTERS[number]>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    startTransition(async () => {
      try {
        const res = await updateOrderStatus(orderId, newStatus);
        if (res.success && res.order) {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === orderId
                ? {
                    ...o,
                    orderStatus: res.order.orderStatus,
                    paymentStatus: res.order.paymentStatus,
                  }
                : o
            )
          );
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to update order status');
      } finally {
        setUpdatingId(null);
      }
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return o.orderStatus === 'PENDING' || o.orderStatus === 'PENDING_COD';
    if (filter === 'PROCESSING') return o.orderStatus === 'PROCESSING' || o.orderStatus === 'CONFIRMED';
    return o.orderStatus === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
        {STATUS_FILTERS.map((tab) => {
          const isActive = filter === tab;
          const count = orders.filter((o) => {
            if (tab === 'ALL') return true;
            if (tab === 'PENDING') return o.orderStatus === 'PENDING' || o.orderStatus === 'PENDING_COD';
            if (tab === 'PROCESSING') return o.orderStatus === 'PROCESSING' || o.orderStatus === 'CONFIRMED';
            return o.orderStatus === tab;
          }).length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
              }`}
            >
              <span>{tab.charAt(0) + tab.slice(1).toLowerCase()}</span>
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-xs">
          <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-stone-800">
            No Orders Found
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            There are no customer orders matching the &ldquo;{filter}&rdquo; filter.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id && isPending;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden transition-all hover:shadow-sm"
              >
                {/* Order Header */}
                <div className="p-5 sm:p-6 bg-stone-50/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm sm:text-base font-bold text-stone-900">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${getOrderStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                        Method: {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Status Transition Control */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 font-medium">Update Status:</span>
                      <div className="relative">
                        <select
                          disabled={isUpdating}
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className="py-1.5 pl-3 pr-8 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 appearance-none cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PENDING_COD">PENDING_COD</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <Link
                      href={`/order-confirmation/${order.id}`}
                      target="_blank"
                      className="p-2 text-stone-400 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-stone-200 transition-all"
                      title="Open Receipt Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Customer Details & Address */}
                <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border-b border-stone-100 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      Customer
                    </span>
                    <p className="font-semibold text-stone-900 text-sm mt-0.5">
                      {order.customerName}
                    </p>
                    <div className="text-stone-500 space-y-1 mt-1">
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        <span>{order.customerEmail}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{order.customerPhone}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      Shipping Destination
                    </span>
                    <div className="flex items-start gap-1.5 text-stone-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                      <p className="leading-relaxed">
                        {order.shippingAddressLine1}
                        {order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ''}
                        <br />
                        {order.city}, {order.state} - {order.pincode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      Fulfillment Summary
                    </span>
                    <div className="mt-1 space-y-1 text-stone-600">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-medium text-stone-800">{formatINR(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span className="font-medium text-stone-800">{formatINR(order.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-stone-100 font-bold text-stone-900 text-sm">
                        <span>Total:</span>
                        <span className="text-primary">{formatINR(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="p-5 sm:p-6 divide-y divide-stone-100">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">
                    Items in Order ({order.items.length})
                  </div>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 text-sm">
                            {item.productName}
                          </p>
                          <div className="text-stone-500 mt-0.5 space-x-2">
                            {item.variantName && <span>Variant: {item.variantName}</span>}
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span>{formatINR(item.unitPrice)} each</span>
                          </div>
                          {item.personalizationText && (
                            <p className="text-primary/90 italic font-serif mt-1">
                              &ldquo;{item.personalizationText}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right font-bold text-stone-900 text-sm">
                        {formatINR(item.lineSubtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
