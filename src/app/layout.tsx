import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
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
  themeColor: '#A32D3B',
  width: 'device-width',
  initialScale: 1,
};

import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-canvas text-text-main flex flex-col antialiased">
        <WishlistProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
