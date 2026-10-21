import React from 'react';
import prisma from '@/lib/prisma';
import { OrdersManager } from '@/components/admin/OrdersManager';

export const metadata = {
  title: 'Order Fulfillment | DivijaArtHouse Admin',
  description: 'Manage and update order fulfillment status for handcrafted floral deliveries.',
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
          Order Fulfillment & Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Review customer orders, verify payment status, and transition fulfillment milestones
        </p>
      </div>

      <OrdersManager initialOrders={orders} />
    </div>
  );
}
