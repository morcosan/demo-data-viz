import { CssSvg, TailwindSvg, TypescriptSvg } from '@ds/core'
import { useEffect, useState } from 'react'
import { DocsTokenCode } from './docs-token-code'

interface Props {
  tsVar: string
  tsSize?: string
  twVars: string[]
  twSize?: string
  cssVar: string
  cssSize?: string
  delay?: number
}

export const DocsTokenCoding = ({ tsVar, tsSize, twVars, twSize, cssVar, cssSize, delay }: Props) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Avoid lag by delaying rendering
    const timeoutId = setTimeout(() => setLoading(false), delay || 800)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="mr-xs-9 gap-xs-3 flex">
      <DocsTokenCode
        iconSvg={<TypescriptSvg className="h-full w-fit" />}
        value={tsVar}
        size={tsSize}
        loading={loading}
      />

      {twVars.map((twVar: string) => (
        <DocsTokenCode
          key={twVar}
          iconSvg={<TailwindSvg className="h-full w-fit" />}
          value={twVar}
          size={twSize}
          loading={loading}
        />
      ))}

      <DocsTokenCode
        iconSvg={<CssSvg className="h-full w-fit" />}
        value={`var(${cssVar})`}
        size={cssSize}
        loading={loading}
      />
    </div>
  )
}
