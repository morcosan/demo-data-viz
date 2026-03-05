import { type Config } from 'tailwindcss'
import { tailwindTheme } from '../../../ds/dist/scripts/tailwind'

const config: Config = {
  content: [
    '../{src}/**/*.{ts,tsx}', // app
    '../../ds/{src}/**/*.{ts,tsx}', // ds
  ],
  theme: tailwindTheme,
}

export default config
