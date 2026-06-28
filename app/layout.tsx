import type { Metadata, Viewport } from 'next';
import { Fraunces, Jost } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { site } from './site.config';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz', 'SOFT', 'WONK'],
});

const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mahjongforthegirls.com'),
  title: `${site.name} — It’s a Mahj Hot Summer`,
  description: `It’s a Mahj Hot Summer 🌶️🍋 Unserious American mahjong for the girls in ${site.city} — margaritas, the 2026 card, and zero pressure. ${site.price} RSVP. Presented by ${site.presentedBy}.`,
  openGraph: {
    title: `It’s a Mahj Hot Summer 🌶️🍋 · ${site.name}`,
    description: `Mahjong Margarita in ${site.city}. Refresh the basics, level up to the 2026 card — completely unserious, but ridiculously fun. ${site.price} RSVP.`,
    type: 'website',
    images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: 'It’s a Mahj Hot Summer — Mahjong Margarita, Seattle' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `It’s a Mahj Hot Summer 🌶️🍋 · ${site.name}`,
    description: `Mahjong Margarita in ${site.city}. ${site.price} RSVP — completely unserious, ridiculously fun.`,
    images: ['/img/og.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#4ec5d6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jost.variable}`}>
      <body className="bg-field min-h-screen">{children}</body>
      {/* Google Analytics 4 — loads after the page is interactive */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${site.gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${site.gaMeasurementId}');
        `}
      </Script>
    </html>
  );
}
