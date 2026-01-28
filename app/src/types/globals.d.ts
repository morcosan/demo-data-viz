import '@ds/types.d.ts'
import { ClassValue } from 'clsx'

export {}
declare global {
	var cx: (...args: ClassValue[]) => string // Shortcut for `clsx` without import

	var ENV__BASE_PATH: string
	var ENV__BUILD_NUMBER: string
}
