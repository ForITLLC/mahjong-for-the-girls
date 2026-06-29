import SeasonalPoster from './SeasonalPoster';
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

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-24 md:pt-36 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow rise">{site.city} · American mahjong 🀄️ for the girls</p>

          <h1 className="rise mt-6 font-display text-5xl font-light leading-[0.98] tracking-tight sm:text-6xl md:text-7xl">
            Mahjong,
            <br />
            <span className="text-rouge italic">for the girls.</span>
          </h1>

          <p className="rise mt-8 max-w-prose text-lg leading-relaxed text-mist md:text-xl">
            Unserious mahjong, seriously good rooms. We bring the tiles, the
            snacks, and the girls — you bring a yes. Phones go down, friends get
            made, and somehow it’s suddenly midnight. ✨
          </p>

          <div className="rise mt-10 flex flex-wrap items-center gap-4">
            <a href="#events" className="btn-gold">
              See the next night
            </a>
            <a href="#contact" className="btn-ghost">
              Save me a seat 🫶
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

        {/* Flavor of the month — the current seasonal poster, sized to lead the
            hero. It's the page's centerpiece; the archive lives on /learn. */}
        <SeasonalPoster />
      </div>
      <div className="rule mx-auto max-w-6xl" />
    </section>
  );
}
