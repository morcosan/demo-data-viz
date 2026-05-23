const oklchToHex = (input: string): string => {
  const match = input.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/i)
  if (!match) throw new Error('Invalid OKLCH format')

  const [, lStr, cStr, hStr, alphaStr] = match
  const l = parseFloat(lStr)
  const c = parseFloat(cStr)
  const h = parseFloat(hStr)
  const alpha = alphaStr ? parseFloat(alphaStr) : 1

  // OKLCH -> OKLab
  const hr = (h * Math.PI) / 180
  const a = c * Math.cos(hr)
  const b = c * Math.sin(hr)

  // OKLab -> linear sRGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b
  const l3 = l_ ** 3
  const m3 = m_ ** 3
  const s3 = s_ ** 3
  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  let b2 = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

  // linear -> gamma corrected sRGB
  const toSRGB = (x: number) => {
    x = Math.max(0, Math.min(1, x))
    return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055
  }

  r = toSRGB(r)
  g = toSRGB(g)
  b2 = toSRGB(b2)

  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()

  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()

  return `#${toHex(r)}${toHex(g)}${toHex(b2)}${alpha < 1 ? alphaHex : ''}`
}

export { oklchToHex }
