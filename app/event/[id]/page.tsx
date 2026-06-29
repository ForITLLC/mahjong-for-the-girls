import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventPoster from '../../components/EventPoster';
import { eventFromId, eventPosterParams } from '../../data/events';
import { currentPoster } from '../../data/posters';

// A full-bleed permalink for each night's poster, composed live by <EventPoster>
// at 1080×1350 over the current season's art. Mirrors /poster/[id]: a shareable,
// printable advertisement for one specific table. The event id encodes its date,
// so the page resolves its own content — no runtime list needed.
export const dynamicParams = false;

export function generateStaticParams() {
  return eventPosterParams();
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const ev = eventFromId(params.id);
  if (!ev) return { title: 'Mahjong for the Girls' };
  const [y, m, d] = ev.date.split('-').map(Number);
  const when = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  return {
    title: `${ev.title} — ${when} · Mahjong for the Girls`,
    description: `${when} at ${ev.time}. ${ev.blurb}`,
  };
}

export default function EventPosterPermalink({
  params,
}: {
  params: { id: string };
}) {
  const ev = eventFromId(params.id);
  if (!ev) notFound();
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream">
      <div className="w-full max-w-[1080px]">
        <EventPoster event={ev} poster={currentPoster} />
      </div>
    </main>
  );
}
