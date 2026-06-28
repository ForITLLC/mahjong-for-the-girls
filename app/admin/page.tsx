import type { Metadata } from 'next';
import AdminApp from './AdminApp';

export const metadata: Metadata = {
  title: 'Admin · Mahjong for the Girls',
  robots: { index: false, follow: false },
};

// The whole admin area is gated by Azure SWA before this page is even served
// (staticwebapp.config.json → /admin/* requires the `editor` role). This page
// is just the static shell; AdminApp hydrates client-side, confirms identity
// via /.auth/me, and talks to the /api backend.
export default function AdminPage() {
  return <AdminApp />;
}
