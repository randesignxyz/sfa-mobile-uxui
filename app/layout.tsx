import type { Metadata } from 'next';
import { Inter, Kantumruy_Pro } from 'next/font/google';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-kantumruy',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aeon Sen Sok | SFA Stock Suggestion',
  description:
    'Interactive mobile prototype for reviewing suggested outlet stock orders.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${kantumruyPro.variable}`}>
      <body className={`${inter.className} font-sans`}>{children}</body>
    </html>
  );
}
