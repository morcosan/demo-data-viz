import { wait } from '@ds/core'
import { type CSSProperties, useMemo, useRef, useState } from 'react'

export const useFullscreen = (padding: string) => {
  const [enabled, setEnabled] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const [isCollapsing, setIsCollapsing] = useState(false)
  const fsRef = useRef<HTMLDivElement>(null)
  const [clientRect, setClientRect] = useState<DOMRect | null>(null)
  const isFullscreen = isExpanding || isCollapsing
  const duration = 300

  const fsStyle: CSSProperties = {
    transitionProperty: isFullscreen ? 'all' : undefined,
    transitionDuration: isFullscreen ? `${duration}ms` : undefined,
    position: isFullscreen ? 'fixed' : undefined,
    top: isExpanding ? padding : clientRect?.top,
    left: isExpanding ? padding : clientRect?.left,
    width: isExpanding ? `calc(100vw - 2 * ${padding})` : clientRect?.width,
    height: isExpanding ? `calc(100vh - 2 * ${padding})` : clientRect?.height,
    zIndex: isFullscreen ? 'var(--ds-z-index-modal)' : undefined,
  }

  const toggleFullscreen = () => {
    if (!enabled) {
      // Expanding
      setClientRect(fsRef.current?.getBoundingClientRect() || null)
      setEnabled(true)
      requestAnimationFrame(() => setIsExpanding(true))
    } else {
      // Collapsing
      setEnabled(false)
      setIsExpanding(false)
      setIsCollapsing(true)
      wait(duration).then(() => {
        setIsCollapsing(false)
        setClientRect(null)
      })
    }
  }

  const fsOverlay = useMemo(
    () => (
      <div
        className={cx(
          'bg-color-modal-overlay-subtle z-[-1] transition-opacity duration-300',
          isFullscreen ? 'fixed-overlay opacity-100' : 'opacity-0',
        )}
        style={{ zIndex: 'calc(var(--ds-z-index-modal) - 1)' }}
      />
    ),

    [isFullscreen],
  )

  return {
    fsOverlay,
    fsRef,
    fsStyle,
    isFullscreen,
    toggleFullscreen,
  }
}
