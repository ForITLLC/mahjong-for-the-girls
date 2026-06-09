const lines = [
  'The newcomer who just moved to Seattle and wants a real table to sit at.',
  'The regular who already loves the game and wants more nights to play it.',
  'The friend group looking for a ritual that isn’t another dinner reservation.',
  'The woman who’s done waiting for someone else to organize the fun.',
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
              <span className="italic text-gilt">it’s for you.</span>
            </h2>
            <p className="mt-6 max-w-prose leading-relaxed text-mist">
              Mahjong for the Girls is women-first and warmth-first. Every
              level, every neighborhood, every kind of week. You don’t need a
              partner, a deck, or a clue — just a yes.
            </p>
          </div>

          <ul className="space-y-4">
            {lines.map((l) => (
              <li
                key={l}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 leading-relaxed"
              >
                <span className="mt-0.5 text-gold" aria-hidden="true">
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
