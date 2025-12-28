/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        'cyber-blue': '#00f3ff',
        'neon-pink': '#ff0055',
      },
      fontFamily: {
        'orbitron': ['var(--font-orbitron)', 'sans-serif'],
        'share-tech-mono': ['var(--font-share-tech-mono)', 'monospace'],
      },
      boxShadow: {
        'cyber-glow': '0 0 15px #00f3ff',
      },
    },
  },
  plugins: [],
}
export default config
