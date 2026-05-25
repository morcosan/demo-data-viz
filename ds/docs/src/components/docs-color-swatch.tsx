import { CSS_PREFIX, getTokenValue, oklchToHex, TOKENS, wait } from '@ds/core'
import { useState } from 'react'

interface Props {
  color: keyof typeof TOKENS.COLOR
}

export const DocsColorSwatch = ({ color }: Props) => {
  const [copied, setCopied] = useState(false)

  const copiedClass = cx(
    'flex-center absolute-center bg-color-success-card-bg px-xs-1 rounded-xs',
    'text-size-xs text-color-success-card-text',
  )
  const hexValue = oklchToHex(getTokenValue(TOKENS.COLOR[color]))

  const handleClick = (event: ReactMouseEvent) => {
    const button = event.target as HTMLButtonElement
    button.blur()
    navigator.clipboard.writeText(hexValue)
    setCopied(true)
    wait(600).then(() => setCopied(false))
  }

  return (
    <button
      type="button"
      className="group h-md-0 relative flex min-w-fit flex-1 cursor-pointer items-start justify-start whitespace-nowrap"
      style={{ background: `var(${CSS_PREFIX.COLOR}${color})` }}
      onClick={handleClick}
    >
      <span className="bg-color-white-alpha-7 px-xs-1 text-color-black text-size-xs rounded-xs">{color}</span>

      <span className="absolute-overlay flex items-end opacity-0 group-focus:opacity-100 hover:opacity-100">
        <span className="bg-color-white-alpha-10 px-xs-1 text-size-xs flex">{hexValue}</span>
      </span>

      {Boolean(copied) && <span className={copiedClass}>Copied</span>}
    </button>
  )
}
