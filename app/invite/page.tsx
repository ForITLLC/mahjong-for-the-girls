import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '../site.config';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import PrintButton from '../components/PrintButton';

export const metadata: Metadata = {
  title: `You're invited — ${site.name}`,
  description: `A standing invitation to ${site.name} in ${site.city}. ${site.tagline} Tap to save your seat.`,
};

// A few real photos from the table — they print with the poster so a pinned-up
// invite shows what the night actually looks like, not just a QR code.
const photos = [
  { src: '/img/photos/tables-set.jpg', alt: 'A table set and waiting for a night of mahjong' },
  { src: '/img/photos/table-life.jpg', alt: 'Friends gathered around the mahjong table' },
  { src: '/img/photos/charcuterie.jpg', alt: 'A grazing board laid out for the evening' },
];

// The poster, as a shareable web page. Text someone this link, or pull it up on
// your phone for a friend to scan. On screen the call-to-action is a real button;
// the QR is there for in-person scans. Carries its own UTM so GA4 separates web
// invite traffic from printed-poster scans. Wears the same site chrome as the
// rest of the materials (hidden on print) and prints clean via @media print.
export default function Invite() {
  return (
    <>
      <div className="no-print">
        <Nav />
      </div>
      <main className="relative flex min-h-[82vh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      {/* top + bottom brand bars */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-2"
        style={{ background: 'linear-gradient(90deg, var(--mg-coral), var(--mg-sage))' }}
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2"
        style={{ background: 'linear-gradient(90deg, var(--mg-coral), var(--mg-sage))' }}
        aria-hidden="true"
      />

      <div className="rise mx-auto flex max-w-xl flex-col items-center">
        <p className="eyebrow">
          {site.city} &nbsp;&middot;&nbsp; American Mahjong
        </p>

        <h1 className="mt-5 font-display text-6xl font-light leading-[0.95] sm:text-7xl">
          Mahjong
          <br />
          for the <span className="italic text-gilt">Girls</span>
        </h1>

        <p className="mt-5 font-display text-2xl italic text-mist">
          {site.tagline}
        </p>

        <p className="mx-auto mt-5 max-w-md leading-relaxed text-mist">
          Unserious mahjong, seriously good rooms, your kind of girls.
          <br className="hidden sm:block" /> Total beginner? Perfect — we&rsquo;ll
          teach you. 💖
        </p>

        {/* a glimpse of the table — prints with the poster */}
        <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-2.5">
          {photos.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.src}
              src={p.src}
              alt={p.alt}
              className="aspect-[3/4] w-full rounded-xl border border-ink/10 object-cover shadow-sm"
            />
          ))}
        </div>

        <div className="my-9 flex items-center gap-3 text-coral-deep" aria-hidden="true">
          <span className="h-px w-16 bg-coral/60" />
          &#9670;
          <span className="h-px w-16 bg-coral/60" />
        </div>

        {/* primary action — on web you tap, not scan */}
        <a
          href="/?utm_source=invite&utm_medium=web&utm_campaign=printables#events"
          className="btn-gold text-base"
        >
          Pick a night &amp; save your seat 🫶
        </a>

        {/* QR for in-person scans */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/qr-events.svg"
              alt="Scan to see upcoming tables and RSVP"
              className="h-40 w-40"
            />
          </div>
          <p className="text-xs text-mist">
            Or have a friend scan this to RSVP.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-1">
          <span className="font-display text-xl font-medium text-sage-deep">
            mahjongforthegirls.com
          </span>
          <span className="text-sm text-mist">{site.instagramHandle}</span>
        </div>

        {/* utilities — hidden when printing */}
        <div className="no-print mt-10 flex flex-wrap items-center justify-center gap-3">
          <PrintButton label="Print this invite" />
          <Link href="/learn" className="text-sm text-sage-deep underline-offset-4 hover:underline">
            More free materials
          </Link>
        </div>
      </div>
      </main>
      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
