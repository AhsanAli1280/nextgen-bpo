import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#39B54A',
          blue: '#3F6FB6',
          dark: '#0F172A',
          gray: '#64748B',
          light: '#F8FAFC',
          border: '#E2E8F0', // ← This enables 'border-brand-border'
        },
        // Compliance Platform — WHT design language (DESIGN_SYSTEM_ALIGNMENT_REPORT).
        // 6px button / 8px card radius via Tailwind defaults (rounded-md / rounded-lg).
        cs: {
          green: '#39B54A',        // primary accent (shared brand)
          'green-dark': '#2E9B3E', // hover
          'green-light': '#EBF8EC',// tint
          surface: '#F9FAFB',
          'surface-mid': '#F3F4F6',
          border: '#E5E7EB',
          'border-dark': '#D1D5DB',
          ink: '#111827',          // text-primary
          'ink-2': '#374151',      // text-secondary
          muted: '#6B7280',        // text-muted
          subtle: '#9CA3AF',       // text-subtle
        },
        // Obligation status. due-soon = amber (NEW token per UI_BUILD_PRIORITY).
        status: {
          overdue: '#DC2626',
          'due-soon': '#D97706',
          upcoming: '#64748B',
          filed: '#39B54A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        brand: '0 8px 30px -8px rgba(63, 111, 182, 0.25)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'cs-card': '0 1px 3px rgba(0,0,0,0.07)',
        'cs-card-hover': '0 4px 12px rgba(0,0,0,0.10)',
        'cs-focus': '0 0 0 3px rgba(57,181,74,0.15)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 18s ease infinite',
        float: 'float 8s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;