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

const startTimer = (label: string) => {
  const start = performance.now()

  return {
    stop(suffix?: string) {
      const end = performance.now()
      const time = end - start
      const levels = [
        [100, '#bbf7d0'],
        [300, '#fde56c'],
        [5000, '#fc7a7a'],
        [Infinity, '#8a8391'],
      ] as const
      const color = levels.find(([threshold]) => time < threshold)![1]
      const formatted = (suffix ? `${label} - ${suffix}` : label)
        .replace(/([A-Z])/g, ' $1')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim()

      console.log('⏱ %s = %c%s ms', formatted, `font-weight: bold; color: ${color};`, time.toFixed(2))
    },
  }
}

export { LOG, startTimer }
