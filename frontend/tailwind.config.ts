import colors from 'tailwindcss/colors';
import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: 'class',
  theme: {
    extend: {
      // https://vercel.com/design/color
      colors: {
        'custom-gray': '#f0f4f8',
        gray: colors.zinc,
        'gray-1000': 'rgb(17,17,19)',
        'gray-1100': 'rgb(10,10,11)',
        vercel: {
          pink: '#FF0080',
          blue: '#0070F3',
          cyan: '#50E3C2',
          orange: '#F5A623',
          violet: '#7928CA',
        },
        primary: {
          50: '#F3FFC7',
          100: '#E6FF95',
          200: '#CFFF4C',
          300: '#BBF625',
          400: '#9CDD06',
          500: '#78B103',
          600: '#5A8604',
          700: '#49690B',
          800: '#3D590F',
          900: '#1F3101',
        },
        secondary: {
          100: '#F0F0F0',
          300: '#D7D7D7',
          500: '#909090',
          700: '#595959',
          900: '#1B1B1B',
        },
        warning: '#DC2626',
      },
      fontFamily: {
        // Combine both Chinese + English fonts
        'noto-inter': ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
      backgroundImage: ({ theme }) => ({
        'vc-border-gradient': `radial-gradient(at left top, ${theme(
          'colors.gray.500',
        )}, 50px, ${theme('colors.gray.800')} 50%)`,
      }),
      keyframes: ({ theme }) => ({
        rerender: {
          '0%': {
            ['border-color']: theme('colors.vercel.pink'),
          },
          '40%': {
            ['border-color']: theme('colors.vercel.pink'),
          },
        },
        highlight: {
          '0%': {
            background: theme('colors.vercel.pink'),
            color: theme('colors.white'),
          },
          '40%': {
            background: theme('colors.vercel.pink'),
            color: theme('colors.white'),
          },
        },
        loading: {
          '0%': {
            opacity: '.2',
          },
          '20%': {
            opacity: '1',
            transform: 'translateX(1px)',
          },
          to: {
            opacity: '.2',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        translateXReset: {
          '100%': {
            transform: 'translateX(0)',
          },
        },
        fadeToTransparent: {
          '0%': {
            opacity: '1',
          },
          '40%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),

    plugin(function ({ addUtilities }) {
      // Typography utilities
      const typographySizes = {
        // Heading 1 - Large titles
        '.text-h1': {
          '@apply font-noto-inter font-black text-[36px] leading-[48px] tracking-[-0.012em] text-left':
            {},
          'text-underline-position': 'from-font',
          'text-decoration-skip-ink': 'none',
        },
        // Heading 2 - Section headers
        '.text-h2': {
          '@apply font-noto-inter font-medium text-[30px] leading-[36px] tracking-[-0.0075em] text-left':
            {},
          'text-underline-position': 'from-font',
          'text-decoration-skip-ink': 'none',
        },
        '.text-large-content': {
          '@apply font-noto-inter font-normal text-[18px] leading-[32px] text-left':
            {},
          'text-underline-position': 'from-font',
          'text-decoration-skip-ink': 'none',
        },
        // Paragraph - Main content text
        '.text-p': {
          '@apply font-noto-inter font-normal text-[16px] leading-[32px] text-left':
            {},
          'text-underline-position': 'from-font',
          'text-decoration-skip-ink': 'none',
        },
        // Small - Supporting text
        '.text-small': {
          '@apply font-noto-inter font-normal text-[14px] leading-[24px] text-left':
            {},
          'text-underline-position': 'from-font',
          'text-decoration-skip-ink': 'none',
        },
        // Subtle - Secondary information
        '.text-subtle': {
          '@apply font-noto-inter font-normal text-[14px] leading-[20px] text-left':
            {},
          'text-underline-position': 'from-font',
          'text-decoration-skip-ink': 'none',
        },
      };

      const typographyColors = {
        '.text-primary': {
          color: '#000000', // 100%
        },
        '.text-secondary': {
          color: 'rgba(0,0,0,0.7)', // 70%
        },
        '.text-tertiary': {
          color: 'rgba(0,0,0,0.35)', // 35%
        },
      };

      addUtilities({
        ...typographySizes,
        ...typographyColors,
      });
    }),
  ],
} satisfies Config;
