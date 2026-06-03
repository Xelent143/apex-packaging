import tokens from './design-tokens.json' with { type: 'json' };

export default {
  content: ['./src/**/*.{astro,html,ts,tsx,md,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', md: '2.5rem' }
    },
    extend: {
      colors: {
        neutral: tokens.color.neutral,
        accent: tokens.color.accent,
        success: tokens.color.semantic.success,
        warning: tokens.color.semantic.warning,
        error: tokens.color.semantic.error,
        info: tokens.color.semantic.info
      },
      fontFamily: {
        display: tokens.font.display,
        sans: tokens.font.sans,
        mono: tokens.font.mono
      },
      borderRadius: tokens.radius,
      boxShadow: tokens.shadow,
      maxWidth: {
        narrow: tokens.container.narrow,
        default: tokens.container.default,
        wide: tokens.container.wide
      }
    }
  },
  plugins: []
};
