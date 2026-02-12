const LOG = (...args: unknown[]) => {
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

export { LOG }
