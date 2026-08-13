/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        garden: {
          light: '#86efac',
          DEFAULT: '#10b981',
          dark: '#064e3b',
          glow: 'rgba(16, 185, 129, 0.4)',
        },
        military: {
          light: '#93c5fd',
          DEFAULT: '#3b82f6',
          dark: '#1e3a8a',
          tactical: '#0284c7',
          glow: 'rgba(59, 130, 246, 0.4)',
        },
        town: {
          light: '#fcd34d',
          DEFAULT: '#f59e0b',
          dark: '#78350f',
          glow: 'rgba(245, 158, 11, 0.4)',
        },
        space: {
          light: '#c084fc',
          DEFAULT: '#8b5cf6',
          dark: '#2e1065',
          glow: 'rgba(139, 92, 246, 0.4)',
        },
        arcane: {
          light: '#f472b6',
          DEFAULT: '#ec4899',
          dark: '#831843',
          glow: 'rgba(236, 72, 153, 0.4)',
        },
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'grow': 'grow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 4px currentColor)' },
          '100%': { filter: 'drop-shadow(0 0 14px currentColor)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        grow: {
          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
