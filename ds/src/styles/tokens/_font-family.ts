import type { DesignTokenGroup } from './__types'

export const TOKENS__FONT_FAMILY = {
  sans: { $value: "'Source Sans 3', sans-serif" },
  mono: { $value: "'Source Code Pro', monospace" },
} as const satisfies DesignTokenGroup<string>
