import type { Metadata } from 'next';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import LearnGuide from '../components/LearnGuide';
import { site } from '../site.config';

export const metadata: Metadata = {
  title: `Learn Mahjong — Free Printables · ${site.name}`,
  description:
    'Free American mahjong starter materials: a beginner’s table guide, a QR invite poster, and business cards. All web pages — open one and hit print. No sign-up, no cost, no PDFs.',
};

// Each material is a web page that prints clean (Cmd/Ctrl-P → the site chrome
// drops out, brand colors stay). No PDFs — the page IS the printable. The invite
// and cards carry UTM-tagged QR codes, so GA4 attributes scans automatically.
const materials = [
  {
    href: '#guide',
    thumb: '/printables/guide-thumb.png',
    title: "Beginner's Table Guide",
    meta: '2 pages · Letter · double-sided',
    blurb:
      'Tiles, dragons, the Charleston, and how to read your card — everything for a first night, on two pages.',
    cta: 'Read & print the guide',
  },
  {
    href: '/invite',
    thumb: '/printables/poster-thumb.png',
    title: 'QR Invite Poster',
    meta: 'Print any size · scan to RSVP',
    blurb:
      'Pin it up anywhere. A big, friendly QR code drops people straight onto the calendar to save a seat.',
    cta: 'Open & print the invite →',
  },
  {
    href: '/card',
    thumb: '/printables/cards-thumb.png',
    title: 'Business Cards',
    meta: 'Prints 10 to a sheet · 3.5 × 2 in',
    blurb:
      'Slip one to anyone who asks about the table. Hitting print lays out a full cut-it-yourself sheet of ten.',
    cta: 'Open & print the cards →',
  },
];

export default function Learn() {
  return (
    <>
      <Nav />
      <main>
        {/* hero */}
        <section className="no-print mx-auto max-w-5xl px-6 pb-12 pt-16 text-center">
          <p className="eyebrow">Free to print &amp; share</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-tight md:text-6xl">
            Everything you need to{' '}
            <span className="italic text-gilt">start playing.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-mist">
            We made these and we&rsquo;re giving them away — no sign-up, no cost.
            Each one is a web page that prints clean: open it, hit{' '}
            <span className="whitespace-nowrap rounded bg-cream-deep px-1.5 py-0.5 text-sm text-ink">
              Print
            </span>
            , and the website chrome drops away. No PDFs to wrangle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#guide" className="btn-gold text-sm">
              Read the guide
            </a>
            <a href="#materials" className="btn-ghost text-sm">
              See all three
            </a>
          </div>
        </section>

        {/* materials grid — each links to a print-ready web page */}
        <section id="materials" className="no-print mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {materials.map((d) => (
              <div
                key={d.href}
                className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/70 shadow-sm transition-shadow hover:shadow-md"
              >
                <a href={d.href} className="block bg-cream-deep/40 p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.thumb}
                    alt={`Preview of the ${d.title}`}
                    className="mx-auto max-h-72 w-auto rounded-lg border border-ink/10 shadow-sm"
                  />
                </a>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl text-ink">{d.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-sage-deep">
                    {d.meta}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                    {d.blurb}
                  </p>
                  <a href={d.href} className="btn-gold mt-5 justify-center text-sm">
                    {d.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div id="guide" className="no-print mx-auto my-4 max-w-5xl px-6">
          <div className="rule" />
        </div>

        {/* the on-page, printable guide */}
        <LearnGuide />
      </main>
      <Footer />
    </>
  );
}
