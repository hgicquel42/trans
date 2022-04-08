const plugin = require("tailwindcss/plugin")

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./comps/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("mhover", "@media (hover: hover) { &:hover }")
    })
  ],
}
