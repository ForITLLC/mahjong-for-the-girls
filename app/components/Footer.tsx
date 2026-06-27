import { site } from '../site.config';
import InstagramIcon from './InstagramIcon';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-mist md:flex-row">
        <div className="flex items-center gap-3">
          <span className="tile h-7 w-6 text-base font-display" aria-hidden="true">
            馬
          </span>
          <span className="font-display text-base text-ink">{site.name}</span>
        </div>
        <p className="order-3 md:order-2">
          Curated in {site.city} by {site.host}. {site.tagline}
        </p>
        <div className="order-2 flex items-center gap-5 md:order-3">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Mahjong for the Girls on Instagram (${site.instagramHandle})`}
            className="flex items-center gap-2 text-sage-deep transition-colors hover:text-coral-deep"
          >
            <InstagramIcon className="h-4 w-4" />
            <span>{site.instagramHandle}</span>
          </a>
          <a
            href="/learn"
            className="text-sage-deep underline-offset-4 hover:underline"
          >
            Free printables
          </a>
          <a
            href="/#contact"
            className="text-coral-deep underline-offset-4 hover:underline"
          >
            Get in touch
          </a>
        </div>
      </div>
    </footer>
  );
}
