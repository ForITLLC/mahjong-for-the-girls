import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'No access',
  robots: { index: false, follow: false },
};

// Shown (via a 403 rewrite in staticwebapp.config.json) when someone signs in
// with a Microsoft account that has not been granted the `editor` role.
export default function NoAccess() {
  return (
    <main className="bg-field flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="tile mb-6 grid h-14 w-12 place-items-center font-display text-2xl">
        馬
      </span>
      <h1 className="font-display text-3xl font-light text-ink">Not on the list — yet</h1>
      <p className="mt-3 max-w-md text-mist">
        You&rsquo;re signed in, but this admin area is invite-only. Ask Caroline to send
        you an editor invitation, then sign in again.
      </p>
      <div className="mt-8 flex gap-3">
        <a href="/logout" className="btn-ghost text-sm">
          Sign out
        </a>
        <a href="/" className="btn-gold text-sm">
          Back to the site
        </a>
      </div>
    </main>
  );
}
