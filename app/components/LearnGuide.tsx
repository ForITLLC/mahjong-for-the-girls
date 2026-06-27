'use client';

// The on-page, print-optimized Beginner's Table Guide. Mirrors the downloadable
// PDF but lives in the page so anyone can read it on screen or hit "Print" for a
// clean two-page handout. All content is original — rules and facts aren't
// copyrightable, and the tile art is plain Unicode glyphs + brand chips, so this
// is ours to give away for free. The print stylesheet (globals.css, @media print)
// hides the nav/hero/downloads and leaves only `.printable-guide`.

type Tile = { glyph: string; sub: string; tone?: 'red' | 'green' | 'ink' };

function Chip({ glyph, sub, tone = 'ink' }: Tile) {
  const color =
    tone === 'red' ? 'text-red' : tone === 'green' ? 'text-sage-deep' : 'text-ink';
  return (
    <span className="flex flex-col items-center gap-1">
      <span
        className={`tile flex h-12 w-10 items-center justify-center font-display text-2xl ${color}`}
        aria-hidden="true"
      >
        {glyph}
      </span>
      <span className="text-[0.62rem] uppercase tracking-[0.12em] text-mist">
        {sub}
      </span>
    </span>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="break-inside-avoid rounded-2xl border border-ink/10 bg-white/70 p-6">
      <h3 className="flex items-center gap-2 font-display text-xl text-ink">
        <span aria-hidden="true">{icon}</span>
        {title}
      </h3>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-mist">
        {children}
      </div>
    </div>
  );
}

export default function LearnGuide() {
  return (
    <section className="printable-guide mx-auto max-w-5xl px-6 pb-24">
      <div className="rounded-3xl border border-ink/10 bg-white/50 p-8 md:p-12">
        {/* print toolbar — itself hidden when printing */}
        <div className="no-print mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow">Read it here</p>
            <h2 className="mt-2 font-display text-3xl font-light text-ink">
              The Beginner&rsquo;s <span className="italic text-gilt">Table Guide</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-gold whitespace-nowrap text-sm"
          >
            Print this guide
          </button>
        </div>

        {/* ---------- PAGE ONE: the tiles ---------- */}
        <div className="guide-page">
          <div className="grid gap-6 md:grid-cols-2">
            <Card icon="萬" title="The tiles — three suits">
              <div className="flex flex-wrap gap-5">
                <Chip glyph="筒" sub="Dots" />
                <Chip glyph="條" sub="Bams" />
                <Chip glyph="萬" sub="Craks" tone="red" />
              </div>
              <p>
                <strong className="text-ink">Dots</strong> are circles (think coins),{' '}
                <strong className="text-ink">Bams</strong> are bamboo sticks (the 1 is a
                little bird), and <strong className="text-ink">Craks</strong> are
                characters — &ldquo;crak&rdquo; is 萬, meaning 10,000. Each suit runs 1
                through 9, four of every tile.
              </p>
            </Card>

            <Card icon="東" title="Winds &amp; Dragons">
              <div className="flex flex-wrap gap-4">
                <Chip glyph="東" sub="East" />
                <Chip glyph="南" sub="South" />
                <Chip glyph="西" sub="West" />
                <Chip glyph="北" sub="North" />
                <Chip glyph="中" sub="Red" tone="red" />
                <Chip glyph="發" sub="Green" tone="green" />
                <Chip glyph="□" sub="Soap / 0" />
              </div>
              <p>
                Four <strong className="text-ink">Winds</strong> (N-E-W-S) and three{' '}
                <strong className="text-ink">Dragons</strong> — Red, Green, and White
                (the blank &ldquo;Soap,&rdquo; which also plays as a zero). A Dragon
                belongs to its own color&rsquo;s suit.
              </p>
            </Card>

            <Card icon="🌸" title="Flowers &amp; Jokers">
              <div className="flex flex-wrap gap-5">
                <Chip glyph="花" sub="Flower" tone="green" />
                <Chip glyph="春" sub="Season" tone="green" />
                <Chip glyph="★" sub="Joker" tone="red" />
              </div>
              <p>
                <strong className="text-ink">Flowers</strong> are bonus tiles — eight in
                the set. <strong className="text-ink">Jokers</strong> are wild and stand
                in for any tile inside a group of{' '}
                <strong className="text-ink">three or more</strong> identical tiles. No
                Jokers in a Single or a Pair.
              </p>
            </Card>

            <Card icon="📖" title="How to read your card">
              <p>
                Each line on the card is one winning hand. The{' '}
                <strong className="text-ink">colors</strong> aren&rsquo;t tile colors —
                they map which groups must be the{' '}
                <strong className="text-ink">same suit</strong> and which must be{' '}
                <strong className="text-ink">different</strong>.
              </p>
              <div className="rounded-xl border border-ink/10 bg-cream-deep/50 p-4">
                <p className="font-display text-lg tracking-wide text-ink">
                  FF <span className="text-coral-deep">2025</span>{' '}
                  <span className="text-sage-deep">2222</span>
                </p>
                <p className="mt-1 text-xs">
                  Flowers · a run in one suit · a Pung in another.
                </p>
              </div>
              <p className="text-xs">
                Same color = same suit. Different colors = different suits.
                &ldquo;X&rdquo; means concealed; watch the parentheses — they group the
                tiles.
              </p>
            </Card>
          </div>

          {/* glossary spans full width */}
          <Card icon="💬" title="Words you&rsquo;ll hear at the table">
            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              <p><strong className="text-ink">The Wall</strong> — the stacked tiles everyone builds before play.</p>
              <p><strong className="text-ink">The Card</strong> — the list of winning hands you&rsquo;re trying to make.</p>
              <p><strong className="text-ink">Charleston</strong> — the opening rounds of passing tiles to improve your hand.</p>
              <p><strong className="text-ink">Pair / Pung / Kong</strong> — two / three / four identical tiles.</p>
              <p><strong className="text-ink">Quint / Sextet</strong> — five / six identical (Jokers help).</p>
              <p><strong className="text-ink">Call</strong> — claim someone&rsquo;s discard to complete part of your hand.</p>
              <p><strong className="text-ink">Mahjong!</strong> — what you say when your hand is complete. You win.</p>
              <p><strong className="text-ink">Wall game</strong> — tiles run out with no winner; it&rsquo;s a wash.</p>
            </div>
          </Card>
        </div>

        {/* ---------- PAGE TWO: how a game flows ---------- */}
        <div className="guide-page">
          <div className="mb-6 mt-2 text-center">
            <p className="eyebrow">How a game flows</p>
            <h3 className="mt-2 font-display text-2xl font-light text-ink">
              From shuffle to <span className="italic text-gilt">Mahjong!</span>
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card icon="🧱" title="Setting up">
              <ol className="list-decimal space-y-2 pl-5 marker:text-coral-deep">
                <li><strong className="text-ink">Build the wall.</strong> Shuffle face-down; each player builds a wall of 19 tiles across, two high.</li>
                <li><strong className="text-ink">Deal the tiles.</strong> East deals — East takes 14 tiles, everyone else 13.</li>
                <li><strong className="text-ink">Sort your rack.</strong> Jokers, Flowers, suits with matching Dragons, then Winds in N-E-W-S order.</li>
                <li><strong className="text-ink">Pick your hand.</strong> Find the line on the card your tiles come closest to. That&rsquo;s your target.</li>
              </ol>
            </Card>

            <Card icon="↔️" title="The Charleston">
              <p>Three rounds of passing <strong className="text-ink">three tiles</strong> each, to sweeten everyone&rsquo;s hand before play.</p>
              <p><strong className="text-ink">1st Charleston — required.</strong> Pass right, then across, then left. (The last left pass can be a blind pass.)</p>
              <p><strong className="text-ink">2nd Charleston — optional.</strong> Left, across, right — any player may stop it. Finish with a courtesy pass of 0–3 tiles with the player across from you.</p>
            </Card>

            <Card icon="🔄" title="Your turn, around the table">
              <ol className="list-decimal space-y-2 pl-5 marker:text-coral-deep">
                <li><strong className="text-ink">East starts.</strong> East discards her 14th tile to open play, naming it out loud.</li>
                <li><strong className="text-ink">Draw, rack, discard.</strong> On your turn draw from the wall, optionally make a Joker exchange, then discard one tile face-up — say its name.</li>
                <li><strong className="text-ink">Call a discard.</strong> Need the tile just discarded? Call it, expose the group it completes, then discard.</li>
                <li><strong className="text-ink">Win the hand.</strong> Complete the 14 tiles of a hand on your card and call &ldquo;Mahjong!&rdquo;</li>
              </ol>
            </Card>

            <Card icon="✅" title="Quick reminders">
              <ul className="space-y-2">
                <li>🔍 <strong className="text-ink">When in doubt, count.</strong> Verify a group before you call it.</li>
                <li>⭐ <strong className="text-ink">Jokers need a crowd.</strong> Only inside groups of three or more.</li>
                <li>( ) <strong className="text-ink">Parentheses matter.</strong> On the card they group tiles — read carefully.</li>
                <li>↪️ <strong className="text-ink">Walls left, play right.</strong> Turns move to the right around the table.</li>
              </ul>
            </Card>
          </div>

          {/* closing CTA band */}
          <div
            className="mt-8 break-inside-avoid rounded-2xl px-8 py-7 text-center text-white"
            style={{
              background:
                'linear-gradient(120deg, var(--mg-coral) 0%, var(--mg-sage) 100%)',
            }}
          >
            <p className="font-display text-2xl italic">A table is waiting.</p>
            <p className="mt-1 text-sm text-white/90">
              Come learn in person — beginners always welcome. Pick a night &amp; save
              your seat at <strong>mahjongforthegirls.com</strong>.
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-mist">
            New to the card? Pick one up at{' '}
            <a
              href="https://www.nationalmahjonggleague.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral-deep underline-offset-2 hover:underline"
            >
              nationalmahjonggleague.org
            </a>{' '}
            — proceeds go to charity. · @mahjongforthegirls
          </p>
        </div>
      </div>
    </section>
  );
}
