
import type { Config } from "tailwindcss";

/** Keeps the hex in CSS and still allows bg-token/50 utilities. */
const exact =
  (variable: string) =>
  ({ opacityValue }: { opacityValue?: string | number }) => {
    if (opacityValue === undefined) return `var(${variable})`;
    const numeric = typeof opacityValue === "number" ? opacityValue : Number(opacityValue);
    const amount = Number.isFinite(numeric) ? `${numeric * 100}%` : `calc(${opacityValue} * 100%)`;
    return `color-mix(in srgb, var(${variable}) ${amount}, transparent)`;
  };

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'playfair': ['DM Sans', 'Inter', 'sans-serif'],
				'display': ['DM Sans', 'Inter', 'sans-serif'],
			},
			colors: {
				border: exact("--border"),
				input: exact("--input"),
				ring: exact("--ring"),
				background: exact("--background"),
				foreground: exact("--foreground"),
				primary: {
					DEFAULT: exact("--primary"),
					foreground: exact("--primary-foreground"),
					dark: exact("--primary-dark"),
					'dark-foreground': exact("--primary-dark-foreground"),
				},
				secondary: {
					DEFAULT: exact("--secondary"),
					foreground: exact("--secondary-foreground"),
				},
				destructive: {
					DEFAULT: exact("--destructive"),
					foreground: exact("--destructive-foreground"),
				},
				muted: {
					DEFAULT: exact("--muted"),
					foreground: exact("--muted-foreground"),
				},
				accent: {
					DEFAULT: exact("--accent"),
					foreground: exact("--accent-foreground"),
				},
				popover: {
					DEFAULT: exact("--popover"),
					foreground: exact("--popover-foreground"),
				},
				card: {
					DEFAULT: exact("--card"),
					foreground: exact("--card-foreground"),
				},
				sidebar: {
					DEFAULT: exact("--sidebar-background"),
					foreground: exact("--sidebar-foreground"),
					primary: exact("--sidebar-primary"),
					"primary-foreground": exact("--sidebar-primary-foreground"),
					accent: exact("--sidebar-accent"),
					"accent-foreground": exact("--sidebar-accent-foreground"),
					border: exact("--sidebar-border"),
					ring: exact("--sidebar-ring"),
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
