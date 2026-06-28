'use client';

import { useEffect, useState } from 'react';
import { events as fallbackEvents, type EventStatus, type MahjongEvent } from '../data/events';
import RsvpButton from './RsvpButton';
import ExpressInterest from './ExpressInterest';

const statusStyle: Record<EventStatus, { label: string; cls: string }> = {
  open: { label: 'Open', cls: 'border-sage/60 text-sage-deep' },
  waitlist: { label: 'Waitlist', cls: 'border-coral/70 text-coral-deep' },
  'sold-out': { label: 'Sold out', cls: 'border-ink/20 text-mist' },
};

function fmt(iso: string) {
  // Parse as a local date without TZ drift, then format for display.
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const weekday = date.toLocaleString('en-US', { weekday: 'long' });
  return { month, day: String(d), weekday };
}

export default function Events() {
  // Start from the built-in standing cadence so the section renders instantly and
  // works even if the backend is offline. If an editor has published events via
  // the admin area, swap them in — that list takes over the public calendar.
  const [events, setEvents] = useState<MahjongEvent[]>(fallbackEvents);
  useEffect(() => {
    let live = true;
    fetch('/api/events')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (live && Array.isArray(data) && data.length > 0) {
          const norm: MahjongEvent[] = data
            .map((e) => ({
              id: e.id,
              title: e.title,
              date: e.date,
              time: e.time,
              venue: e.venue || 'Address shared when you RSVP',
              neighborhood: e.neighborhood || 'Seattle',
              blurb: e.blurb || '',
              status: (['open', 'waitlist', 'sold-out'].includes(e.status) ? e.status : 'open') as EventStatus,
              level: e.level || 'All levels',
              cadence: e.cadence || 'One-off',
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
          setEvents(norm);
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

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
          We play every other week — Thursday evenings at 6:30 and Saturday
          afternoons at 12:30. Tap RSVP — Going, Maybe, or Can’t — and we’ll hold
          your chair.
        </p>
      </div>

      <ul className="mt-14 space-y-4">
        {events.map((ev) => {
          const { month, day, weekday } = fmt(ev.date);
          const s = statusStyle[ev.status];
          return (
            <li
              key={ev.id}
              className="group grid items-center gap-6 rounded-2xl border border-ink/10 bg-white/70 p-6 transition-colors hover:border-coral/50 hover:bg-white md:grid-cols-[auto_1fr_auto]"
            >
              <div className="flex items-center gap-5">
                <div className="tile flex h-20 w-16 flex-col items-center justify-center leading-none">
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-sage-deep">
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
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-sage-deep/80">
                  {ev.cadence}
                </p>
                <p className="mt-3 max-w-prose leading-relaxed text-mist">
                  {ev.blurb}
                </p>
              </div>

              <RsvpButton ev={ev} />
            </li>
          );
        })}
      </ul>

      {/* Express interest — for anyone the listed nights don't suit. */}
      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-sage/50 bg-white/40 px-6 py-8 text-center">
        <h3 className="font-display text-2xl text-ink">
          None of these <span className="italic text-gilt">work?</span>
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-mist">
          The tables roll every other week, and we add nights as more of you turn
          up. Tell us when you’re free and we’ll save you a seat at the next one.
        </p>
        <ExpressInterest label="Express interest" />
      </div>
    </section>
  );
}
