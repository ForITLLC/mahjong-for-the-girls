import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../site.config';
import InstagramIcon from '../components/InstagramIcon';
import PrintButton from '../components/PrintButton';

export const metadata: Metadata = {
  title: `${site.name} — card`,
  description: `${site.name} in ${site.city}. ${site.tagline} Tap to RSVP, follow along, or visit the site.`,
};

// The business card, as a shareable digital card — a "link in bio" you can text
// to anyone who asks about the table. On screen it's the tap-list below; hit
// Print and it lays out a full cut-it-yourself sheet of ten cards (the
// .card-sheet block, print-only). Carries its own UTM for GA4.
const CARDS_PER_SHEET = 10;
const links = [
  {
    href: '/?utm_source=card&utm_medium=web&utm_campaign=printables#events',
    label: 'Save your seat',
    sub: 'See upcoming tables & RSVP',
    primary: true,
  },
  {
    href: site.instagram,
    label: site.instagramHandle,
    sub: 'Follow along',
    external: true,
  },
  {
    href: '/learn',
    label: 'Learn to play — free',
    sub: 'Printable beginner’s guide',
  },
  {
    href: '/?utm_source=card&utm_medium=web&utm_campaign=printables',
    label: 'mahjongforthegirls.com',
    sub: 'The whole story',
  },
];

export default function CardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      {/* Print-only: a full Letter sheet of ten 3.5×2in cut-out cards. */}
      <div className="card-sheet" aria-hidden="true">
        {Array.from({ length: CARDS_PER_SHEET }).map((_, i) => (
          <div key={i} className="card-cell">
            <div className="card-cell-brand">
              <p className="card-cell-kicker">{site.city} · American Mahjong</p>
              <p className="card-cell-title">
                Mahjong for the <span className="italic">Girls</span>
              </p>
              <p className="card-cell-tag">{site.tagline}</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="card-cell-qr" src="/img/qr-events.png" alt="" />
            <div className="card-cell-meta">
              <p className="card-cell-url">mahjongforthegirls.com</p>
              <p className="card-cell-handle">{site.instagramHandle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card-print no-print pop w-full max-w-sm overflow-hidden rounded-3xl border border-ink/10 bg-white/80 shadow-xl">
        {/* brand band */}
        <div
          className="px-7 pb-6 pt-7 text-center text-white"
          style={{ background: 'linear-gradient(135deg, var(--mg-coral), var(--mg-sage))' }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-white/85">
            {site.city} · American Mahjong
          </p>
          <h1 className="mt-3 font-display text-4xl font-light leading-tight">
            Mahjong for the <span className="italic">Girls</span>
          </h1>
          <p className="mt-2 font-display text-lg italic text-white/90">
            {site.tagline}
          </p>
        </div>

        {/* tap rows */}
        <div className="space-y-3 p-6">
          {links.map((l) => {
            const inner = (
              <span className="flex items-center justify-between gap-3">
                <span>
                  <span className="flex items-center gap-2 font-medium text-ink">
                    {l.external && <InstagramIcon className="h-4 w-4 text-sage-deep" />}
                    {l.label}
                  </span>
                  <span className="text-xs text-mist">{l.sub}</span>
                </span>
                <span className="text-coral-deep" aria-hidden="true">
                  →
                </span>
              </span>
            );
            const cls = `block rounded-2xl border px-5 py-4 transition ${
              l.primary
                ? 'border-coral-deep/30 bg-coral/10 hover:bg-coral/20'
                : 'border-ink/10 bg-white/60 hover:bg-sage/10'
            }`;
            return l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {inner}
              </a>
            ) : (
              <Link key={l.label} href={l.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="no-print flex items-center justify-center gap-2 px-6 pb-6 text-xs text-mist">
          <PrintButton
            className="text-sage-deep underline-offset-4 hover:underline"
            label="Print a sheet of cards"
          />
          <span aria-hidden="true">·</span>
          <span>10 to a page, ready to cut</span>
        </div>
      </div>
    </main>
  );
}
