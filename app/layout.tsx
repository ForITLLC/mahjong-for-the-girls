import type { Metadata, Viewport } from 'next';
import { Baloo_2, Jost } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { site } from './site.config';

// Rounded, chunky "bubble" display face to match the @mahjongforthegirls logo
// lettering. Replaces the old serif so headlines read playful, not formal.
const baloo = Baloo_2({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
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
  themeColor: '#1fb0c4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${jost.variable}`}>
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
