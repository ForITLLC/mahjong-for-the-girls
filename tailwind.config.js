/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette for "Mahjong for the Girls" — sampled from the
        // @mahjongforthegirls logo + pool-party poster, defined as CSS vars in
        // app/globals.css so the whole site can be re-themed from one place.
        ink: 'var(--mg-ink)',
        // Signature pool-party palette
        pool: 'var(--mg-pool)',
        'pool-soft': 'var(--mg-pool-soft)',
        'pool-deep': 'var(--mg-pool-deep)',
        magenta: 'var(--mg-magenta)',
        'magenta-deep': 'var(--mg-magenta-deep)',
        coral: 'var(--mg-coral)',
        'coral-deep': 'var(--mg-coral-deep)',
        orange: 'var(--mg-orange)',
        red: 'var(--mg-red)',
        lime: 'var(--mg-lime)',
        'lime-deep': 'var(--mg-lime-deep)',
        gold: 'var(--mg-gold)',
        pink: 'var(--mg-pink)',
        cream: 'var(--mg-cream)',
        'cream-deep': 'var(--mg-cream-deep)',
        // Legacy aliases (kept so existing class names keep resolving)
        sage: 'var(--mg-sage)',
        'sage-deep': 'var(--mg-sage-deep)',
        jade: 'var(--mg-jade)',
        'jade-deep': 'var(--mg-jade-deep)',
        'gold-soft': 'var(--mg-gold-soft)',
        bone: 'var(--mg-bone)',
        rouge: 'var(--mg-rouge)',
        mist: 'var(--mg-mist)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.18em',
      },
      maxWidth: {
        prose: '62ch',
      },
    },
  },
  plugins: [],
};
