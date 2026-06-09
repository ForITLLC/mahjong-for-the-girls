import { site } from '../site.config';

const links = [
  { href: '#what', label: 'What it is' },
  { href: '#who', label: "Who it's for" },
  { href: '#events', label: 'Events' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <span className="tile h-8 w-7 text-lg font-display font-semibold">馬</span>
          <span className="font-display text-lg tracking-wide">
            Mahjong <span className="text-mist">for the Girls</span>
          </span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-mist transition-colors hover:text-bone"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a href="#events" className="btn-gold text-sm !px-5 !py-2.5">
          See the calendar
        </a>
      </nav>
    </header>
  );
}
