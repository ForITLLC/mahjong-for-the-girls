import { site } from '../site.config';
import { currentPoster } from '../data/posters';

// Decorative tiles rendered as CJK glyphs (winds + dragons). The Unicode
// "mahjong tile" block (U+1F000…) has poor font coverage and shows as broken
// tofu boxes on most browsers, so we use real characters in our tile chips.
const tiles = ['東', '南', '西', '北', '中', '發'];

// The hero IS the season's poster. The current "flavor of the month" art runs
// full-bleed as the page's top element, with the brand line laid over it and
// the season's own headline riding as a kicker. The portrait, QR-bearing
// *printable* version of this same design lives on /poster/[id] and in the
// /learn archive — the hero is the on-site expression, the poster the shareable.
export default function Hero() {
  const p = currentPoster;
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[82vh] items-center overflow-hidden"
    >
      {/* full-bleed seasonal photo — the flavor of the month */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* legibility scrim — darkest where the type sits (left), letting the
          photo breathe on the right and fade up from the bottom */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, rgba(20,28,24,0.88) 0%, rgba(20,28,24,0.68) 38%, rgba(20,28,24,0.32) 70%, rgba(20,28,24,0.14) 100%), linear-gradient(180deg, rgba(20,28,24,0.28) 0%, rgba(20,28,24,0.08) 46%, rgba(20,28,24,0.52) 100%)',
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-28">
        <div className="max-w-2xl">
          <p className="rise text-[0.72rem] uppercase tracking-[0.32em] text-cream/85">
            {site.city} · American mahjong 🀄️ for the girls
          </p>

          {/* seasonal kicker — the flavor of the month, keyed to the art */}
          <p
            className="rise mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur-sm"
            style={{ color: p.accent }}
          >
            🀄️ Flavor of the month · {p.season}
          </p>

          <h1 className="rise mt-6 font-display text-5xl font-light leading-[0.98] tracking-tight text-cream drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl">
            Mahjong,
            <br />
            <span className="text-rouge italic">for the girls.</span>
          </h1>

          {/* the season's own headline + tagline, riding under the brand line */}
          <p className="rise mt-5 font-display text-2xl italic leading-snug text-cream/95 drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)] md:text-3xl">
            <span style={{ color: p.accent }}>{p.title}.</span> {p.tagline}
          </p>

          <p className="rise mt-6 max-w-prose text-lg leading-relaxed text-cream/85">
            Unserious mahjong, seriously good rooms. We bring the tiles, the
            snacks, and the girls — you bring a yes. Phones go down, friends get
            made, and somehow it’s suddenly midnight. ✨
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-4">
            <a href="#events" className="btn-gold">
              See the next night
            </a>
            {/* light ghost — built from utilities (not .btn-ghost, which is keyed
                to a light background) so it reads over the photo */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/45 px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-white/10"
            >
              Save me a seat 🫶
            </a>
          </div>

          <div className="rise mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-3 text-2xl md:text-3xl">
              {tiles.map((t, i) => (
                <span
                  key={i}
                  className="tile h-12 w-10 md:h-14 md:w-11"
                  aria-hidden="true"
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href={`/poster/${p.id}/`}
              className="text-sm font-semibold text-cream/90 underline-offset-4 hover:underline"
            >
              Pin up this month’s poster →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
