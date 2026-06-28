// Seasonal posters — the rotating "flavor of the month" advertisement art for
// Mahjong for the Girls. The poster marked `current` is featured in the hero;
// the whole list is the archive shown on /learn (Goodies). To add a season:
// render the art to public/img/posters/<id>.jpg (portrait, 1080×1350), prepend
// an entry here (newest first), and move `current: true` onto it.

export type Poster = {
  id: string;
  season: string; // short label, e.g. 'Summer 2026'
  title: string; // poster headline
  tagline: string; // the one-liner under the title
  image: string; // /img/posters/<id>.jpg
  current?: boolean; // the season we're advertising right now
};

export const posters: Poster[] = [
  {
    id: 'summer-2026',
    season: 'Summer 2026',
    title: 'It’s a Mahj Hot Summer',
    tagline: 'Mahjong Margarita',
    image: '/img/posters/summer-2026.jpg',
    current: true,
  },
  {
    id: 'disco',
    season: 'Disco Night',
    title: 'Disco Mahj',
    tagline: 'A sparkly mahjong night',
    image: '/img/posters/disco.jpg',
  },
  {
    id: 'wild',
    season: 'Wild Side',
    title: 'Mahj on the Wild Side',
    tagline: 'A wild mahjong night',
    image: '/img/posters/wild.jpg',
  },
  {
    id: 'brunch',
    season: 'Rise & Mahj',
    title: 'Rise & Mahj',
    tagline: 'Mimosas + mahjong',
    image: '/img/posters/brunch.jpg',
  },
];

export const currentPoster = posters.find((p) => p.current) ?? posters[0];
