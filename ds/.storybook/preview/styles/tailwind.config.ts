import { type Config } from 'tailwindcss'
import { tailwindTheme } from '../../../dist/scripts/tailwind.ts'

const config: Config = {
  content: [
    '../../../{src,docs}/**/*.{ts,tsx,mdx}', // ds + docs
  ],
  theme: tailwindTheme,
}

export default config
