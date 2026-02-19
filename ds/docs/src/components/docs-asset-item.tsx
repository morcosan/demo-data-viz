import { wait } from '@ds/core.ts'
import { type ComponentType, useState } from 'react'
import { useDocsCanvasService } from '../services/docs-canvas-service.tsx'

export interface DocsAsset {
  name: string
  elem: ComponentType<{ className?: string }>
  coding: string
}

interface Props {
  asset: DocsAsset
}

export const DocsAssetItem = ({ asset }: Props) => {
  const { canvasBgClass } = useDocsCanvasService()
  const [copied, setCopied] = useState(false)

  const buttonClass = cx(
    'h-md-9 w-md-9 relative flex cursor-pointer flex-col overflow-hidden',
    'border-color-border-default text-color-text-default rounded-sm border',
    'hover:shadow-md focus:shadow-md',
    'hover:scale-[1.05] focus:scale-[1.05]',
  )

  const copiedClass = cx(
    'flex-center absolute-overlay bg-color-success-card-bg',
    'text-size-sm font-weight-md text-color-success-card-text',
  )

  const handleClick = (event: ReactMouseEvent) => {
    const button = event.target as HTMLButtonElement
    button.blur()

    navigator.clipboard.writeText(asset.coding).then(() => setCopied(true))
    wait(600).then(() => setCopied(false))
  }

  return (
    <button type="button" title={asset.coding} className={buttonClass} onClick={handleClick}>
      <span className={cx('flex-center pointer-events-none w-full flex-1', canvasBgClass)}>
        <asset.elem className="max-h-[32px] max-w-full" />
      </span>

      <span className="border-color-border-default py-xs-1 text-size-sm pointer-events-none w-full border-t text-center">
        {asset.name}
      </span>

      {Boolean(copied) && <div className={copiedClass}>Copied</div>}
    </button>
  )
}
