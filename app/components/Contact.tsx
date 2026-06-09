'use client';

import { useState } from 'react';
import { site } from '../site.config';

// No backend: the form composes a mailto: and hands off to the visitor's
// mail client. Caroline gets a real email; we get zero infrastructure.
export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const mailto = () => {
    const subject = encodeURIComponent(`Hello from ${name || 'a future regular'}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? `\nReply to: ${email}` : ''}`
    );
    return `mailto:${site.contactEmail}?subject=${subject}&body=${body}`;
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
            <p className="mt-6 text-sm text-mist">
              Prefer email?{' '}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-gold-soft underline-offset-4 hover:underline"
              >
                {site.contactEmail}
              </a>
            </p>
          </div>

          <form
            className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = mailto();
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
                className="w-full rounded-lg border border-white/15 bg-ink/60 px-4 py-3 text-bone outline-none transition-colors focus:border-gold"
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
                className="w-full rounded-lg border border-white/15 bg-ink/60 px-4 py-3 text-bone outline-none transition-colors focus:border-gold"
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
                className="w-full resize-none rounded-lg border border-white/15 bg-ink/60 px-4 py-3 text-bone outline-none transition-colors focus:border-gold"
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
