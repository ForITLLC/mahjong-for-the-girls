import { currentPoster } from '../data/posters';

// The hero's contained "Flavor of the Month" slot. It features the current
// seasonal poster — our rotating advertisement art — without taking over the
// page's stable look. The full run of seasons lives in the archive on /learn.
export default function SeasonalPoster() {
  const p = currentPoster;
  return (
    <div className="rise">
      <p className="eyebrow mb-3 text-center md:text-left">
        🀄️ Flavor of the month · {p.season}
      </p>
      {/* Inner wrapper hugs the poster only, so the decorative corner square
          tracks the image edge instead of floating below the whole stack. */}
      <div className="relative mx-auto w-full max-w-sm">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] border-4 border-white shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={`${p.title} — ${p.tagline}. A Mahjong for the Girls seasonal poster.`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <span
          className="pointer-events-none absolute -bottom-3 -left-3 hidden h-24 w-24 rounded-2xl border border-coral/40 sm:block"
          aria-hidden="true"
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
