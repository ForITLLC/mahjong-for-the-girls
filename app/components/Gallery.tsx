// Real photos from Caroline's tables — the room, the spread, the women. Shot on
// location; auto-oriented and web-sized in public/img/photos. A simple, slightly
// irregular grid so it reads as a scrapbook, not a stock sheet.

const photos: { src: string; alt: string; span?: string }[] = [
  {
    src: '/img/photos/tables-set.jpg',
    alt: 'Folding tables set with colorful racks, the lake and hills beyond the glass',
    span: 'sm:col-span-2 sm:row-span-2',
  },
  { src: '/img/photos/spread.jpg', alt: 'A long marble island laid with a generous spread of food' },
  { src: '/img/photos/playing-window.jpg', alt: 'Women playing mahjong at a table by the windows' },
  { src: '/img/photos/charcuterie.jpg', alt: 'A charcuterie board on the kitchen island' },
  { src: '/img/photos/playing-room.jpg', alt: 'The room mid-game, tables full' },
  {
    src: '/img/photos/table-life.jpg',
    alt: 'A lively table of players mid-hand',
    span: 'sm:col-span-2',
  },
  { src: '/img/photos/room-view.jpg', alt: 'The living room and island with sweeping water views' },
];

export default function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">From the table</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight md:text-5xl">
            A real <span className="italic text-gilt">night.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-mist">
          Good light, a long spread, and a room full of women playing. This is
          what an afternoon at the table actually looks like.
        </p>
      </div>

      <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4">
        {photos.map((p) => (
          <figure
            key={p.src}
            className={`group relative overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm ${
              p.span ?? ''
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
