/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            fontFamily: {
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                brand: {
                    DEFAULT: '#7C3AED',
                    light: '#A78BFA',
                    dark: '#5B21B6',
                },
                accent: {
                    pink: '#F472B6',
                    blue: '#00D4FF',
                    purple: '#8B5CF6',
                },
                surface: {
                    DEFAULT: 'rgba(255,255,255,0.05)',
                    hover: 'rgba(255,255,255,0.08)',
                    border: 'rgba(255,255,255,0.1)',
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glowPulse: {
                    '0%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(124,58,237,0.6)' },
                },
            },
        },
    },
    plugins: [],
};
