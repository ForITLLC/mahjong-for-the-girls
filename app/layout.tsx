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
  title: `${site.name} — ${site.city}`,
  description: `Unserious American mahjong for the girls in ${site.city} 🀄️ Lessons, play, and events — vibe-curated, beginner-friendly, zero pressure. Phones down, friends made. ${site.tagline}`,
  openGraph: {
    title: `${site.name} — ${site.city}`,
    description: `Unserious American mahjong for the girls in ${site.city}. Lessons, play, and events. Come make friends. ${site.tagline}`,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#f6f1e5',
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
