'use client';

import { useEffect, useState } from 'react';
import { events, type MahjongEvent } from '../data/events';
import { buildMailto } from '../lib/email';

// Partiful-style RSVP. Mounted once on the page; opens when any RsvpButton
// dispatches an 'open-rsvp' event with the event id. The visitor picks a
// response (Going / Maybe / Can't), bumps a guest count, leaves a first name,
// and we route the whole thing to Caroline by mail. Her address is decoded
// client-side (app/lib/email.ts) so it never ships in the static HTML.

type Choice = 'going' | 'maybe' | 'cant';

const CHOICES: {
  key: Choice;
  emoji: string;
  label: string;
  // ring/fill when selected
  on: string;
}[] = [
  { key: 'going', emoji: '🎉', label: "I'm going", on: 'border-sage bg-sage/15 text-sage-deep' },
  { key: 'maybe', emoji: '🤔', label: 'Maybe', on: 'border-coral-deep bg-coral/20 text-coral-deep' },
  { key: 'cant', emoji: '🫶', label: "Can't make it", on: 'border-red bg-red/10 text-red' },
];

const CONFIRM: Record<Choice, { emoji: string; head: string; sub: string }> = {
  going: { emoji: '🎉', head: "You're in!", sub: 'A seat is being saved. See you at the table.' },
  maybe: { emoji: '🤞', head: 'Penciled in.', sub: "We'll hold a maybe-chair and hope you make it." },
  cant: { emoji: '💛', head: 'Next time!', sub: "We'll keep you posted on the next night." },
};

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function Rsvp() {
  const [ev, setEv] = useState<MahjongEvent | null>(null);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [guests, setGuests] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState<Choice | null>(null);

  const close = () => setEv(null);

  // Open on the custom event; reset the form each time.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<{ eventId?: string }>).detail?.eventId;
      const found = events.find((x) => x.id === id) ?? null;
      if (!found) return;
      setEv(found);
      setChoice(null);
      setGuests(0);
      setName('');
      setEmail('');
      setSent(null);
    };
    window.addEventListener('open-rsvp', onOpen);
    return () => window.removeEventListener('open-rsvp', onOpen);
  }, []);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!ev) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [ev]);

  if (!ev) return null;

  const waitlist = ev.status === 'waitlist';
  const partySize = guests + 1;
  const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
  const canSend = !!choice && name.trim().length > 0 && emailOk;

  const send = () => {
    if (!canSend || !choice) return;
    const label =
      choice === 'going' ? 'Going' : choice === 'maybe' ? 'Maybe' : "Can't make it";
    const head = waitlist ? 'Waitlist RSVP' : 'RSVP';
    const subject = `${head} · ${label} · ${ev.title}`;
    const partyLine =
      choice === 'cant'
        ? ''
        : `\nParty size: ${partySize} (${guests === 0 ? 'just me' : `me + ${guests}`})`;
    const body =
      `${head} for "${ev.title}"\n` +
      `${fmtDate(ev.date)} · ${ev.time}\n` +
      `${ev.venue}, ${ev.neighborhood}\n\n` +
      `Name: ${name}\n` +
      `Response: ${label}${partyLine}\n` +
      `Reply to: ${email.trim()}\n`;
    const href = buildMailto(subject, body);
    if (href !== '#') window.location.href = href;
    setSent(choice);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`RSVP to ${ev.title}`}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close RSVP"
        onClick={close}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />

      {/* card */}
      <div className="pop relative w-full max-w-md overflow-hidden rounded-3xl border border-ink/10 bg-cream shadow-2xl">
        {/* festive header band */}
        <div
          className="relative px-6 pb-5 pt-6"
          style={{
            background:
              'linear-gradient(135deg, var(--mg-coral) 0%, var(--mg-sage) 100%)',
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/30 text-white transition hover:bg-white/50"
          >
            ✕
          </button>
          <p className="text-xs uppercase tracking-[0.28em] text-white/85">
            {waitlist ? 'Join the waitlist' : "You're invited"}
          </p>
          <h3 className="mt-2 font-display text-2xl leading-tight text-white">
            {ev.title}
          </h3>
          <p className="mt-1 text-sm text-white/90">
            {fmtDate(ev.date)} · {ev.time}
          </p>
          <p className="text-sm text-white/80">
            {ev.venue} · {ev.neighborhood}
          </p>
        </div>

        {sent ? (
          <div className="px-6 py-10 text-center">
            <div className="pop text-5xl">{CONFIRM[sent].emoji}</div>
            <h4 className="mt-4 font-display text-2xl text-ink">
              {CONFIRM[sent].head}
            </h4>
            <p className="mx-auto mt-2 max-w-xs text-sm text-mist">
              {CONFIRM[sent].sub}
            </p>
            <p className="mt-4 text-xs text-mist">
              Your mail app opened with the RSVP — hit send to lock it in.
              We’ll confirm to{' '}
              <span className="text-ink">{email.trim() || 'your inbox'}</span>.
            </p>
            <button
              type="button"
              onClick={close}
              className="btn-gold mt-6 justify-center"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-6 py-6">
            {/* choices */}
            <p className="mb-3 text-sm font-medium text-ink">Will we see you?</p>
            <div className="grid grid-cols-3 gap-2">
              {CHOICES.map((c) => {
                const active = choice === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setChoice(c.key)}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 text-xs font-semibold transition ${
                      active
                        ? c.on
                        : 'border-ink/10 bg-white/70 text-mist hover:border-ink/25'
                    }`}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* guest stepper */}
            {choice && choice !== 'cant' && (
              <div className="pop mt-5 flex items-center justify-between rounded-2xl border border-ink/10 bg-white/70 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">Bringing anyone?</p>
                  <p className="text-xs text-mist">
                    {guests === 0 ? 'Just me' : `Me + ${guests}`} ·{' '}
                    {partySize} {partySize === 1 ? 'seat' : 'seats'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="One fewer guest"
                    onClick={() => setGuests((g) => Math.max(0, g - 1))}
                    disabled={guests === 0}
                    className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-lg text-ink transition hover:bg-ink/5 disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-display text-lg text-ink">
                    {guests}
                  </span>
                  <button
                    type="button"
                    aria-label="One more guest"
                    onClick={() => setGuests((g) => Math.min(5, g + 1))}
                    disabled={guests === 5}
                    className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-lg text-ink transition hover:bg-ink/5 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* name */}
            <div className="mt-5">
              <label htmlFor="rsvp-name" className="mb-1 block text-sm text-mist">
                Your name
              </label>
              <input
                id="rsvp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name is plenty"
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral-deep"
              />
            </div>

            {/* email — so Caroline can send a confirmation back */}
            <div className="mt-4">
              <label htmlFor="rsvp-email" className="mb-1 block text-sm text-mist">
                Email <span className="text-coral-deep">·</span> for your confirmation
              </label>
              <input
                id="rsvp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-invalid={email.length > 0 && !emailOk}
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral-deep"
              />
              {email.length > 0 && !emailOk && (
                <p className="mt-1 text-xs text-red">
                  That doesn’t look like an email yet.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={send}
              disabled={!canSend}
              className="btn-gold mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
            >
              {choice === 'cant' ? 'Send my regrets' : 'Send RSVP'}
            </button>
            <p className="mt-3 text-center text-xs text-mist">
              Opens your mail app to Caroline — she’ll confirm to your inbox.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
