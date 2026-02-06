'use client'

import clsx from 'clsx'
import { LOG } from './utils/js-utils.ts'

if (typeof window !== 'undefined') {
	window.cx = clsx
	window.log = (...args: unknown[]) => console.log(...args)
	window.ENV__BASE_PATH = process.env.ENV__BASE_PATH || ''
	window.ENV__BUILD_NUMBER = process.env.ENV__BUILD_NUMBER || '0'
	window.ENV__EUROSTAT_BASE_URL = process.env.ENV__EUROSTAT_BASE_URL || '0'

	LOG('BUILD_NUMBER:', ENV__BUILD_NUMBER)
}
