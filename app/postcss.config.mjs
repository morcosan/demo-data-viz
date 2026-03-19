// Bug: Next.js cannot load PostCSS config from package.json
const config = {
  plugins: {
    'postcss-url': { url: 'rebase' },
    '@tailwindcss/postcss': {},
  },
}

export default config
