'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '../site.config';
import { buildMailto } from '../lib/email';

// No backend: the form composes a mailto: and hands off to the visitor's
// mail client. Caroline gets a real email; we get zero infrastructure. The
// address itself is assembled client-side (app/lib/email.ts) so it never
// appears in the static HTML — and we never render a visible link to it.
// Event RSVPs (Rsvp.tsx) funnel here too: they dispatch 'rsvp-prefill', we
// fill the fields and scroll the form into view, then the visitor hits Send.
export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Catch RSVPs handed off from the modal and prefill the form.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<{ name?: string; email?: string; message?: string }>)
        .detail;
      if (!d) return;
      if (d.name) setName(d.name);
      if (d.email) setEmail(d.email);
      if (d.message) setMessage(d.message);
      // Let the modal's confirmation show first, then bring the form into view.
      window.setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    };
    window.addEventListener('rsvp-prefill', onPrefill);
    return () => window.removeEventListener('rsvp-prefill', onPrefill);
  }, []);

  const mailto = () => {
    const subject = `Hello from ${name || 'a future regular'}`;
    const body = `${message}\n\n— ${name}${email ? `\nReply to: ${email}` : ''}`;
    return buildMailto(subject, body);
  };

  const go = (href: string) => {
    if (href !== '#') window.location.href = href;
  };

  return (
    <section id="contact" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 font-display text-4xl font-light leading-tight md:text-5xl">
              Pull up a <span className="italic text-gilt">chair.</span>
            </h2>
            <p className="mt-6 max-w-prose leading-relaxed text-mist">
              Want in on the next night, hosting a table of your own, or just
              curious? Say hello. {site.host} reads every note.
            </p>
          </div>

          <form
            ref={formRef}
            className="space-y-4 rounded-2xl border border-ink/10 bg-white/70 p-7 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              go(mailto());
            }}
          >
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-mist">
                Your name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral-deep"
                placeholder="First name is plenty"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-mist">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral-deep"
                placeholder="so we can write back"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm text-mist">
                Message
              </label>
              <textarea
                id="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral-deep"
                placeholder="Tell us a little about you, or which night caught your eye."
              />
            </div>
            <button type="submit" className="btn-gold w-full justify-center">
              Send it
            </button>
            <p className="text-center text-xs text-mist">
              Opens your mail app — nothing is stored here.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
