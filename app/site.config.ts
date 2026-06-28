// Single source of truth for site-wide copy & contact details.

export const site = {
  name: 'Mahjong for the Girls',
  tagline: 'It’s a mahj hot summer.',
  city: 'Seattle',
  // The featured event right now: the summer "Mahjong Margarita" party.
  presentedBy: '@mahjongforgirls',
  price: '$35',
  // Where the RSVP buttons point. When blank, they fall back to the on-page
  // RSVP flow (#events). Drop the real Partiful event URL here to send RSVPs
  // straight to Partiful instead.
  rsvpUrl: '',
  // Contact address is base64-encoded and assembled in the browser at runtime
  // (see app/lib/email.ts) so the plaintext never ships in the static HTML —
  // this keeps the inbox off email scrapers. To change it, base64-encode the
  // new address:  printf '%s' 'you@example.com' | base64
  contactEmailB64: 'Y2Fyb2xpLmR1ZGVja0BnbWFpbC5jb20=',
  instagram: 'https://www.instagram.com/mahjongforthegirls',
  instagramHandle: '@mahjongforthegirls',
  host: 'Caroline Dudeck',
  // Google Analytics 4 measurement ID (Admin → Data streams → Web).
  gaMeasurementId: 'G-3XVM3VXBSE',
} as const;

export type Site = typeof site;
