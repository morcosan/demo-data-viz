// Based on Design Tokens Format Module: https://tr.designtokens.org/format
export type DesignToken<V = DesignTokenValue> =
  | {
      readonly $value: V
      readonly $ref?: undefined
      readonly $type?: DesignTokenType
      readonly $description?: string
    }
  | {
      readonly $value?: undefined
      readonly $ref: string | DesignTokenThemeValue<string>
      readonly $type?: DesignTokenType
      readonly $description?: string
    }
export type DesignTokenGroup<V = DesignTokenValue> = {
  readonly $description?: string
} & {
  readonly [key: string]: DesignToken<V>
}

export type DesignTokenThemeValue<V = string | number> = Record<ColorTheme, V>
export type DesignTokenValue<V = string | number> = V | DesignTokenThemeValue<V>
export type DesignTokenType =
  | 'color'
  | 'fontSize'
  | 'fontWeight'
  | 'lineHeight'
  | 'radius'
  | 'shadow'
  | 'spacing'
  | 'zIndex'

export type ColorTheme = 'light' | 'dark'
