'use client';

// The on-page, print-optimized Beginner's Table Guide. Reads on screen or prints
// to a clean handout (Cmd/Ctrl-P). ALL content here is original wording — the
// rules and facts of American mahjong aren't copyrightable, but we deliberately
// do NOT reproduce any third-party guide's text, layout, or art. Tile art is
// plain Unicode glyphs + our brand chips, so this is ours to give away free.
// The print stylesheet (globals.css, @media print) hides the nav/hero/grid and
// leaves only `.printable-guide`. Each `.guide-page` starts a fresh sheet.

type Tone = 'red' | 'green' | 'ink';

function toneClass(tone: Tone = 'ink') {
  return tone === 'red'
    ? 'text-red'
    : tone === 'green'
    ? 'text-sage-deep'
    : 'text-ink';
}

function Chip({ glyph, sub, tone = 'ink' }: { glyph: string; sub: string; tone?: Tone }) {
  return (
    <span className="flex flex-col items-center gap-1">
      <span
        className={`tile flex h-12 w-10 items-center justify-center font-display text-2xl ${toneClass(
          tone
        )}`}
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

// A compact tile used inside the "hand shapes" diagrams.
function Mini({ children, tone = 'ink' }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={`tile flex h-9 w-7 items-center justify-center font-display text-sm ${toneClass(
        tone
      )}`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function Shape({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex break-inside-avoid flex-col items-center gap-2 rounded-xl border border-ink/10 bg-cream-deep/40 p-3 text-center">
      <div className="flex min-h-[2.25rem] items-end gap-1">{children}</div>
      <div>
        <p className="font-display text-base leading-none text-ink">{label}</p>
        <p className="mt-1 text-[0.62rem] text-mist">{note}</p>
      </div>
    </div>
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

        {/* ---------- PAGE ONE: the tiles & the card ---------- */}
        <div className="guide-page">
          <div className="mb-6 text-center">
            <p className="eyebrow">Part one</p>
            <h3 className="mt-2 font-display text-2xl font-light text-ink">
              Meet the <span className="italic text-gilt">tiles</span>
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-mist">
              A full American set is 152 tiles: three numbered suits, the Winds and
              Dragons, plus Flowers and Jokers. Here&rsquo;s the whole cast.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card icon="萬" title="The three suits">
              <div className="flex flex-wrap gap-5">
                <Chip glyph="筒" sub="Dots" />
                <Chip glyph="條" sub="Bams" tone="green" />
                <Chip glyph="萬" sub="Craks" tone="red" />
              </div>
              <p>
                <strong className="text-ink">Dots</strong> are circles, like coins.{' '}
                <strong className="text-ink">Bams</strong> are bamboo — the 1 Bam is
                drawn as a little bird. <strong className="text-ink">Craks</strong> carry
                the character 萬 (&ldquo;ten thousand&rdquo;). Every suit runs{' '}
                <strong className="text-ink">1 through 9</strong>, with four copies of
                each tile.
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
                <Chip glyph="▢" sub="Soap / 0" />
              </div>
              <p>
                Four <strong className="text-ink">Winds</strong> — North, East, West,
                South — and three <strong className="text-ink">Dragons</strong>: Red
                (pairs with Craks), Green (with Bams), and White, the blank tile called{' '}
                <strong className="text-ink">Soap</strong>, which doubles as a zero.
              </p>
            </Card>

            <Card icon="🌸" title="Flowers &amp; Jokers">
              <div className="flex flex-wrap gap-5">
                <Chip glyph="花" sub="Flower" tone="green" />
                <Chip glyph="春" sub="Season" tone="green" />
                <Chip glyph="★" sub="Joker" tone="red" />
              </div>
              <p>
                Eight <strong className="text-ink">Flowers</strong> are bonus tiles —
                some hands ask for them. <strong className="text-ink">Jokers</strong> are
                wild and can stand in for any tile, but only inside a group of{' '}
                <strong className="text-ink">three or more</strong> identical tiles —
                never in a Single or a Pair.
              </p>
            </Card>

            <Card icon="📖" title="How to read your card">
              <p>
                Each line on the card is one winning hand. The colored numbers
                aren&rsquo;t tile colors — they&rsquo;re a key for{' '}
                <strong className="text-ink">which groups share a suit</strong> and which
                must differ.
              </p>
              <div className="rounded-xl border border-ink/10 bg-cream-deep/50 p-4">
                <p className="font-display text-lg tracking-wide text-ink">
                  FF <span className="text-coral-deep">2025</span>{' '}
                  <span className="text-sage-deep">2222</span>
                </p>
                <p className="mt-1 text-xs">
                  Two Flowers · a run reading 2-0-2-5 in one suit · a Kong of 2s in
                  another.
                </p>
              </div>
              <p className="text-xs">
                Same color = same suit. Different colors = different suits. A Dragon
                follows the suit of its color. Watch the spacing — it tells you where one
                group ends and the next begins.
              </p>
            </Card>
          </div>

          {/* common hand shapes — the building blocks */}
          <Card icon="🀙" title="The building blocks — hand shapes">
            <p>
              Every hand on the card is built from a handful of repeating shapes. Learn
              these seven and you can read any line.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <Shape label="Single" note="1 tile">
                <Mini>5</Mini>
              </Shape>
              <Shape label="Pair" note="2 alike">
                <Mini>5</Mini>
                <Mini>5</Mini>
              </Shape>
              <Shape label="Run" note="sequence">
                <Mini>1</Mini>
                <Mini>2</Mini>
                <Mini>3</Mini>
              </Shape>
              <Shape label="Pung" note="3 alike">
                <Mini>5</Mini>
                <Mini>5</Mini>
                <Mini>5</Mini>
              </Shape>
              <Shape label="Kong" note="4 alike">
                <Mini>5</Mini>
                <Mini>5</Mini>
                <Mini>5</Mini>
                <Mini>5</Mini>
              </Shape>
            </div>
            <p className="text-xs">
              Bigger groups exist too — a <strong className="text-ink">Quint</strong> is
              five alike and a <strong className="text-ink">Sextet</strong> is six,
              usually leaning on a Joker or two. Pairs and Singles never take a Joker.
            </p>
          </Card>

          {/* glossary spans full width */}
          <Card icon="💬" title="Words you&rsquo;ll hear at the table">
            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              <p><strong className="text-ink">East</strong> — the dealer; East opens every hand.</p>
              <p><strong className="text-ink">The Wall</strong> — the stacked tiles everyone builds before play.</p>
              <p><strong className="text-ink">The Card</strong> — the list of winning hands you&rsquo;re trying to make.</p>
              <p><strong className="text-ink">Charleston</strong> — the opening rounds of passing tiles to improve your hand.</p>
              <p><strong className="text-ink">Discard</strong> — the tile you set out, face-up and named, to end your turn.</p>
              <p><strong className="text-ink">Call</strong> — claim the tile someone just discarded to complete a group.</p>
              <p><strong className="text-ink">Pair / Pung / Kong</strong> — two / three / four identical tiles.</p>
              <p><strong className="text-ink">Mahjong!</strong> — what you say when your hand is complete. You win.</p>
              <p><strong className="text-ink">Wall game</strong> — tiles run out with no winner; the hand is a wash.</p>
            </div>
          </Card>
        </div>

        {/* ---------- PAGE TWO: how a game flows ---------- */}
        <div className="guide-page">
          <div className="mb-6 mt-2 text-center">
            <p className="eyebrow">Part two</p>
            <h3 className="mt-2 font-display text-2xl font-light text-ink">
              From shuffle to <span className="italic text-gilt">Mahjong!</span>
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card icon="🧱" title="Setting up">
              <ol className="list-decimal space-y-2 pl-5 marker:text-coral-deep">
                <li><strong className="text-ink">Build the wall.</strong> Shuffle face-down; each player stacks a wall in front of their rack, 19 tiles across and two high.</li>
                <li><strong className="text-ink">Sort as you go.</strong> A tidy rack — Jokers, Flowers, suits grouped with their matching Dragons, then Winds in N-E-W-S order — makes the card far easier to read.</li>
                <li><strong className="text-ink">Pick your target.</strong> Find the line on the card your tiles come closest to, and aim for it. You can change your mind during the Charleston.</li>
              </ol>
            </Card>

            <Card icon="🎲" title="The deal">
              <p>
                East rolls both dice and counts that many stacks in from the right end of
                their own wall — that&rsquo;s where the wall is broken.
              </p>
              <p>
                Starting at the break, East takes the first two stacks (four tiles), the
                next player takes two, and so on around the table until everyone holds
                twelve. East then takes the{' '}
                <strong className="text-ink">1st and 3rd</strong> tiles from the top of
                the next stacks to reach <strong className="text-ink">14</strong>;
                everyone else draws one more for <strong className="text-ink">13</strong>.
              </p>
            </Card>

            <Card icon="↔️" title="The Charleston">
              <p>
                Before play, tiles get passed around to sweeten every hand —{' '}
                <strong className="text-ink">three tiles</strong> at each step.
              </p>
              <p>
                <strong className="text-ink">First Charleston (required):</strong> pass
                right, then across, then left.
              </p>
              <p>
                <strong className="text-ink">Second Charleston (optional):</strong> left,
                across, right — any player may call it off before it starts. The first
                left and the last right may be{' '}
                <strong className="text-ink">blind</strong> passes.
              </p>
              <p>
                Finish with an optional <strong className="text-ink">courtesy pass</strong>{' '}
                of zero to three tiles with the player across from you.
              </p>
            </Card>

            <Card icon="🔄" title="Your turn, around the table">
              <ol className="list-decimal space-y-2 pl-5 marker:text-coral-deep">
                <li><strong className="text-ink">East starts.</strong> East opens play by discarding one tile face-up and naming it.</li>
                <li><strong className="text-ink">Draw, then discard.</strong> On your turn draw the next wall tile, swap for a Joker if you can, then discard one and say its name. Play moves to the right.</li>
                <li><strong className="text-ink">Call a discard.</strong> Need the tile just thrown? Call it before the next draw, expose the group it completes, then discard.</li>
                <li><strong className="text-ink">Win the hand.</strong> Assemble the full 14 tiles of a line on the card and call &ldquo;Mahjong!&rdquo;</li>
              </ol>
            </Card>
          </div>

          <Card icon="✅" title="Quick reminders">
            <ul className="grid gap-2 sm:grid-cols-2">
              <li>🔍 <strong className="text-ink">When in doubt, count.</strong> Confirm a group before you call it.</li>
              <li>⭐ <strong className="text-ink">Jokers need a crowd.</strong> Only inside groups of three or more.</li>
              <li>👀 <strong className="text-ink">Watch the spacing.</strong> On the card it tells you where each group ends.</li>
              <li>↪️ <strong className="text-ink">Walls left, play right.</strong> Turns travel to the right around the table.</li>
            </ul>
          </Card>

          {/* closing CTA band — with the branded QR to scan */}
          <div
            className="mt-8 flex break-inside-avoid flex-col items-center gap-6 rounded-2xl px-8 py-7 text-center text-white sm:flex-row sm:text-left"
            style={{
              background:
                'linear-gradient(120deg, var(--mg-coral) 0%, var(--mg-sage) 100%)',
            }}
          >
            <div className="flex-1">
              <p className="font-display text-2xl italic">A table is waiting.</p>
              <p className="mt-1 text-sm text-white/90">
                Come learn in person — beginners always welcome. Scan to see upcoming
                nights and save your seat.
              </p>
              <p className="mt-2 text-sm font-medium">
                mahjongforthegirls.com · @mahjongforthegirls
              </p>
            </div>
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/qr-events.svg"
                alt="Scan to see upcoming tables and RSVP"
                className="h-28 w-28"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-mist">
            New to the card? The official hands card is published each spring by the{' '}
            <a
              href="https://www.nationalmahjonggleague.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral-deep underline-offset-2 hover:underline"
            >
              National Mah Jongg League
            </a>{' '}
            — proceeds go to charity.
          </p>
        </div>
      </div>
    </section>
  );
}
