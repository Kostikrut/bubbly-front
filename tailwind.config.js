export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern:
        /bg-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        11: "repeat(11, minmax(0, 1fr))",
      },
      height: {
        "screen-minus-header": "[calc(100vh - 4rem)]",
      },
    },
  },
};
