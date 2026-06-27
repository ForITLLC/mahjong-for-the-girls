// CJK glyphs (not U+1F000 mahjong-tile emoji, which render as broken boxes on
// most browsers) shown in our tile chips.
const pillars = [
  {
    tile: '中',
    title: 'The game, properly taught',
    body: "American mahjong, the way your grandmother's friends played and the way Capitol Hill plays now. Come knowing nothing — we'll have you calling tiles by the second round.",
  },
  {
    tile: '發',
    title: 'Rooms worth showing up for',
    body: 'Rooftops at golden hour, back rooms of your favorite café, the occasional living room that feels like a secret. The setting is half the point.',
  },
  {
    tile: '東',
    title: 'A table, not a transaction',
    body: 'No app to download, no leaderboard to climb. Just a standing invitation to sit down, play, and leave with new numbers in your phone.',
  },
];

export default function WhatItIs() {
  return (
    <section id="what" className="mx-auto max-w-6xl px-6 py-24">
      <p className="eyebrow">What it is</p>
      <h2 className="mt-4 max-w-prose font-display text-4xl font-light leading-tight md:text-5xl">
        A mahjong night you'd <span className="italic text-gilt">actually</span>{' '}
        clear your calendar for.
      </h2>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-ink/10 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="bg-white/70 p-8 backdrop-blur-sm transition-colors hover:bg-sage/15"
          >
            <span
              className="tile mb-6 flex h-14 w-12 items-center justify-center text-3xl"
              aria-hidden="true"
            >
              {p.tile}
            </span>
            <h3 className="font-display text-2xl">{p.title}</h3>
            <p className="mt-3 leading-relaxed text-mist">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
