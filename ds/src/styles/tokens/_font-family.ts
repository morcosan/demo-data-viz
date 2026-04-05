import type { DesignTokenGroup } from './__types'

export const TOKENS__FONT_FAMILY = {
  sans: { $value: "'Geist', sans-serif" },
  mono: { $value: "'Geist Mono', monospace" },
} as const satisfies DesignTokenGroup<string>
