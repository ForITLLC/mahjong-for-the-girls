import { currentPoster } from '../data/posters';
import Poster from './Poster';

// The hero's centerpiece: the current season's poster, composed live by
// <Poster> so it leads the page in the site's own type. The full run of
// seasons lives in the archive on /learn (Goodies).
export default function SeasonalPoster() {
  const p = currentPoster;
  return (
    <div className="rise relative">
      {/* Seasonal glow — a soft brand-gradient wash bleeding out behind the
          poster so it feels like it's taking over the hero, not docked in a
          corner. Purely decorative. */}
      <div
        className="pointer-events-none absolute -inset-5 -z-10 rounded-[2.75rem] bg-gradient-to-br from-coral/30 via-transparent to-sage/30 blur-2xl"
        aria-hidden="true"
      />
      <p className="eyebrow mb-3 text-center md:text-left">
        🀄️ Flavor of the month · {p.season}
      </p>
      <Poster
        poster={p}
        className="rounded-[1.75rem] border-4 border-white shadow-2xl"
      />
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
