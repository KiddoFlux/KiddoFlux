/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Keep in sync with src/theme/colors.ts
      colors: {
        mint: '#effbf5',
        navy: '#084887',
        peach: '#efa48b',
        ink: '#2d2e2e',
        steel: '#508ca4',
        sage: '#c2cfb2',
      },
      // One font family per weight (never use fontWeight on native).
      fontFamily: {
        regular: ['InterTight_400Regular'],
        sans: ['InterTight_500Medium'],
        bold: ['InterTight_700Bold'],
      },
    },
  },
  plugins: [],
};
