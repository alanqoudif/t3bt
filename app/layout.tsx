import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from 'geist/font/sans';
import 'katex/dist/katex.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Metadata, Viewport } from "next";
import { Syne, Tajawal } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL("https://scira.ai"),
  title: "ذكي",
  description: "ذكي - محرك بحث ذكي مدعوم بالذكاء الاصطناعي يساعدك على إيجاد المعلومات على الإنترنت.",
  openGraph: {
    url: "https://scira.ai",
    siteName: "ذكي",
  },
  keywords: [
    "ذكي",
    "dhaki",
    "محرك بحث ذكي",
    "بحث ذكي",
    "scira.ai",
    "scira ai",
    "Scira AI",
    "scira AI",
    "SCIRA.AI",
    "scira github",
    "ai search engine",
    "Scira",
    "scira",
    "scira.app",
    "scira ai",
    "scira ai app",
    "scira",
    "MiniPerplx",
    "Scira AI",
    "open source ai search engine",
    "minimalistic ai search engine",
    "ai search engine",
    "Scira (Formerly MiniPerplx)",
    "AI Search Engine",
    "mplx.run",
    "mplx ai",
    "zaid mukaddam",
    "scira.how",
    "search engine",
    "AI",
    "perplexity",
  ]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' }
  ],
}

const syne = Syne({ 
  subsets: ['latin'], 
  variable: '--font-syne',
   preload: true,
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  preload: true,
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="font-tajawal" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${syne.variable} ${tajawal.variable} font-tajawal antialiased`} style={{ fontFamily: "var(--font-tajawal)" }} suppressHydrationWarning>
        <NuqsAdapter>
          <Providers>
            <Toaster position="top-center" />
            {children}
          </Providers>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
