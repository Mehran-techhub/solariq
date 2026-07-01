/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy cryp tokens (kept for internal app compatibility)
        cryp: {
          bg: '#0A0F1C',
          card: '#111827',
          border: 'rgba(255,255,255,0.08)',
          lime: '#BCFE2E',
          limeDim: '#8BC34A',
          muted: '#94A3B8',
        },
        // SolarIQ Design System
        solar: {
          bg: '#020B14',
          bgAlt: '#060F1A',
          card: '#0C1829',
          cardHover: '#0F1F33',
          border: 'rgba(14,165,233,0.12)',
          borderAlt: 'rgba(15,118,110,0.18)',
          // Primary: Deep Emerald Green
          green: '#0F766E',
          greenLight: '#14B8A6',
          greenDim: '#0D6B64',
          // Secondary: Sky Blue
          blue: '#0EA5E9',
          blueLight: '#38BDF8',
          blueDim: '#0284C7',
          // Accent: Solar Gold
          gold: '#F59E0B',
          goldLight: '#FCD34D',
          goldDim: '#D97706',
          // Text
          text: '#F1F5F9',
          textMuted: '#94A3B8',
          textDim: '#64748B',
          // Borders
          softBorder: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Manrope', 'sans-serif'],
        // Legacy
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        // Legacy
        'hero-glow': 'radial-gradient(ellipse at top, rgba(188,254,46,0.15), transparent 60%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
        // SolarIQ
        'solar-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14,165,233,0.18), transparent), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(15,118,110,0.12), transparent)',
        'solar-glow-green': 'radial-gradient(ellipse at center, rgba(15,118,110,0.25), transparent 70%)',
        'solar-glow-blue': 'radial-gradient(ellipse at center, rgba(14,165,233,0.2), transparent 70%)',
        'solar-card': 'linear-gradient(135deg, rgba(14,165,233,0.05) 0%, rgba(15,118,110,0.03) 100%)',
        'solar-cta': 'linear-gradient(135deg, #0F766E 0%, #0EA5E9 100%)',
        'solar-badge': 'linear-gradient(90deg, rgba(15,118,110,0.15), rgba(14,165,233,0.1))',
      },
      boxShadow: {
        // Legacy
        lime: '0 0 40px rgba(188,254,46,0.25)',
        card: '0 8px 32px rgba(0,0,0,0.4)',
        // SolarIQ
        'solar-green': '0 0 30px rgba(15,118,110,0.3)',
        'solar-blue': '0 0 30px rgba(14,165,233,0.25)',
        'solar-gold': '0 0 25px rgba(245,158,11,0.3)',
        'solar-card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(14,165,233,0.08) inset',
        'solar-card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(14,165,233,0.15) inset',
        'solar-btn': '0 4px 20px rgba(15,118,110,0.4)',
        'solar-btn-blue': '0 4px 20px rgba(14,165,233,0.35)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'orbit': 'orbit 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
};
