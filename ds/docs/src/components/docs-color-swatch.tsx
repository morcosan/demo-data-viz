import { CSS_PREFIX, getTokenValue_COLOR, TOKENS__COLOR, wait } from '@ds/core'
import { useState } from 'react'

interface Props {
  token: keyof typeof TOKENS__COLOR
}

export const DocsColorSwatch = ({ token }: Props) => {
  const [copied, setCopied] = useState(false)

  const copiedClass = cx(
    'flex-center absolute-center bg-color-success-card-bg px-xs-1 rounded-xs',
    'text-size-xs text-color-success-card-text',
  )

  const handleClick = (event: ReactMouseEvent) => {
    const button = event.target as HTMLButtonElement
    button.blur()
    navigator.clipboard.writeText(getTokenValue_COLOR(token))
    setCopied(true)
    wait(600).then(() => setCopied(false))
  }

  return (
    <button
      type="button"
      className="h-md-0 relative flex min-w-fit flex-1 cursor-pointer items-start justify-start whitespace-nowrap"
      style={{ background: `var(${CSS_PREFIX.COLOR}${token})` }}
      onClick={handleClick}
    >
      <div className="bg-color-white-alpha-7 px-xs-1 text-color-black text-size-xs rounded-xs">{token}</div>

      {Boolean(copied) && <div className={copiedClass}>Copied</div>}
    </button>
  )
}
