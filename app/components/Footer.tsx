import { site } from '../site.config';

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-mist md:flex-row">
        <div className="flex items-center gap-3">
          <span className="tile h-7 w-6 text-base font-display" aria-hidden="true">
            馬
          </span>
          <span className="font-display text-base text-bone">{site.name}</span>
        </div>
        <p className="order-3 md:order-2">
          Curated in {site.city} by {site.host}. {site.tagline}
        </p>
        <a
          href={`mailto:${site.contactEmail}`}
          className="order-2 text-gold-soft underline-offset-4 hover:underline md:order-3"
        >
          {site.contactEmail}
        </a>
      </div>
    </footer>
  );
}
