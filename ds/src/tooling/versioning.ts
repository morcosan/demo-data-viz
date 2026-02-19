import packageJson from '../../package.json' with { type: 'json' }

const getDsVersion = () => `v${packageJson.version}`

const createBuildNumber = (): string => {
  const msecs = new Date().getTime()
  const secs = Math.round(msecs / 1000)
  const mins = Math.round(secs / 60)
  const range = 1_000_000 // Approx. 2 years
  const digits = String(mins % range)

  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(-2)}`
}

export { createBuildNumber, getDsVersion }
