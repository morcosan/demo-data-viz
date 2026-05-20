import { type ColorMode, CSS_PREFIX, type DesignTokenGroup, getTokenValue, TOKENS } from '../../styles/tokens'

interface ThemeTokens {
  blur: Record<keyof typeof TOKENS.BLUR, string>
  breakpoint: Record<keyof typeof TOKENS.BREAKPOINT, string>
  color: Record<keyof typeof TOKENS.COLOR, string>
  fontFamily: Record<keyof typeof TOKENS.FONT_FAMILY, string>
  fontSize: Record<keyof typeof TOKENS.FONT_SIZE, string>
  fontWeight: Record<keyof typeof TOKENS.FONT_WEIGHT, string>
  lineHeight: Record<keyof typeof TOKENS.LINE_HEIGHT, string>
  radius: Record<keyof typeof TOKENS.RADIUS, string>
  shadow: Record<keyof typeof TOKENS.SHADOW, string>
  spacing: Record<keyof typeof TOKENS.SPACING, string>
  zIndex: Record<keyof typeof TOKENS.Z_INDEX, string>
}

const ENV__USE_CSS_VARS = true

const mapTokens = (tokenGroup: DesignTokenGroup, ccPrefix: string, mode: ColorMode) => {
  return Object.fromEntries(
    Object.keys(tokenGroup).map((tokenName: string) => [
      tokenName,
      ENV__USE_CSS_VARS ? `var(${ccPrefix}${tokenName})` : String(getTokenValue(tokenGroup, tokenName, mode)),
    ]),
  ) as Record<string, string>
}

const createTokens = (mode: ColorMode): ThemeTokens => {
  return {
    blur: mapTokens(TOKENS.BLUR, CSS_PREFIX.BLUR, mode),
    breakpoint: mapTokens(TOKENS.BREAKPOINT, CSS_PREFIX.BREAKPOINT, mode),
    color: mapTokens(TOKENS.COLOR, CSS_PREFIX.COLOR, mode),
    fontFamily: mapTokens(TOKENS.FONT_FAMILY, CSS_PREFIX.FONT_FAMILY, mode),
    fontSize: mapTokens(TOKENS.FONT_SIZE, CSS_PREFIX.FONT_SIZE, mode),
    fontWeight: mapTokens(TOKENS.FONT_WEIGHT, CSS_PREFIX.FONT_WEIGHT, mode),
    lineHeight: mapTokens(TOKENS.LINE_HEIGHT, CSS_PREFIX.LINE_HEIGHT, mode),
    radius: mapTokens(TOKENS.RADIUS, CSS_PREFIX.RADIUS, mode),
    shadow: mapTokens(TOKENS.SHADOW, CSS_PREFIX.SHADOW, mode),
    spacing: mapTokens(TOKENS.SPACING, CSS_PREFIX.SPACING, mode),
    zIndex: mapTokens(TOKENS.Z_INDEX, CSS_PREFIX.Z_INDEX, mode),
  }
}

const lightModeTokens = createTokens('light')
const darkModeTokens = createTokens('dark')

export { darkModeTokens, lightModeTokens, type ThemeTokens }
