import type { ColorTheme, DesignTokenThemeValue } from './__types.ts'
import { getTokenValue } from './__utils.ts'
import { TOKENS__BLUR } from './_blur.ts'
import { TOKENS__BREAKPOINT } from './_breakpoint.ts'
import { TOKENS__COLOR } from './_color.ts'
import { TOKENS__FONT_SIZE } from './_font-size.ts'
import { TOKENS__FONT_WEIGHT } from './_font-weight.ts'
import { TOKENS__LINE_HEIGHT } from './_line-height.ts'
import { TOKENS__RADIUS } from './_radius.ts'
import { TOKENS__SHADOW } from './_shadow.ts'
import { TOKENS__SPACING } from './_spacing.ts'
import { TOKENS__Z_INDEX } from './_z-index.ts'

type Blur = keyof typeof TOKENS__BLUR
type Breakpoint = keyof typeof TOKENS__BREAKPOINT
type Color = keyof typeof TOKENS__COLOR
type FontSize = keyof typeof TOKENS__FONT_SIZE
type FontWeight = keyof typeof TOKENS__FONT_WEIGHT
type LineHeight = keyof typeof TOKENS__LINE_HEIGHT
type Radius = keyof typeof TOKENS__RADIUS
type Shadow = keyof typeof TOKENS__SHADOW
type Spacing = keyof typeof TOKENS__SPACING
type ZIndex = keyof typeof TOKENS__Z_INDEX
type CT = ColorTheme
type ThemeValue<V> = DesignTokenThemeValue<V>

const gTV = getTokenValue

const getTokenValue_BLUR = (k: Blur, cs?: CT) => gTV<Blur, string>(TOKENS__BLUR, k, cs)
const getTokenValue_BREAKPOINT = (k: Breakpoint, cs?: CT) => gTV<Breakpoint, string>(TOKENS__BREAKPOINT, k, cs)
const getTokenValue_COLOR = (k: Color, cs?: CT) => gTV<Color, string>(TOKENS__COLOR, k, cs)
const getTokenValue_FONT_SIZE = (k: FontSize, cs?: CT) => gTV<FontSize, string>(TOKENS__FONT_SIZE, k, cs)
const getTokenValue_FONT_WEIGHT = (k: FontWeight, cs?: CT) => gTV<FontWeight, number>(TOKENS__FONT_WEIGHT, k, cs)
const getTokenValue_LINE_HEIGHT = (k: LineHeight, cs?: CT) => gTV<LineHeight, number>(TOKENS__LINE_HEIGHT, k, cs)
const getTokenValue_RADIUS = (k: Radius, cs?: CT) => gTV<Radius, string>(TOKENS__RADIUS, k, cs)
const getTokenValue_SHADOW = (k: Shadow, cs?: CT) => gTV<Shadow, ThemeValue<string>>(TOKENS__SHADOW, k, cs)
const getTokenValue_SPACING = (k: Spacing, cs?: CT) => gTV<Spacing, string>(TOKENS__SPACING, k, cs)
const getTokenValue_Z_INDEX = (k: ZIndex, cs?: CT) => gTV<ZIndex, number>(TOKENS__Z_INDEX, k, cs)

const CSS_PREFIX = {
  BLUR: '--ds-blur-',
  BREAKPOINT: '--ds-breakpoint-',
  COLOR: '--ds-color-',
  FONT_SIZE: '--ds-font-size-',
  FONT_WEIGHT: '--ds-font-weight-',
  LINE_HEIGHT: '--ds-line-height-',
  RADIUS: '--ds-radius-',
  SHADOW: '--ds-shadow-',
  SPACING: '--ds-spacing-',
  Z_INDEX: '--ds-z-index-',
}

const TOKENS = {
  BLUR: TOKENS__BLUR,
  BREAKPOINT: TOKENS__BREAKPOINT,
  COLOR: TOKENS__COLOR,
  FONT_SIZE: TOKENS__FONT_SIZE,
  FONT_WEIGHT: TOKENS__FONT_WEIGHT,
  LINE_HEIGHT: TOKENS__LINE_HEIGHT,
  RADIUS: TOKENS__RADIUS,
  SHADOW: TOKENS__SHADOW,
  SPACING: TOKENS__SPACING,
  Z_INDEX: TOKENS__Z_INDEX,
}

export * from './__types.ts'
export {
  CSS_PREFIX,
  getTokenValue,
  getTokenValue_BLUR,
  getTokenValue_BREAKPOINT,
  getTokenValue_COLOR,
  getTokenValue_FONT_SIZE,
  getTokenValue_FONT_WEIGHT,
  getTokenValue_LINE_HEIGHT,
  getTokenValue_RADIUS,
  getTokenValue_SHADOW,
  getTokenValue_SPACING,
  getTokenValue_Z_INDEX,
  TOKENS,
  TOKENS__BLUR,
  TOKENS__BREAKPOINT,
  TOKENS__COLOR,
  TOKENS__FONT_SIZE,
  TOKENS__FONT_WEIGHT,
  TOKENS__LINE_HEIGHT,
  TOKENS__RADIUS,
  TOKENS__SHADOW,
  TOKENS__SPACING,
  TOKENS__Z_INDEX,
}
