/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./public/script.js",
  ],
  safelist: [
    // Dynamic classes used in script.js via template literals / JS concatenation
    'hidden', 'block', 'flex', 'grid', 'inline', 'inline-flex', 'inline-block',
    'opacity-0', 'opacity-100', 'pointer-events-none', 'pointer-events-auto',
    'translate-x-full', 'translate-y-full', '-translate-x-1/2', '-translate-y-1/2',
    'scale-95', 'scale-100',
    'animate-pulse', 'animate-spin', 'animate-bounce',
    'text-emerald-400', 'text-emerald-500', 'text-red-400', 'text-slate-400', 'text-slate-500',
    'border-emerald-500', 'border-[#EE6C4D]', 'border-slate-700',
    'bg-emerald-500', 'bg-red-500', 'bg-slate-800',
    'line-clamp-2',
    'tool-card-hidden', 'animate-fade-in', 'animate-fade-in-up',
    'zen-mode',
    'open',
    // Gradient text colors
    'from-emerald-400', 'to-teal-600',
    // Hub tool border colors
    'border-t-4', 'border-red-500', 'border-indigo-500', 'border-fuchsia-500',
    'border-cyan-500', 'border-amber-500', 'border-blue-500', 'border-purple-500',
    'border-orange-500', 'border-pink-500', 'border-yellow-500',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EE6C4D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
