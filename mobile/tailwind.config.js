/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    // Custom fonts on native need one family per weight, so the weight utilities
    // are removed: `font-bold` selects the family and never sets fontWeight.
    fontWeight: {},
    extend: {
      // Keep in sync with src/theme/colors.ts.
      colors: {
        mint: '#effbf5',
        navy: '#084887',
        peach: '#efa48b',
        ink: '#2d2e2e',
        steel: '#508ca4',
        sage: '#c2cfb2',
      },
      fontFamily: {
        regular: ['InterTight_400Regular'],
        sans: ['InterTight_500Medium'],
        bold: ['InterTight_700Bold'],
      },
    },
  },
  plugins: [],
};
