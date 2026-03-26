import type { Config } from 'tailwindcss'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { fontFamily } = require('tailwindcss/defaultTheme')

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        display: ['var(--font-dm-serif)', ...fontFamily.serif],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          400: '#6b8ef7',
          500: '#4f6ef3',
          600: '#3b55e8',
          700: '#2d43cc',
          900: '#1a2680',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
