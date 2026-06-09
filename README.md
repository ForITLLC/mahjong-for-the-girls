# Mahjong for the Girls

A striking single-page launch site for **Mahjong for the Girls** — Caroline Dudeck's
curation of mahjong nights for women in Seattle.

Cool, sexy, aspirational, experience-led. Three things, done well:

1. **The launch experience** — hero, the vibe, what it is, who it's for.
2. **Event calendar** — upcoming mahjong nights, edited from one file.
3. **Contact** — a no-backend form that opens the visitor's mail app.

No auth, no payments, no admin, no database. By design.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with a self-contained brand palette (CSS variables)
- `next/font` for the display + UI typefaces (Fraunces / Jost)
- `output: 'standalone'` — portable to Azure App Service (ForIT convention) or any Node host

> **ForIT note:** This is a single-brand client microsite (same lane as
> `novajet-website`), so it ships its own palette directly rather than pulling
> the `@foritllc/tenant-theme` multi-tenant stack. The "no hardcoded ForIT navy"
> rule is satisfied — there is zero ForIT branding here; the brand is Mahjong for
> the Girls. Built per `for-Common/docs/AI-START-HERE.md` conventions (Next 14,
> TS, standalone output, kebab repo name under the brand).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Editing content

Everything content-facing lives in two files — no code changes needed:

| What | File |
|------|------|
| Site name, city, host, **contact email**, socials | `app/site.config.ts` |
| The event calendar (add / edit / remove nights) | `app/data/events.ts` |

### Adding an event

Append to the `events` array in `app/data/events.ts`:

```ts
{
  id: 'unique-slug',
  title: 'Night name',
  date: '2026-09-05',        // ISO — keeps the calendar sorted
  time: '6:30 PM',
  venue: 'Where',
  neighborhood: 'Seattle neighborhood',
  blurb: 'One or two sexy sentences.',
  status: 'open',            // 'open' | 'waitlist' | 'sold-out'
  level: 'All levels',       // or 'Beginners welcome' | 'Regulars'
}
```

### Contact email — action for Caroline

`app/site.config.ts` → `contactEmail` is currently `hello@mahjongforthegirls.com`.
Point that mailbox at your inbox, or change it to your own address. Both the
contact form and every RSVP button compose a `mailto:` to this address.

## Structure

```
app/
  layout.tsx          fonts, metadata, brand shell
  page.tsx            section composition
  globals.css         brand palette (CSS vars) + components
  site.config.ts      ← edit site-wide copy + contact here
  data/events.ts      ← edit the calendar here
  components/         Nav, Hero, WhatItIs, WhoItsFor, Events, Contact, Footer
```
