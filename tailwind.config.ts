import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-inter)', 'Inter', 'sans-serif'] },
      colors: {
        navy: { DEFAULT: '#0f172a', 2: '#1e293b', 3: '#334155' },
      },
    },
  },
  plugins: [],
}
export default config
