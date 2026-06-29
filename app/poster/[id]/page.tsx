import type { Metadata } from 'next';
import Poster from '../../components/Poster';
import { posters } from '../../data/posters';

// A full-bleed permalink for each seasonal poster, composed live by <Poster> at
// exactly 1080×1350. Doubles as the render target for the shareable flat image:
// scripts/export-posters.sh points headless Chrome at /poster/<id>/ and saves
// the screenshot to public/img/posters/<id>.jpg.
export const dynamicParams = false;

export function generateStaticParams() {
  return posters.map((p) => ({ id: p.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const p = posters.find((x) => x.id === params.id);
  const title = p ? `${p.title} — Mahjong for the Girls` : 'Mahjong for the Girls';
  return { title, description: p?.tagline };
}

export default function PosterPermalink({
  params,
}: {
  params: { id: string };
}) {
  const p = posters.find((x) => x.id === params.id) ?? posters[0];
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream">
      <div className="w-full max-w-[1080px]">
        <Poster poster={p} />
      </div>
    </main>
  );
}
