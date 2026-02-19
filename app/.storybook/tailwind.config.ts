import { type Config } from 'tailwindcss'
import { tailwindTheme } from '../../ds/dist/tooling/tailwind'

const config: Config = {
  content: [
    '../{src}/**/*.{ts,tsx,mdx}', // app
    '../../ds/{src,docs}/**/*.{ts,tsx,mdx}', // ds + docs
  ],
  theme: tailwindTheme,
}

export default config
