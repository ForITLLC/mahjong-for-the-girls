const lines = [
  'Just moved to Seattle and looking for your people? Hi, it’s us. 👋',
  'Already obsessed with the game and want more nights to play it? Same. 🀄️',
  'A friend group that needs a ritual that isn’t another dinner reservation.',
  'Done waiting around for someone else to plan the fun? Be the someone.',
];

export default function WhoItsFor() {
  return (
    <section id="who" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="eyebrow">Who it’s for</p>
            <h2 className="mt-4 font-display text-4xl font-light leading-tight md:text-5xl">
              If you’ve read this far,
              <br />
              <span className="italic text-gilt">it’s for you.</span> 💖
            </h2>
            <p className="mt-6 max-w-prose leading-relaxed text-mist">
              Mahjong for the Girls is girls-first and warmth-first — every
              level, every neighborhood, every kind of week. You don’t need a
              partner, a deck, or a single clue. Just a yes.
            </p>
          </div>

          <ul className="space-y-4">
            {lines.map((l) => (
              <li
                key={l}
                className="flex items-start gap-4 rounded-xl border border-ink/10 bg-white/60 p-5 leading-relaxed"
              >
                <span className="mt-0.5 text-coral-deep" aria-hidden="true">
                  ◆
                </span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rule mx-auto max-w-6xl" />
    </section>
  );
}
