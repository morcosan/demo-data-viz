import { useTranslation } from '@app-i18n'
import { FullscreenSvg, IconButton, wait } from '@ds/core'
import { type CSSProperties, useMemo, useRef, useState } from 'react'

type WithClientRect = { getBoundingClientRect: () => DOMRect | undefined }

export const useFullscreen = (padding: string) => {
  const { t } = useTranslation()
  const [enabled, setEnabled] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const [isCollapsing, setIsCollapsing] = useState(false)
  const fsRef = useRef<WithClientRect>(null)
  const [clientRect, setClientRect] = useState<DOMRect | null>(null)
  const isFullscreen = isExpanding || isCollapsing
  const animTime = 300
  const endingTime = 100

  const fsStyle: CSSProperties = {
    zIndex: isFullscreen ? 'var(--ds-z-index-modal)' : undefined,
    position: isFullscreen ? 'fixed' : undefined,
    transitionProperty: isFullscreen ? 'all' : undefined,
    transitionDuration: isFullscreen ? `${animTime}ms` : undefined,
    top: isExpanding ? padding : clientRect?.top,
    left: isExpanding ? padding : clientRect?.left,
    width: isExpanding ? `calc(100vw - 2 * ${padding})` : clientRect?.width,
    height: isExpanding ? `calc(100vh - 2 * ${padding})` : clientRect?.height,
    boxShadow: isExpanding ? 'var(--ds-shadow-sm)' : undefined,
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
      wait(animTime + endingTime).then(() => {
        setIsCollapsing(false)
        setClientRect(null)
      })
    }
  }

  const fsOverlay = useMemo(
    () => (
      <div
        className={cx(
          'bg-color-modal-overlay-subtle z-[-1] transition-opacity',
          isFullscreen && 'fixed-overlay',
          isExpanding ? 'opacity-100' : 'opacity-0',
        )}
        style={{ zIndex: 'calc(var(--ds-z-index-modal) - 1)', transitionDuration: `${animTime}ms` }}
      />
    ),
    [isFullscreen, isExpanding],
  )

  const fsButton = useMemo(
    () => (
      <IconButton
        tooltip={isFullscreen ? t('core.action.collapseView') : t('core.action.expandView')}
        size="sm"
        style={{
          transitionProperty: 'margin',
          transitionDuration: `${animTime}ms`,
          marginRight: clientRect && isExpanding ? `calc(${window.innerWidth - clientRect.right}px - ${padding})` : 0,
        }}
        onClick={toggleFullscreen}
      >
        <FullscreenSvg className="h-xs-9" />
      </IconButton>
    ),
    [isFullscreen, isExpanding, clientRect, padding, toggleFullscreen, t],
  )

  return {
    fsButton,
    fsOverlay,
    fsRef,
    fsStyle,
    isFullscreen,
    toggleFullscreen,
  }
}
