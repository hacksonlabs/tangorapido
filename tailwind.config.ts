import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#CE3C3D',
          secondary: '#1F3A5F',
          accent: '#F7B733',
          neutral: '#111827'
        }
      },
      fontSize: {
        base: '1.125rem'
      },
      borderRadius: {
        xl: '1.5rem'
      },
      boxShadow: {
        focus: '0 0 0 4px rgba(206, 60, 61, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
