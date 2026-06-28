'use client';

import { useState } from 'react';
import { site } from '../site.config';
import InstagramIcon from './InstagramIcon';

// Route-absolute so they resolve from any page (e.g. /learn), not just home.
const links = [
  { href: '/#what', label: 'What it is' },
  { href: '/#who', label: "Who it's for" },
  { href: '/#gallery', label: 'Photos' },
  { href: '/#events', label: 'Events' },
  { href: '/learn', label: 'Goodies' },
  { href: '/#contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/#top" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="tile h-8 w-7 text-lg font-display font-semibold">馬</span>
          <span className="font-display text-lg tracking-wide">
            Mahjong <span className="text-mist">for the Girls</span>
          </span>
        </a>

        {/* desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-mist transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Mahjong for the Girls on Instagram (${site.instagramHandle})`}
            title={site.instagramHandle}
            className="text-sage-deep transition-colors hover:text-coral-deep"
          >
            <InstagramIcon />
          </a>
          <a href="/#events" className="btn-gold hidden text-sm !px-5 !py-2.5 md:inline-flex">
            See the calendar
          </a>

          {/* mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ink/5 md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* mobile dropdown panel */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-ink/10 bg-cream/95 backdrop-blur-md md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink/5 py-3 text-base text-mist transition-colors last:border-0 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/#events"
              onClick={() => setOpen(false)}
              className="btn-gold mt-4 justify-center text-sm"
            >
              See the calendar
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
