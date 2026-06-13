import { type CSSObject } from '@emotion/react'
import { useEffect, useState } from 'react'
import { getTokenValue, TOKENS } from '../../styles/tokens'
import { useThemeService } from '../theme-service'

export interface CrosshairProps {
  visible: boolean
  targetRect: DOMRect
}

export const Crosshair = (props: CrosshairProps) => {
  const { targetRect, visible } = props
  const { tokens } = useThemeService()
  const [isVisible, setIsVisible] = useState(false)

  const heightLimit = parseInt(getTokenValue(TOKENS.SPACING['button-h-sm']))
  const isSmall = targetRect.width <= heightLimit || targetRect.height <= heightLimit
  const isSquare = Math.abs(targetRect.width - targetRect.height) < 4

  const crosshairCss: CSSObject = {
    position: 'fixed',
    zIndex: tokens.zIndex['tooltip'],
    border: `1px dotted ${tokens.color['button-crosshair']}`,
    transition: 'all 0.3s ease',
    transform: 'scale(1.35)',
    opacity: 0,
    pointerEvents: 'none',
    userSelect: 'none',

    '& > div': {
      position: 'absolute',
      width: `calc(${targetRect.height}px / 4)`,
      height: `calc(${targetRect.height}px / 4)`,
      border: `${isSmall ? '2px' : '3px'} solid ${tokens.color['button-crosshair']}`,
    },
    '& > div:nth-of-type(1)': { top: '-2px', left: '-2px', borderBottom: 'none', borderRight: 'none' },
    '& > div:nth-of-type(2)': { top: '-2px', right: '-2px', borderBottom: 'none', borderLeft: 'none' },
    '& > div:nth-of-type(3)': { bottom: '-2px', right: '-2px', borderTop: 'none', borderLeft: 'none' },
    '& > div:nth-of-type(4)': { bottom: '-2px', left: '-2px', borderTop: 'none', borderRight: 'none' },
  }

  const crosshairHoverCss: CSSObject = {
    opacity: 1,
    transform: isSquare ? 'scale(1.2)' : 'scale(1.05, 1.25)',
  }

  useEffect(() => {
    // Must start hidden for CSS transition to work
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(visible)
      })
    })
  }, [visible])

  return (
    <div
      css={[crosshairCss, isVisible && crosshairHoverCss]}
      style={{
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      }}
    >
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}
