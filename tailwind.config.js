/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette for "Mahjong for the Girls" — sampled from the
        // @mahjongforthegirls Instagram profile pic, defined as CSS vars in
        // app/globals.css so the whole site can be re-themed from one place.
        ink: 'var(--mg-ink)',
        // New palette names (sage / coral / red / cream)
        sage: 'var(--mg-sage)',
        'sage-deep': 'var(--mg-sage-deep)',
        coral: 'var(--mg-coral)',
        'coral-deep': 'var(--mg-coral-deep)',
        red: 'var(--mg-red)',
        cream: 'var(--mg-cream)',
        'cream-deep': 'var(--mg-cream-deep)',
        // Legacy aliases (kept so existing class names keep resolving)
        jade: 'var(--mg-jade)',
        'jade-deep': 'var(--mg-jade-deep)',
        gold: 'var(--mg-gold)',
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
