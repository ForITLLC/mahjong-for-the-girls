// Single source of truth for site-wide copy & contact details.

export const site = {
  name: 'Mahjong for the Girls',
  tagline: 'A table is waiting.',
  city: 'Seattle',
  // Contact address is base64-encoded and assembled in the browser at runtime
  // (see app/lib/email.ts) so the plaintext never ships in the static HTML —
  // this keeps the inbox off email scrapers. To change it, base64-encode the
  // new address:  printf '%s' 'you@example.com' | base64
  contactEmailB64: 'Y2Fyb2xpLmR1ZGVja0BnbWFpbC5jb20=',
  instagram: 'https://instagram.com/', // TODO: drop in the real handle
  host: 'Caroline Dudeck',
} as const;

export type Site = typeof site;
