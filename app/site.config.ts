// Single source of truth for site-wide copy & contact details.
// Caroline: change CONTACT_EMAIL to wherever you want inquiries to land.
// It currently points at a branded address — point that mailbox at your inbox,
// or swap in your own email here.

export const site = {
  name: 'Mahjong for the Girls',
  tagline: 'A table is waiting.',
  city: 'Seattle',
  // The contact form opens the visitor's mail app addressed here.
  contactEmail: 'caroli.dudeck@gmail.com',
  instagram: 'https://instagram.com/', // TODO: drop in the real handle
  host: 'Caroline Dudeck',
} as const;

export type Site = typeof site;
