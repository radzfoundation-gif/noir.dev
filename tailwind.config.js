/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#a3e635", // Neon Green to match localhost
                "background-light": "#f6f7f8", // from code.html
                "background-dark": "#101922", // from code.html
                background: '#000000',
                surface: '#0f0f0f',
                // Keeping old palette for compatibility if needed, but primary is overridden
                lime: {
                    DEFAULT: '#a3e635', // Lime 400
                    hover: '#84cc16',   // Lime 500
                },
                secondary: {
                    DEFAULT: '#3f3f46', // Zinc 700
                    hover: '#27272a',   // Zinc 800
                    foreground: '#ffffff',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
