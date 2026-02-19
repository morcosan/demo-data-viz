import { CSS_PREFIX, type DesignToken, type DesignTokenGroup, TOKENS } from '../tokens/index'

type DTG = DesignTokenGroup
type RSS = Record<string, string>

const createTokens = (tokens: DTG, cssPrefix: string, twPrefix: string, direct?: boolean): RSS => {
  return Object.fromEntries(
    Object.entries<DesignToken>(tokens).map(([tokenName, token]) => [
      twPrefix + tokenName,
      direct ? (token.$value as string) : `var(${cssPrefix}${tokenName})`,
    ]),
  )
}

export const tailwindTheme = {
  // USE_CSS_VARS env cannot be used with Tailwind, so CSS vars cannot be completely removed
  // Tailwind doesn't support multiple theme configs, it requires `dark:` prefix for each class
  // https://tailwindcss.com/docs/dark-mode
  backdropBlur: createTokens(TOKENS.BLUR, CSS_PREFIX.BLUR, ''),
  borderRadius: createTokens(TOKENS.RADIUS, CSS_PREFIX.RADIUS, ''),
  boxShadow: createTokens(TOKENS.SHADOW, CSS_PREFIX.SHADOW, ''),
  colors: createTokens(TOKENS.COLOR, CSS_PREFIX.COLOR, 'color-'),
  fontSize: createTokens(TOKENS.FONT_SIZE, CSS_PREFIX.FONT_SIZE, 'size-'),
  fontWeight: createTokens(TOKENS.FONT_WEIGHT, CSS_PREFIX.FONT_WEIGHT, 'weight-'),
  lineHeight: createTokens(TOKENS.LINE_HEIGHT, CSS_PREFIX.LINE_HEIGHT, ''),
  screens: createTokens(TOKENS.BREAKPOINT, CSS_PREFIX.BREAKPOINT, '', true),
  spacing: createTokens(TOKENS.SPACING, CSS_PREFIX.SPACING, ''),
  zIndex: createTokens(TOKENS.Z_INDEX, CSS_PREFIX.Z_INDEX, ''),
  extend: {
    colors: { 'color-transparent': 'transparent' },
    borderRadius: { none: 0 },
    height: { screen: '100vh' },
    margin: { 0: 0, px: '1px', auto: 'auto' },
    padding: { 0: 0, px: '1px' },
    width: { screen: '100vw' },
    zIndex: { 0: 0, 1: 1 },
    spacing: {
      0: 0,
      px: '1px',
      full: '100%',
      fit: 'fit-content',
      unset: 'unset',
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
    },
  },
}
