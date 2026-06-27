import { site } from '../site.config';

// Decorative tiles rendered as CJK glyphs (winds + dragons). The Unicode
// "mahjong tile" block (U+1F000…) has poor font coverage and shows as broken
// tofu boxes on most browsers, so we use real characters in our tile chips.
const tiles = ['東', '南', '西', '北', '中', '發'];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="absolute right-6 top-28 font-display text-[14rem] leading-none md:right-24">
          馬
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-24 md:pt-36 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow rise">{site.city} · By invitation, never exclusive</p>

          <h1 className="rise mt-6 font-display text-5xl font-light leading-[0.98] tracking-tight sm:text-7xl md:text-8xl">
            Mahjong,
            <br />
            <span className="text-gilt italic">for the girls.</span>
          </h1>

          <p className="rise mt-8 max-w-prose text-lg leading-relaxed text-mist md:text-xl">
            Beautiful nights. Real tables. Your kind of people. We bring the
            tiles, the room, and the women who make a Tuesday feel like
            somewhere you'd want to be — across {site.city}.
          </p>

          <div className="rise mt-10 flex flex-wrap items-center gap-4">
            <a href="#events" className="btn-gold">
              See upcoming nights
            </a>
            <a href="#contact" className="btn-ghost">
              Pull up a chair
            </a>
          </div>

          <div className="rise mt-16 flex items-center gap-3 text-2xl md:text-3xl">
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
        </div>

        {/* the room itself — tables set, the lake beyond the glass */}
        <div className="rise relative">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/photos/tables-view.jpg"
              alt="Mahjong tables set up by floor-to-ceiling windows over the water"
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className="pointer-events-none absolute -bottom-3 -left-3 hidden h-24 w-24 rounded-2xl border border-coral/40 sm:block"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="rule mx-auto max-w-6xl" />
    </section>
  );
}
