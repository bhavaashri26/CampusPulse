/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#FBF8FF',
          border: '#EDE7FA',
          navy: '#2B2A4C',
          muted: '#7A7799',
          lavender: '#7C6BD6',
          lavenderDark: '#6B5AC6',
          lavenderLight: '#E9E4FF',
          lavenderText: '#5B4BB5',
          mint: '#D3F5E5',
          mintText: '#1F7A5A',
          peach: '#FFE6D5',
          peachText: '#B5532B',
          sky: '#DCEEFF',
          skyText: '#2B6CB0',
          rose: '#FFDADA',
          roseText: '#B03A3A',
          pink: '#FFDDEB',
          pinkText: '#A63D6B',
        },
      },
      boxShadow: {
        soft: '0 2px 12px rgba(124, 107, 214, 0.06)',
        'soft-hover': '0 8px 24px rgba(124, 107, 214, 0.12)',
      },
    },
  },
  plugins: [],
};
