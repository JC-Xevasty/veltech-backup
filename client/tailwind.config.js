/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    colors: ({ colors }) => ({
      ...colors,
      primary: "#DE2B2B",
      accent: "#0B2653"
    }),
    fontFamily: ({ fontFamily }) => ({
      ...fontFamily,
      grandview: "Grandview",
      "grandview-bold": "Grandview-Bold",
      inter: "Inter",
      "inter-bold": "Inter-Bold"
    }),
    extend: {
      gridTemplateColumns: {
        15: "repeat(15, minmax(0, 1fr))"

      }
    }
  },
  plugins: [
    require("@tailwindcss/line-clamp")
  ],
}
