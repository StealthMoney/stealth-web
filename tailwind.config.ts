import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
            },
            colors: {
                "alt-orange": {
                    100: "#F7931A",
                    200: "#FDE9D1",
                    300: "#FCDBB3",
                    400: "#FBC98C",
                    500: "#FAB766",
                    600: "#F8A540",
                    700: "#CE7B16",
                    800: "#A56211",
                    900: "#7C4A0D",
                    1000: "#523109",
                    1100: "#311D05"
                },
                orange: {
                    100: "#FF710A",
                    200: "#FFE3CE",
                    300: "#FFD0AD",
                    400: "#FFB884",
                    500: "#FFA05C",
                    600: "#FF8933",
                    700: "#D45E08",
                    800: "#AA4B07",
                    900: "#803905",
                    1000: "#552603",
                    1100: "#F7931A",
                    1200: "#FCDAB0"
                },
                white: {
                    100: "#FFFFFF",
                    200: "#D4D4D4",
                    300: "#AAAAAA",
                    400: "#808080",
                    500: "#555555",
                    600: "#333333",
                    700: "#494949"
                },
                black: {
                    100: "#010101",
                    200: "#CCCCCC",
                    300: "#AAAAAA",
                    400: "#808080",
                    500: "#565656",
                    600: "#2B2B2B",
                    700: "#0E0E0E"
                },
                red: {
                    100: "#B31919",
                    200: "#F0D1D1",
                    300: "#E6B2B2",
                    400: "#D98C8C",
                    500: "#CC6666",
                    600: "#C03F3F",
                    700: "#951515",
                    800: "#771111",
                    900: "#5A0D0D",
                    1000: "#3C0808",
                    1100: "#240505",
                    1200: "#F6C0C0"
                },
                green: {
                    100: "#199B2E",
                    200: "#D1EBD5",
                    300: "#B2DEB9",
                    400: "#8CCD96",
                    500: "#66BC74",
                    600: "#3FAC51",
                    700: "#158126",
                    800: "#11671F",
                    900: "#0D4E17",
                    1000: "#08340F",
                    1100: "#051F09",
                    1200: "#B9F4C2"
                }
            }
        }
    },
    plugins: []
}
export default config
