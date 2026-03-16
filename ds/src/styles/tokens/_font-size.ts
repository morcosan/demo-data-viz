import type { DesignTokenGroup } from './__types'

export const TOKENS__FONT_SIZE = {
  xs: { $value: '0.75rem' },
  sm: { $value: '0.875rem' },
  md: { $value: '1rem' },
  lg: { $value: '1.25rem' },
  xl: { $value: '1.5rem' },
  xxl: { $value: '2rem' },
  'xs-mono': { $value: '0.6875rem' },
  'sm-mono': { $value: '0.8125rem' },
  'md-mono': { $value: '0.9375rem' },
  'lg-mono': { $value: '1.1875rem' },
  'xl-mono': { $value: '1.4375rem' },
  'xxl-mono': { $value: '1.9375rem' },
} as const satisfies DesignTokenGroup<string>
