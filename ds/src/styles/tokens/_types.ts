export type DesignToken<V = string | number> =
  | {
      value: DesignTokenValue<V>
      ref?: string | DesignTokenModeValue<string>
      type?: undefined
    }
  | {
      type: 'composite'
      value: DesignTokenComposite
      ref: DesignTokenComposite
    }

export type DesignTokenGroup<V = DesignTokenValue> = {
  [key: string]: DesignToken<V>
}

export type DesignTokenModeValue<V = string | number> = Record<ColorMode, V>
export type DesignTokenValue<V = string | number> = V | DesignTokenModeValue<V>

export type DesignTokenComposite = Record<string, DesignTokenValue>

export type ColorMode = 'light' | 'dark'
export type ColorTheme = 'simple' | 'modern'
