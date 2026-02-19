import { useA11yService } from '@ds/core.ts'
import { useRef } from 'react'
import { useDocsCanvasService } from '../services/docs-canvas-service.tsx'

interface Props extends ReactProps {
  extended?: boolean
}

export const DocsCanvas = ({ children, className, extended }: Props) => {
  const { canvasBgClass } = useDocsCanvasService()
  const { forceA11yMode } = useA11yService()
  const input1Ref = useRef<HTMLInputElement>(null)
  const input2Ref = useRef<HTMLInputElement>(null)

  const baseClass = cx('border-color-border-default rounded-md border', canvasBgClass, className)

  const focusClass = cx(
    'w-md-3 bg-color-bg-page py-xs-0 absolute right-0',
    'text-size-xs text-color-text-subtle text-center',
  )

  const handleInputFocus = (event: ReactFocusEvent) => {
    forceA11yMode('default')

    // Remove selection
    const input = event.target as HTMLInputElement
    input.selectionEnd = input.selectionStart
  }

  return extended ? (
    <div className={cx(baseClass, 'flex-center min-h-lg-9 relative flex-col')}>
      <label htmlFor="kf-1" className="sr-only">
        Keyboard focus 1
      </label>
      <label htmlFor="kf-2" className="sr-only">
        Keyboard focus 2
      </label>

      <div tabIndex={0} className="opacity-0" onFocus={() => input2Ref.current?.focus()} />
      <input
        ref={input1Ref}
        id="kf-1"
        defaultValue="Keyboard focus"
        className={cx(focusClass, 'top-[-23px]')}
        onFocus={handleInputFocus}
      />
      {children}
      <input
        ref={input2Ref}
        id="kf-2"
        defaultValue="Keyboard focus"
        className={cx(focusClass, 'bottom-[-23px]')}
        onFocus={handleInputFocus}
      />
      <div tabIndex={0} className="opacity-0" onFocus={() => input1Ref.current?.focus()} />
    </div>
  ) : (
    <div className={baseClass}>{children}</div>
  )
}
