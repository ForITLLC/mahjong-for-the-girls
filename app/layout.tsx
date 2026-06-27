import type { Metadata, Viewport } from 'next';
import { Fraunces, Jost } from 'next/font/google';
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
  description: `Mahjong, curated for women in ${site.city}. Beautiful nights, real tables, your kind of people. ${site.tagline}`,
  openGraph: {
    title: `${site.name} — ${site.city}`,
    description: `Mahjong, curated for women in ${site.city}. ${site.tagline}`,
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
    </html>
  );
}
