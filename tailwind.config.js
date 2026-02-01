/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#bef264", // User requested lime
                "noir-black": "#0a0a0a",
                "noir-gray": "#171717",
                "noir-accent": "#bef264",
                "pure-black": "#000000",
                "dark-border": "#1A1A1A",
                "background-light": "#f6f7f8", // from code.html
                "background-dark": "#101922", // from code.html
                background: '#0a0a0a', // tailored to noir-black default
                "accent-green": "#4ade80",
                "dark-gray": "#0a0a0a",
                "input-bg": "#121212",
                surface: '#0f0f0f',
                // Keeping old palette for compatibility
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
                display: ['Plus Jakarta Sans', 'Space Grotesk', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
