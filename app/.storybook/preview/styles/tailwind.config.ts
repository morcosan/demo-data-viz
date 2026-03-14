import { type Config } from 'tailwindcss'
import { tailwindTheme } from '../../../../ds/dist/scripts/tailwind'

const ROOT_PATH = '../../..'

const config: Config = {
  content: [
    `${ROOT_PATH}/src/**/*.{ts,tsx,mdx}`, // app + docs
    `${ROOT_PATH}/../ds/{src,docs}/**/*.{ts,tsx,mdx}`, // ds + docs
  ],
  theme: tailwindTheme,
}

export default config
