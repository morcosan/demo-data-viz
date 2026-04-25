import type { DesignTokenGroup } from './_utils/types'

export const TOKENS__FONT_SIZE = {
  xs: { $value: '0.75rem' }, // 12px
  sm: { $value: '0.875rem' }, // 14px
  md: { $value: '1rem' }, // 16px
  lg: { $value: '1.25rem' }, // 20px
  xl: { $value: '1.5rem' }, // 24px
  xxl: { $value: '2rem' }, // 32px
  'xs-mono': { $value: '0.6875rem' }, // 11px
  'sm-mono': { $value: '0.8125rem' }, // 13px
  'md-mono': { $value: '0.9375rem' }, // 15px
  'lg-mono': { $value: '1.1875rem' }, // 19px
  'xl-mono': { $value: '1.4375rem' }, // 23px
  'xxl-mono': { $value: '1.9375rem' }, // 31px
} as const satisfies DesignTokenGroup<string>
