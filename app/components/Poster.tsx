import type { Poster as PosterData } from '../data/posters';
import { posterQrSrc } from '../data/posters';

// The seasonal poster, composed live. A clean background photo (the season's
// "flavor") with the brand's own type laid over it — Fraunces headline, Jost
// structure, a seasonal accent, and a monthly-attribution QR. No baked text,
// no price: change the data, the poster re-composes.
//
// Everything is sized in `cqi` (container-query inline units) and the root
// declares `container-type: inline-size`, so the exact same component renders
// crisp in the small hero card AND at 1080×1350 for the downloadable share
// image (see /poster/[id] + scripts/export-posters.sh).
export default function Poster({
  poster,
  className = '',
}: {
  poster: PosterData;
  className?: string;
}) {
  const { accent } = poster;
  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden bg-ink ${className}`}
      style={{ containerType: 'inline-size' }}
    >
      {/* the required background photo — the seasonal flavor */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* global contrast scrim so type reads on any photo */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,28,24,0.28) 0%, rgba(20,28,24,0.10) 38%, rgba(20,28,24,0.42) 100%)',
        }}
      />

      {/* the translucent panel — frames the type, photo bleeds around the edge */}
      <div className="absolute inset-[4.2%] flex flex-col rounded-[4cqi] bg-[rgba(26,36,31,0.46)] p-[7cqi] ring-1 ring-white/15 backdrop-blur-[2px]">
        <p
          className="text-[2.7cqi] font-semibold uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          Mahjong for the Girls
        </p>

        <div className="mt-[5cqi]">
          <h2
            className="text-balance font-display text-[10cqi] font-normal leading-[0.95]"
            style={{ color: accent, textShadow: '0 0.4cqi 2cqi rgba(0,0,0,0.35)' }}
          >
            {poster.title}
          </h2>
          <p className="mt-[3cqi] font-display text-[3.9cqi] italic leading-snug text-white/90">
            {poster.tagline}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-[3cqi]">
          <div className="min-w-0">
            <p className="text-[2.6cqi] font-semibold uppercase tracking-[0.28em] text-white/90">
              Seattle
            </p>
            <p
              className="mt-[1.4cqi] font-display text-[3cqi] font-medium"
              style={{ color: accent }}
            >
              mahjongforthegirls.com
            </p>
            <p className="mt-[0.6cqi] text-[2cqi] tracking-[0.06em] text-white/60">
              @mahjongforthegirls
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="mb-[1.4cqi] text-[1.9cqi] font-semibold uppercase tracking-[0.24em] text-white/80">
              Scan to RSVP
            </p>
            <span
              className="block rounded-[2cqi] bg-white p-[1.7cqi] shadow-lg"
              style={{ boxShadow: '0 1cqi 3cqi rgba(0,0,0,0.30)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={posterQrSrc(poster.id)}
                alt={`QR code — scan to RSVP for ${poster.season}`}
                className="block h-[15cqi] w-[15cqi]"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
