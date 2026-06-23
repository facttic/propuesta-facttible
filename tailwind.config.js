/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // FACTTIC: fondo carbón, acento naranja, secundario teal
        bg: '#222222',
        surface: 'rgba(255, 255, 255, 0.035)',
        'surface-elevated': 'rgba(255, 255, 255, 0.06)',
        accent: '#ff5229',
        'accent-bright': '#ff6f4a',
        'accent-glow': 'rgba(255, 82, 41, 0.12)',
        'accent-dim': 'rgba(255, 82, 41, 0.4)',
        secondary: '#57c3c8',
        'secondary-glow': 'rgba(87, 195, 200, 0.12)',
        success: '#57c3c8',
        'text-primary': '#f2f2f2',
        'text-secondary': '#b8b8b8',
        'text-muted': '#8a8a8a',
        border: 'rgba(255, 255, 255, 0.12)',
        'border-accent': 'rgba(255, 82, 41, 0.45)',
        // paleta secundaria de marca (ilustraciones / acentos puntuales)
        'brand-lila': '#d6bbf2',
        'brand-lima': '#e6f17d',
        'brand-crimson': '#ce3a4c',
        'brand-oliva': '#8c8400',
        'brand-azul': '#0242de',
      },
      backgroundImage: {
        'grid-accent':
          'linear-gradient(rgba(255,82,41,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,82,41,0.04) 1px, transparent 1px)',
      },
      animation: {
        'glow': 'glow 10s ease-in-out infinite',
        'scroll-dot': 'scroll-dot 2s ease-in-out infinite',
        'twinkle': 'twinkle 1.8s ease-in-out infinite',
        'halo-pulse': 'halo-pulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.7', transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1.08)' },
        },
        'scroll-dot': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(10px)', opacity: '0.3' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.4) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(45deg)' },
        },
        'halo-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.12)' },
        },
      },
      fontFamily: {
        // cuerpo en monospace (firma visual de FACTTIC); títulos en grotesque
        sans: ['"Space Mono"', 'ui-monospace', 'monospace'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
