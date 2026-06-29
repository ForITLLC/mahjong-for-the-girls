import type { Poster as PosterData } from '../data/posters';
import type { MahjongEvent } from '../data/events';

// The shared, brand-minted RSVP QR (same asset the invite + cards use). Events
// roll on a 14-day cadence, so a per-event static QR can't be pre-minted; the
// poster's prominent date names the night, and the code lands on the calendar
// where a tap RSVPs to it.
const EVENTS_QR = '/img/qr-events.svg';

function fmtDate(iso: string) {
  // Parse as a local date (no TZ drift), then format the pieces a poster wants.
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return {
    weekday: date.toLocaleString('en-US', { weekday: 'long' }),
    month: date.toLocaleString('en-US', { month: 'short' }),
    day: String(d),
    year: String(y),
  };
}

// A per-event poster, composed live over the current season's art — the same
// design system as <Poster>, but the DATE of the night is the hero element.
// Everything is sized in `cqi` (container-query inline units) and the root
// declares `container-type: inline-size`, so the identical component renders
// crisp in a small card AND at 1080×1350 for the printable/shareable permalink
// (/event/[id]). Change the data, the poster re-composes.
export default function EventPoster({
  event,
  poster,
  className = '',
}: {
  event: MahjongEvent;
  poster: PosterData;
  className?: string;
}) {
  const { accent } = poster;
  const { weekday, month, day, year } = fmtDate(event.date);
  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden bg-ink ${className}`}
      style={{ containerType: 'inline-size' }}
    >
      {/* the season's background photo — the brand flavor the night rides on */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* deep-teal contrast scrim so type reads on the bright pool photo */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,40,49,0.55) 0%, rgba(6,40,49,0.32) 40%, rgba(6,40,49,0.68) 100%)',
        }}
      />

      {/* the translucent panel — frames the type, photo bleeds around the edge */}
      <div className="absolute inset-[4.2%] flex flex-col rounded-[4cqi] bg-[rgba(8,46,55,0.52)] p-[7cqi] ring-1 ring-white/15 backdrop-blur-[2px]">
        <p
          className="text-[2.7cqi] font-semibold uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          Mahjong for the Girls
        </p>

        {/* the night — the date is the headline of an event poster */}
        <div className="mt-[6cqi]">
          <p className="text-[3.2cqi] font-semibold uppercase tracking-[0.34em] text-white/85">
            {weekday}
          </p>
          <h2
            className="mt-[1cqi] font-display text-[15cqi] font-extrabold leading-[0.86]"
            style={{ color: accent, textShadow: '0 0.4cqi 2cqi rgba(0,0,0,0.4)' }}
          >
            {month} {day}
          </h2>
          <p className="mt-[2.4cqi] font-display text-[4.4cqi] font-semibold text-white/95">
            {event.time} · {event.level}
          </p>
        </div>

        {/* which standing table, where */}
        <div className="mt-[5.5cqi]">
          <p className="font-display text-[5cqi] font-bold leading-tight text-white">
            {event.title}
          </p>
          <p className="mt-[1.6cqi] text-[3cqi] leading-snug text-white/80">
            {event.neighborhood} · {event.cadence}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-[3cqi] pt-[4cqi]">
          <div className="min-w-0">
            <p className="text-[2.6cqi] font-semibold uppercase tracking-[0.28em] text-white/90">
              Seattle · {year}
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
              className="block rounded-[2cqi] bg-white p-[1.7cqi]"
              style={{ boxShadow: '0 1cqi 3cqi rgba(0,0,0,0.30)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={EVENTS_QR}
                alt={`QR code — scan to RSVP for ${event.title} on ${weekday} ${month} ${day}`}
                className="block h-[15cqi] w-[15cqi]"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
