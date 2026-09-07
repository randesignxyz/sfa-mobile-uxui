import type { Metadata } from 'next';
import { Kantumruy_Pro } from 'next/font/google';

import './globals.css';

const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
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
    <html lang="en" className={kantumruyPro.variable}>
      <body className={kantumruyPro.className}>{children}</body>
    </html>
  );
}
