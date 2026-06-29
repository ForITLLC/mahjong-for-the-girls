import { currentPoster } from '../data/posters';

// The hero's centerpiece: the current season's poster — our rotating
// advertisement art — shown large so the "flavor of the month" actually leads
// the page instead of sitting in a side card. The full run of seasons lives in
// the archive on /learn (Goodies).
export default function SeasonalPoster() {
  const p = currentPoster;
  return (
    <div className="rise relative">
      {/* Seasonal glow — a soft brand-gradient wash bleeding out behind the
          poster so it feels like it's taking over the hero, not docked in a
          corner. Purely decorative. */}
      <div
        className="pointer-events-none absolute -inset-5 -z-10 rounded-[2.75rem] bg-gradient-to-br from-coral/30 via-transparent to-sage/30 blur-2xl"
        aria-hidden="true"
      />
      <p className="eyebrow mb-3 text-center md:text-left">
        🀄️ Flavor of the month · {p.season}
      </p>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] border-4 border-white shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={`${p.title} — ${p.tagline}. A Mahjong for the Girls seasonal poster.`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="mt-4 text-center md:text-left">
        <a
          href="/learn#posters"
          className="text-sm font-semibold text-sage-deep underline-offset-4 hover:underline"
        >
          See every seasonal poster →
        </a>
      </div>
    </div>
  );
}
