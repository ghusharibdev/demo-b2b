/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F2',
        header: '#FFFFFF',
        surface: '#FFFFFF',
        ink: '#1C1A1A',
        body: '#55504D',
        muted: '#8A8580',
        line: '#EDE0D4',
        primary: {
          DEFAULT: '#7A1E2E',
          hover: '#5E1623',
        },
        gold: {
          DEFAULT: '#C9A24B',
          soft: '#FBF2E1',
        },
        warm: '#FBF3EA',
        footer: '#2B1A1A',
        'header-border': '#F0E2D6',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: [
          '"Inter Variable"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
        serif: [
          '"Playfair Display Variable"',
          '"Playfair Display"',
          'ui-serif',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'serif',
        ],
      },
      boxShadow: {
        card: '0 18px 45px -30px rgba(43, 26, 26, 0.18)',
        float: '0 14px 32px -12px rgba(43, 26, 26, 0.28)',
      },
    },
  },
};
