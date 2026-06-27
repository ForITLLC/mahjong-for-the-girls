import type { Metadata } from 'next';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import LearnGuide from '../components/LearnGuide';
import { site } from '../site.config';

export const metadata: Metadata = {
  title: `Learn Mahjong — Free Printables · ${site.name}`,
  description:
    'Free, printable American mahjong starter kit: a beginner’s table guide, a QR poster, and business cards. Read the guide on screen or print it — no sign-up, no cost.',
};

// Each download is a print-ready PDF we authored. The poster and cards carry
// UTM-tagged QR codes, so GA4 attributes scans automatically.
const downloads = [
  {
    file: '/printables/guide.pdf',
    thumb: '/printables/guide-thumb.png',
    title: "Beginner's Table Guide",
    meta: '2 pages · Letter · double-sided',
    blurb:
      'Tiles, dragons, the Charleston, and how to read your card — everything for a first night, on two pages.',
  },
  {
    file: '/printables/poster.pdf',
    thumb: '/printables/poster-thumb.png',
    title: 'QR Invite Poster',
    meta: '18 × 24 in · scan to RSVP',
    blurb:
      'Pin it up anywhere. A big, friendly QR code drops people straight onto the calendar to save a seat.',
  },
  {
    file: '/printables/cards.pdf',
    thumb: '/printables/cards-thumb.png',
    title: 'Business Cards',
    meta: 'Letter sheet · 10 cards · 3.5 × 2 in',
    blurb:
      'Ten cut-out cards per sheet with a scan-to-RSVP QR. Slip one to anyone who asks about the table.',
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
            Print the beginner&rsquo;s guide for your first night, hang a poster, or
            hand out a card. Read the whole guide right here, or grab the PDFs below.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#guide" className="btn-gold text-sm">
              Read the guide
            </a>
            <a href="#downloads" className="btn-ghost text-sm">
              Download the PDFs
            </a>
          </div>
        </section>

        {/* downloads grid */}
        <section id="downloads" className="no-print mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {downloads.map((d) => (
              <div
                key={d.file}
                className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/70 shadow-sm transition-shadow hover:shadow-md"
              >
                <a
                  href={d.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-cream-deep/40 p-5"
                >
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
                  <a
                    href={d.file}
                    download
                    className="btn-gold mt-5 justify-center text-sm"
                  >
                    Download PDF
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
