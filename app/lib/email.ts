import { site } from '../site.config';

// The contact address is stored base64-encoded in site.config and decoded only
// in the browser, so the plaintext address never appears in the statically
// rendered HTML and isn't harvested by email scrapers. During SSG (no window)
// these return empty/"#", and the real value is filled in on the client.
export function contactEmail(): string {
  if (typeof window === 'undefined') return '';
  try {
    return atob(site.contactEmailB64);
  } catch {
    return '';
  }
}

export function buildMailto(subject: string, body: string): string {
  const to = contactEmail();
  if (!to) return '#';
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}`;
}
