import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import './globals.css';

import { ThemeProvider } from '@/components/providers/theme-provider';

//TODO: Update metadata
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: 'Simple Sidebar',
  description: 'A simple and functional sidebar for Next.js.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
    title: 'Simple Sidebar',
    description: 'A simple and functional sidebar for Next.js.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simple Sidebar',
    description: 'A simple and functional sidebar for Next.js.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
