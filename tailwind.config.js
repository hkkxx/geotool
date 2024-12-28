/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/nested/page2.html",
        "./src/nested/about.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{html,js}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

