import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Console | DivijaArtHouse',
  description: 'Manage handcrafted products, collections, inventory, and order fulfillment.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin?callbackUrl=/admin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/account');
  }

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col md:flex-row antialiased">
      {/* Sidebar for Desktop */}
      <AdminSidebar user={session.user} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen flex flex-col">
        <div className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
