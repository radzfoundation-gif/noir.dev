/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#000000',
                surface: '#0f0f0f',
                primary: {
                    DEFAULT: '#a3e635', // Lime 400
                    hover: '#84cc16',   // Lime 500
                    foreground: '#000000',
                },
                secondary: {
                    DEFAULT: '#3f3f46', // Zinc 700
                    hover: '#27272a',   // Zinc 800
                    foreground: '#ffffff',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
