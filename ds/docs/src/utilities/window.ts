import clsx from 'clsx'

window.cx = clsx
window.log = (...args: unknown[]) => console.log(...args)

window.LOG = (...args: unknown[]) => {
	if (window.__vitest_browser__) return

	const format: unknown[] = ['%c', 'color: lightgreen']

	for (const arg of args) {
		if (typeof arg === 'string') {
			format[0] += '%s '
		} else {
			break
		}
	}

	format[0] = (format[0] as string).trim()

	console.log(...format.concat(args))
}
