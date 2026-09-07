import type { Metadata } from 'next';

import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
