// Bug: Next.js cannot load PostCSS config from package.json
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
