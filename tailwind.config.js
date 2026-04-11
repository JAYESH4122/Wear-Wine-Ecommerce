/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/collections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-next-bricolage)', 'sans-serif'],
        anton: ['var(--font-next-anton)', 'sans-serif'],
        sans: ['var(--font-next-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
