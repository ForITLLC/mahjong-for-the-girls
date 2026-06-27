'use client';

// "Express interest" — for someone who wants in but none of the listed nights
// work, or who just wants to be told about the next table. Routes through the
// same on-page contact form as RSVPs (via the 'rsvp-prefill' event), so no email
// address ever ships in the HTML.
export default function ExpressInterest({
  className,
  label = 'Express interest',
}: {
  className?: string;
  label?: string;
}) {
  const onClick = () => {
    window.dispatchEvent(
      new CustomEvent('rsvp-prefill', {
        detail: {
          name: '',
          email: '',
          message:
            "I'd like to join a mahjong table. Put me on the list and let me " +
            'know about upcoming nights — here are days/times that tend to work ' +
            'for me:\n\n',
        },
      })
    );
  };

  return (
    <button type="button" onClick={onClick} className={className ?? 'btn-ghost'}>
      {label}
    </button>
  );
}
