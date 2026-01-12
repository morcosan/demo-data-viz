import { type Config } from 'tailwindcss'
import { tailwindTheme } from '../../../ds/dist/tooling/tailwind.ts'

const config: Config = {
	content: [
		'../{src}/**/*.{ts,tsx,mdx}', // app
		'../../ds/{src}/**/*.{ts,tsx,mdx}', // ds
	],
	theme: tailwindTheme,
}

export default config
