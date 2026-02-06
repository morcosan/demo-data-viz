import clsx from 'clsx'

globalThis.cx = clsx
globalThis.log = (...args: unknown[]) => console.log(...args)
globalThis.ENV__BASE_PATH = process.env.ENV__BASE_PATH || ''
globalThis.ENV__BUILD_NUMBER = process.env.ENV__BUILD_NUMBER || '0'
globalThis.ENV__EUROSTAT_BASE_URL = process.env.ENV__EUROSTAT_BASE_URL || '0'
