import { events, type MahjongEvent, type EventStatus } from '../data/events';
import { site } from '../site.config';

const statusStyle: Record<EventStatus, { label: string; cls: string }> = {
  open: { label: 'Open', cls: 'border-gold/50 text-gold-soft' },
  waitlist: { label: 'Waitlist', cls: 'border-rouge/50 text-rouge' },
  'sold-out': { label: 'Sold out', cls: 'border-white/20 text-mist' },
};

function fmt(iso: string) {
  // Parse as a local date without TZ drift, then format for display.
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const weekday = date.toLocaleString('en-US', { weekday: 'long' });
  return { month, day: String(d), weekday };
}

function rsvpHref(ev: MahjongEvent) {
  const subject = encodeURIComponent(`RSVP — ${ev.title}`);
  const body = encodeURIComponent(
    `Hi,\n\nI'd love a seat at "${ev.title}" on ${ev.date} (${ev.time}) at ${ev.venue}, ${ev.neighborhood}.\n\nName:\nBrought a friend?:\n\nThanks!`
  );
  return `mailto:${site.contactEmail}?subject=${subject}&body=${body}`;
}

export default function Events() {
  return (
    <section id="events" className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">The calendar</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight md:text-5xl">
            Upcoming <span className="italic text-gilt">nights</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-mist">
          Seats are limited and tables fill. RSVP opens your mail app — tell us
          your name and we’ll hold your chair.
        </p>
      </div>

      <ul className="mt-14 space-y-4">
        {events.map((ev) => {
          const { month, day, weekday } = fmt(ev.date);
          const s = statusStyle[ev.status];
          return (
            <li
              key={ev.id}
              className="group grid items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-gold/40 hover:bg-white/[0.05] md:grid-cols-[auto_1fr_auto]"
            >
              <div className="flex items-center gap-5">
                <div className="tile flex h-20 w-16 flex-col items-center justify-center leading-none">
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-jade">
                    {month}
                  </span>
                  <span className="font-display text-3xl">{day}</span>
                </div>
                <div className="md:hidden">
                  <p className="text-sm text-mist">{weekday}</p>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-2xl">{ev.title}</h3>
                  <span
                    className={`rounded-full border px-3 py-0.5 text-xs uppercase tracking-wider ${s.cls}`}
                  >
                    {s.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-mist">
                  <span className="hidden md:inline">{weekday} · </span>
                  {ev.time} · {ev.venue}, {ev.neighborhood} · {ev.level}
                </p>
                <p className="mt-3 max-w-prose leading-relaxed text-mist">
                  {ev.blurb}
                </p>
              </div>

              <a
                href={rsvpHref(ev)}
                className={
                  ev.status === 'sold-out'
                    ? 'btn-ghost pointer-events-none opacity-40'
                    : 'btn-gold whitespace-nowrap'
                }
              >
                {ev.status === 'waitlist' ? 'Join waitlist' : 'RSVP'}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
