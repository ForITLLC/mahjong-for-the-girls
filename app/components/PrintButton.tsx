'use client';

// Tiny client island so otherwise-static pages (invite, card) can offer a
// "print this" affordance without becoming client components themselves.
export default function PrintButton({
  className = 'btn-ghost text-sm',
  label = 'Print this',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {label}
    </button>
  );
}
