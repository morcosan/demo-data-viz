import { CssSvg, TailwindSvg, TypescriptSvg } from '@ds/core'
import { useEffect, useState } from 'react'
import { DocsTokenCode } from './docs-token-code'

interface Props {
  tsVar?: string
  cssVar?: string
  classVar?: string
  twVars?: string[]
  tsSize?: string
  cssSize?: string
  classSize?: string
  twSize?: string
  delay?: number
  vertical?: boolean
}

export const DocsTokenCodeGrid = (props: Props) => {
  const { tsVar, cssVar, twVars, classVar, tsSize, cssSize, twSize, classSize, delay, vertical } = props
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Avoid lag by delaying rendering
    const timeoutId = setTimeout(() => setLoading(false), delay || 800)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className={cx('mr-xs-9 flex', vertical ? 'flex-col' : 'gap-xs-3')}>
      {twVars?.map((twVar: string) => (
        <DocsTokenCode
          key={twVar}
          iconSvg={<TailwindSvg className="aspect-square h-full" />}
          value={twVar}
          size={twSize}
          loading={loading}
        />
      ))}

      {tsVar && (
        <DocsTokenCode
          iconSvg={<TypescriptSvg className="aspect-square h-full" />}
          value={tsVar}
          size={tsSize}
          loading={loading}
        />
      )}

      {cssVar && (
        <DocsTokenCode
          iconSvg={<CssSvg className="aspect-square h-full" />}
          value={`var(${cssVar})`}
          size={cssSize}
          loading={loading}
        />
      )}

      {classVar && (
        <DocsTokenCode
          iconSvg={<CssSvg className="aspect-square h-full" />}
          value={classVar}
          size={classSize}
          loading={loading}
        />
      )}
    </div>
  )
}
