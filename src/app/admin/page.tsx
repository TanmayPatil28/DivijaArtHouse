import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatINR, formatDate } from '@/lib/utils';
import {
  IndianRupee,
  ShoppingBag,
  Flower2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Package,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard | DivijaArtHouse',
  description: 'DivijaArtHouse Storefront Metrics & Fulfillment Overview',
};

function getStatusBadge(status: string) {
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

export default async function AdminDashboardPage() {
  // Aggregate real store metrics from MySQL
  const activeOrders = await prisma.order.findMany({
    where: {
      orderStatus: { not: 'CANCELLED' },
    },
    select: {
      totalAmount: true,
    },
  });

  const totalRevenuePaise = activeOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalOrders = await prisma.order.count();
  const totalProducts = await prisma.product.count();

  const lowStockProducts = await prisma.product.findMany({
    where: {
      stockQuantity: { lte: 5 },
    },
    include: {
      category: true,
    },
    take: 8,
    orderBy: { stockQuantity: 'asc' },
  });

  const lowStockCount = await prisma.product.count({
    where: {
      stockQuantity: { lte: 5 },
    },
  });

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
            Storefront Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time performance metrics and inventory status for DivijaArtHouse
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-medium shadow-sm transition-all"
          >
            <Flower2 className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs sm:text-sm font-medium shadow-2xs transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 mt-3">
            {formatINR(totalRevenuePaise)}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live order volume</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Total Orders
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 mt-3">
            {totalOrders}
          </p>
          <p className="text-xs text-stone-500 mt-2">
            All customer checkouts
          </p>
        </div>

        {/* Total Catalog Products */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Active Products
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-primary">
              <Flower2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 mt-3">
            {totalProducts}
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Handcrafted bloom SKUs
          </p>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Low Stock Alerts
            </span>
            <div
              className={`p-2.5 rounded-xl ${
                lowStockCount > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p
            className={`text-2xl sm:text-3xl font-semibold tracking-tight mt-3 ${
              lowStockCount > 0 ? 'text-amber-800' : 'text-stone-900'
            }`}
          >
            {lowStockCount}
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Stock quantity &le; 5 units
          </p>
        </div>
      </div>

      {/* Low Stock Warning Banner if any items low */}
      {lowStockProducts.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-sm font-bold text-amber-900">
                Low Stock Inventory Notification ({lowStockCount} items need attention)
              </h2>
              <p className="text-xs text-amber-800/90 mt-0.5">
                The following artisan floral items have 5 or fewer items remaining in craft inventory:
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-white border border-amber-200 text-xs flex items-center justify-between shadow-2xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-semibold text-stone-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-stone-500">{p.category.name}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                        p.stockQuantity === 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.stockQuantity} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <h2 className="font-sans text-lg sm:text-xl font-bold text-stone-900">
              Recent Orders
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Latest transactions placed on the storefront
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>View all orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-stone-500">
            <Package className="w-8 h-8 mx-auto text-stone-400 mb-2" />
            <p className="text-sm">No orders recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase font-semibold text-stone-500">
                <tr>
                  <th className="py-3 px-5">Order #</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Total</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-stone-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-medium text-stone-900">{order.customerName}</div>
                      <div className="text-xs text-stone-500">{order.customerEmail}</div>
                    </td>
                    <td className="py-4 px-5 text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-bold text-stone-900">
                      {formatINR(order.totalAmount)}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/order-confirmation/${order.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover p-1"
                      >
                        <span>Receipt</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

