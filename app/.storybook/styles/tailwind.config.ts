import { type Config } from 'tailwindcss'
import { tailwindTheme } from '../../../ds/dist/scripts/tailwind'

const config: Config = {
  content: [
    '../../{src}/**/*.{ts,tsx,mdx}', // app + docs
    '../../../ds/{src,docs}/**/*.{ts,tsx,mdx}', // ds + docs
  ],
  theme: tailwindTheme,
}

export default config
