import type { Metadata, Viewport } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'DivijaArtHouse | Handcrafted Everlasting Crochet Flowers & Gifts',
  description:
    'Little Blooms, Lasting Feelings. Discover handcrafted everlasting crochet flower bouquets, adorable desk flower pots, curated gift boxes, and artisanal floral accessories.',
  metadataBase: new URL('https://divijaarthouse.com'),
  openGraph: {
    title: 'DivijaArtHouse | Little Blooms, Lasting Feelings',
    description:
      'Handcrafted everlasting crochet flower bouquets, flower pots, and bespoke gift hampers designed to keep your moments blooming forever.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'DivijaArtHouse',
  },
};

export const viewport: Viewport = {
  themeColor: '#781D2C',
  width: 'device-width',
  initialScale: 1,
};

import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { getSiteSettings } from '@/lib/site-settings';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = getSiteSettings();

  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-canvas text-text-main font-sans flex flex-col antialiased">
        <SmoothScrollProvider>
          <WishlistProvider>
            <CartProvider>
              <AnnouncementBar
                isEnabled={siteSettings.announcementBar.isEnabled}
                messages={siteSettings.announcementBar.messages}
              />
              <Header navItems={siteSettings.navigation.items} />
              <main className="flex-1 w-full">{children}</main>
              <Footer identity={siteSettings.identity} />
              <CartDrawer />
            </CartProvider>
          </WishlistProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
