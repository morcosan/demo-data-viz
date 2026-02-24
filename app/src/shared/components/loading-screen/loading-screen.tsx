'use client'

import { LogoSvg, useDefaults, useI18nService } from '@ds/core'
import { type CSSObject } from '@emotion/react'
import { useEffect, useState } from 'react'

interface Props extends ReactProps {
  minTimeout?: number
  maxTimeout?: number
}

export const LoadingScreen = (rawProps: Props) => {
  const props = useDefaults(rawProps, { minTimeout: 0, maxTimeout: 3000 })
  const { loading } = useI18nService()
  const [viewportWidth, setViewportWidth] = useState(0)
  const [hasMinTimeout, setHasMinTimeout] = useState(false)
  const [hasMaxTimeout, setHasMaxTimeout] = useState(false)
  const ariaLabel = 'Loading...' // I18n is not loaded yet, so no translation
  const isReady = hasMaxTimeout || (hasMinTimeout && !loading && viewportWidth > 0)

  const cssOverlay: CSSObject = {
    animation: isReady ? 'fadeOut 1s forwards' : 'unset',
    pointerEvents: isReady ? 'none' : 'unset',

    '@keyframes fadeOut': {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
  }

  useEffect(() => {
    setViewportWidth(window.innerWidth)

    const minTimer = setTimeout(() => setHasMinTimeout(true), props.minTimeout)
    const maxTimer = setTimeout(() => setHasMaxTimeout(true), props.maxTimeout)

    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
    }
  }, [])

  return (
    <>
      {/* CONTENT */}
      <div className="h-full w-full" aria-busy={!isReady}>
        {props.children}
      </div>

      {/* OVERLAY */}
      <div className="fixed-overlay flex-center z-tooltip bg-color-bg-page" css={cssOverlay} aria-hidden={isReady}>
        <LogoSvg className="h-1/4 w-1/3 animate-pulse" aria-label={ariaLabel} />
      </div>
    </>
  )
}
