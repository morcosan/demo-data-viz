export type DesignToken<V = DesignTokenValue> =
  | {
      readonly value: V
      readonly ref?: undefined
    }
  | {
      readonly ref: string | DesignTokenModeValue<string>
      readonly value?: undefined
    }

export type DesignTokenGroup<V = DesignTokenValue> = {
  readonly [key: string]: DesignToken<V>
}

export type DesignTokenModeValue<V = string | number> = Record<ColorTheme, V>
export type DesignTokenValue<V = string | number> = V | DesignTokenModeValue<V>

export type ColorTheme = 'light' | 'dark'
