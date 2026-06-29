// Seasonal posters — the rotating "flavor of the month" advertisement art for
// Mahjong for the Girls. The poster marked `current` leads the hero; the whole
// list is the archive on /learn (Goodies).
//
// These are composed LIVE: <Poster> lays real site type (Fraunces + Jost, brand
// colors) over a clean, text-free background photo. That's why every poster
// REQUIRES an `image` — the photo is the seasonal flavor; the words, the QR, and
// the layout are the design system, rendered fresh, never baked into a flat JPG.
//
// To add a season:
//   1. drop a clean (text-free) background at public/img/posters/bg/<id>.png
//   2. add the id (and its accent) to scripts/gen-qr.py and run it (mints the
//      branded, decode-verified QR)
//   3. prepend an entry here (newest first) and move `current: true` onto it
//   4. run scripts/export-posters.sh to refresh the shareable JPG

export type Poster = {
  id: string;
  season: string; // short label, e.g. 'Summer 2026'
  title: string; // poster headline
  tagline: string; // the one-liner under the title
  /** REQUIRED clean, text-free background photo the poster composes over. */
  image: string; // /img/posters/bg/<id>.png
  /** Seasonal accent — keys the headline, eyebrow & QR card to the art. */
  accent: string; // hex
  current?: boolean; // the season we're advertising right now
};

export const posters: Poster[] = [
  {
    id: 'summer-2026',
    season: 'Summer 2026',
    title: 'It’s a Mahj Hot Summer',
    tagline: 'Mahjong margaritas, poolside tiles.',
    image: '/img/posters/bg/summer-2026.png',
    accent: '#ec2a8c',
    current: true,
  },
  {
    id: 'disco',
    season: 'Disco Night',
    title: 'Disco Mahj',
    tagline: 'A sparkly mahjong night.',
    image: '/img/posters/bg/disco.png',
    accent: '#ffd24a',
  },
  {
    id: 'wild',
    season: 'Wild Side',
    title: 'Mahj on the Wild Side',
    tagline: 'A walk on the wild side.',
    image: '/img/posters/bg/wild.png',
    accent: '#aee04a',
  },
  {
    id: 'brunch',
    season: 'Rise & Mahj',
    title: 'Rise & Mahj',
    tagline: 'Mimosas + mahjong.',
    image: '/img/posters/bg/brunch.png',
    accent: '#f7a64b',
  },
];

export const currentPoster = posters.find((p) => p.current) ?? posters[0];

// The monthly-attribution QR for a poster. Campaign = the poster id, so every
// season's scans are attributed separately in GA4 — same UTM convention the
// /invite and /card printables use (utm_medium=qr, #events onto the calendar).
export const posterRsvpUrl = (id: string) =>
  `https://mahjongforthegirls.com/?utm_source=poster&utm_medium=qr&utm_campaign=${id}#events`;

// Static branded QR asset, minted & decode-verified by scripts/gen-qr.py.
export const posterQrSrc = (id: string) => `/img/posters/qr/${id}.svg`;

// The shareable, downloadable flat image (1080×1350), exported from <Poster>
// by scripts/export-posters.sh.
export const posterShareSrc = (id: string) => `/img/posters/${id}.jpg`;
