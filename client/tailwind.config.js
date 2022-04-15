const plugin = require("tailwindcss/plugin")

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./comps/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 7s linear infinite',
      },
      plugins: [
        require("tailwindcss-animation-delay"),
        plugin(({ addVariant }) => {
          addVariant("mhover", "@media (hover: hover) { &:hover }")
        })
      ],
    }
  }
}
