import {
  type ColorTheme,
  CSS_PREFIX,
  type DesignTokenGroup,
  getTokenValue,
  TOKENS,
} from '../../styling/tokens/index.ts'

interface ThemeTokens {
  $blur: Record<keyof typeof TOKENS.BLUR, string>
  $breakpoint: Record<keyof typeof TOKENS.BREAKPOINT, string>
  $color: Record<keyof typeof TOKENS.COLOR, string>
  $fontSize: Record<keyof typeof TOKENS.FONT_SIZE, string>
  $fontWeight: Record<keyof typeof TOKENS.FONT_WEIGHT, string>
  $lineHeight: Record<keyof typeof TOKENS.LINE_HEIGHT, string>
  $radius: Record<keyof typeof TOKENS.RADIUS, string>
  $shadow: Record<keyof typeof TOKENS.SHADOW, string>
  $spacing: Record<keyof typeof TOKENS.SPACING, string>
  $zIndex: Record<keyof typeof TOKENS.Z_INDEX, string>
}

const ENV__USE_CSS_VARS = true

const mapTokens = (tokenGroup: DesignTokenGroup, ccPrefix: string, theme: ColorTheme) => {
  return Object.fromEntries(
    Object.keys(tokenGroup).map((tokenName: string) => [
      tokenName,
      ENV__USE_CSS_VARS ? `var(${ccPrefix}${tokenName})` : String(getTokenValue(tokenGroup, tokenName, theme)),
    ]),
  ) as Record<string, string>
}

const createTokens = (theme: ColorTheme): ThemeTokens => {
  return {
    $blur: mapTokens(TOKENS.BLUR, CSS_PREFIX.BLUR, theme),
    $breakpoint: mapTokens(TOKENS.BREAKPOINT, CSS_PREFIX.BREAKPOINT, theme),
    $color: mapTokens(TOKENS.COLOR, CSS_PREFIX.COLOR, theme),
    $fontSize: mapTokens(TOKENS.FONT_SIZE, CSS_PREFIX.FONT_SIZE, theme),
    $fontWeight: mapTokens(TOKENS.FONT_WEIGHT, CSS_PREFIX.FONT_WEIGHT, theme),
    $lineHeight: mapTokens(TOKENS.LINE_HEIGHT, CSS_PREFIX.LINE_HEIGHT, theme),
    $radius: mapTokens(TOKENS.RADIUS, CSS_PREFIX.RADIUS, theme),
    $shadow: mapTokens(TOKENS.SHADOW, CSS_PREFIX.SHADOW, theme),
    $spacing: mapTokens(TOKENS.SPACING, CSS_PREFIX.SPACING, theme),
    $zIndex: mapTokens(TOKENS.Z_INDEX, CSS_PREFIX.Z_INDEX, theme),
  }
}

const lightThemeTokens = createTokens('light')
const darkThemeTokens = createTokens('dark')

export { darkThemeTokens, lightThemeTokens, type ThemeTokens }
