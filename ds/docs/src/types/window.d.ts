import { ClassValue } from 'clsx'

export {}
declare global {
  var cx: (...args: ClassValue[]) => string // Shortcut for `clsx` without import
  var log: (...args: unknown[]) => void // Shortcut for `console.log`
  var LOG: (...args: unknown[]) => void // Shortcut for `console.log`, intentional for production
  var __vitest_browser__: boolean // Flag for Vitest test runner
}
