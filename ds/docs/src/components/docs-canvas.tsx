import { useA11yService } from '@ds/core'
import { type ModifierKey, useEffect, useRef } from 'react'
import { useDocsCanvasService } from '../services/docs-canvas-service'
import { DocsTooltip } from './docs-tooltip'

interface Props extends ReactProps {
  extended?: boolean
  shortcuts?: StoryShortcut[]
}

export const DocsCanvas = (props: Props) => {
  const { children, className, extended, shortcuts = [] } = props
  const { canvasBgClass } = useDocsCanvasService()
  const { forceA11yMode } = useA11yService()
  const input1Ref = useRef<HTMLInputElement>(null)
  const input2Ref = useRef<HTMLInputElement>(null)

  const rootClass = cx('border-color-border-default rounded-md border', canvasBgClass, className)
  const focusClass = cx(
    'w-md-3 bg-color-bg-page py-xs-0 absolute right-0',
    'text-size-xs text-color-text-subtle text-center',
  )
  const shortcutClass = cx('absolute left-0 cursor-default', 'text-size-xs text-color-text-subtle text-center')
  const shortcutTooltip = shortcuts.map((item) => `${item.keys.join(' + ')} — ${item.label}`).join('\n')

  const handleInputFocus = (event: ReactFocusEvent) => {
    forceA11yMode('default')
    // Remove selection
    const input = event.target as HTMLInputElement
    input.selectionEnd = input.selectionStart
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const match = shortcuts.find((shortcut) =>
        shortcut.keys.every((key) => e.key === key || e.getModifierState(key as ModifierKey)),
      )
      match?.fn()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])

  return extended ? (
    <div className={cx(rootClass, 'flex-center min-h-lg-9 relative flex-col')}>
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

      {shortcuts.length > 0 && (
        <DocsTooltip label={shortcutTooltip}>
          <div className={cx(shortcutClass, 'bottom-[-23px]')}>Shortcuts</div>
        </DocsTooltip>
      )}

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
    <div className={rootClass}>{children}</div>
  )
}
