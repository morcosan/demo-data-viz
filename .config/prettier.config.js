/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 120,
  singleQuote: true,
  semi: false,

  // Format SVG
  overrides: [{ files: '*.svg?(r)', options: { parser: 'html' } }],

  // Plugins
  plugins: ['prettier-plugin-css-order', 'prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],

  // Plugin: css-order
  cssDeclarationSorterOrder: 'concentric-css',
  cssDeclarationSorterCustomOrder: [],
  cssDeclarationSorterKeepOverrides: false,

  // Plugin: tailwindcss
  // tailwindConfig: './tailwind.config.ts',
  tailwindFunctions: ['clsx', 'cx'],
}

export default config
