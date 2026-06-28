import { site } from '../site.config';

// Decorative tiles rendered as CJK glyphs (winds + dragons). The Unicode
// "mahjong tile" block (U+1F000…) has poor font coverage and shows as broken
// tofu boxes on most browsers, so we use real characters in our tile chips.
const tiles = ['東', '南', '西', '北', '中', '發'];

export default function Hero() {
  // RSVP target: the real Partiful link when set, otherwise the on-page flow.
  const rsvp =
    site.rsvpUrl ||
    '/?utm_source=hero&utm_medium=web&utm_campaign=summer#events';

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Sunlit pool-water backdrop, fading into the cream page below. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/img/pool.jpg)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(13,59,67,0.46) 0%, rgba(13,59,67,0.30) 42%, rgba(251,245,233,0.92) 88%, var(--mg-cream) 100%)',
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-28 md:pt-36 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="rise text-sm font-bold uppercase tracking-[0.18em] text-lime drop-shadow-[0_1px_6px_rgba(13,59,67,0.6)]">
            Presented by {site.presentedBy} · {site.city} 🀄️
          </p>

          <h1
            className="rise mt-4 font-display text-5xl font-semibold leading-[0.92] tracking-tight text-white sm:text-7xl md:text-8xl"
            style={{ textShadow: '0 3px 18px rgba(13,59,67,0.5)' }}
          >
            It’s a Mahj
            <br />
            <span className="text-gilt italic">Hot Summer.</span>
          </h1>

          <p
            className="rise mt-5 font-display text-2xl italic text-white sm:text-3xl"
            style={{ textShadow: '0 2px 14px rgba(13,59,67,0.55)' }}
          >
            Mahjong Margarita 🍋🌶️
          </p>

          <p className="rise mt-6 max-w-prose text-lg leading-relaxed text-ink/90 md:text-xl">
            Come to <strong className="font-semibold">Round 2!</strong> We’ll
            refresh the basics from last time and level up to the 2026 mahjong
            card. Completely unserious, but ridiculously fun. ✨
          </p>

          <div className="rise mt-8 flex flex-wrap items-center gap-4">
            <a href={rsvp} className="btn-gold text-base">
              RSVP · {site.price} 🍹
            </a>
            <a href="#events" className="btn-ghost bg-white/70 backdrop-blur-sm">
              See the details
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

        {/* The poster itself — pool water, the bubble title, a margarita. */}
        <div className="rise relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.75rem] border-4 border-white shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/pool.jpg"
              alt="It’s a Mahj Hot Summer — Mahjong Margarita, Seattle"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              className="absolute inset-0"
              style={{ background: 'rgba(13,59,67,0.16)' }}
              aria-hidden="true"
            />
            <div className="relative flex h-full flex-col items-center justify-center gap-2.5 px-6 text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-lime">
                Presented by {site.presentedBy}
              </p>
              <p className="text-3xl" aria-hidden="true">
                🌶️
              </p>
              <h2
                className="font-display text-3xl font-bold leading-[0.9] text-[#f47a2f] sm:text-4xl"
                style={{ WebkitTextStroke: '1.5px #ffffff' }}
              >
                IT’S A MAHJ HOT SUMMER
              </h2>
              <p className="font-display text-xl italic text-white">
                Mahjong Margarita
              </p>
              <p className="text-2xl" aria-hidden="true">
                🍋🍹
              </p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-white">
                Mahjong for the Girls
              </p>
              <span className="rounded-full bg-white/95 px-4 py-1 text-sm font-bold text-[#e23b2e]">
                {site.price} · RSVP on Partiful
              </span>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white">
                {site.city}
              </p>
            </div>
          </div>
          <span
            className="pointer-events-none absolute -bottom-3 -left-3 hidden h-24 w-24 rounded-2xl border border-coral/50 sm:block"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="rule mx-auto max-w-6xl" />
    </section>
  );
}
