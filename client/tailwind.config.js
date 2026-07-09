/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12100E',
        surface: '#1C1916',
        raised: '#262119',
        paper: '#F0E6D8',
        'text-primary': '#F5EFE6',
        'text-muted': '#9A9082',
        copper: {
          DEFAULT: '#C16B3E',
          deep: '#8F4E2C',
          soft: '#DDA47A',
        },
        border: {
          subtle: '#2E2820',
          copper: '#C16B3E',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        copper: '0 8px 30px -8px rgba(193, 107, 62, 0.45)',
        'copper-lg': '0 20px 60px -12px rgba(193, 107, 62, 0.35)',
      },
      transitionTimingFunction: {
        confident: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
