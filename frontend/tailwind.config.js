export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // Eco-themed colors
        eco: {
          forest: '#0B6E4F',
          desert: '#E3B23C',
          ocean: '#1A7CA0',
          cerrado: '#D9923B',
          freshwater: '#5ABFDD',
          leaf: '#0FFF95',
          earth: '#5E4C3E',
          sky: '#A9DEF9'
        },
        nature: {
          50: '#f4f7f0',
          100: '#e4ecd7',
          200: '#ccdeb5',
          300: '#b1cc8e',
          400: '#97bc6c',
          500: '#78a046',
          600: '#5d8137',
          700: '#46632c',
          800: '#374e26',
          900: '#2e4022',
          950: '#1a2513',
        },
        earth: {
          50: '#f9f6f3',
          100: '#f1e9e3',
          200: '#e3d4c9',
          300: '#d3b8a7',
          400: '#c29a81',
          500: '#b58368',
          600: '#a6725a',
          700: '#8a604d',
          800: '#734f43',
          900: '#604239',
          950: '#342118',
        },
        water: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        leaf: {
          50: '#effef2',
          100: '#d9fddf',
          200: '#b5f9c3',
          300: '#7df09a',
          400: '#41e168',
          500: '#19c845',
          600: '#0fa337',
          700: '#10822e',
          800: '#116528',
          900: '#0e5423',
          950: '#042f12',
        },
        soil: {
          50: '#f8f4ee',
          100: '#eee4d6',
          200: '#e0c9af',
          300: '#d1aa83',
          400: '#c38c5e',
          500: '#b77543',
          600: '#a86239',
          700: '#8c4f32',
          800: '#724029',
          900: '#5e3725',
          950: '#331b12',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        'neo': '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff',
        'neo-inner': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
        'eco': '0 0 20px rgba(120, 160, 70, 0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'leaf-fall': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' },
          '25%': { opacity: '1' },
          '100%': { transform: 'translateY(40px) rotate(90deg)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'badge-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'leaf-fall': 'leaf-fall 10s linear infinite',
        'shimmer': 'shimmer 3s infinite linear',
        'scale-up': 'scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'badge-pulse': 'badge-pulse 2s ease-in-out infinite',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
        'display': ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'nature-pattern': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCA1bDUgNSA1LTUgNSA1IDUt')",
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))',
        'eco-gradient': 'linear-gradient(135deg, rgba(120, 160, 70, 0.1), rgba(70, 99, 44, 0.05))',
        'water-gradient': 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(3, 105, 161, 0.05))',
      },
      backdropFilter: {
        'glass': 'blur(10px) saturate(180%)',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
}
