import type { CSSObject } from '@emotion/react'
import { useThemeService } from '../theme-service'

export interface CrosshairRect {
  top: number
  left: number
  width: number
  height: number
}
export interface CrosshairProps {
  visible: boolean
  targetRect: CrosshairRect
}

export const Crosshair = (props: CrosshairProps) => {
  const { targetRect, visible } = props
  const { tokens } = useThemeService()

  const isSquare = Math.abs(targetRect.width - targetRect.height) < 4
  const heightPx = `${targetRect.height}px`

  const crosshairCss: CSSObject = {
    position: 'absolute',
    inset: 0,
    border: `1px dotted ${tokens.color['button-crosshair']}`,
    transition: 'all 0.3s ease',
    transform: 'scale(1.35)',
    opacity: 0,
    zIndex: 1,
    '&::after': {
      position: 'absolute',
      inset: 0,
      content: '""',
    },
    '& > span': {
      position: 'absolute',
      width: `calc(${heightPx} / 4)`,
      height: `calc(${heightPx} / 4)`,
      border: `3px solid ${tokens.color['button-crosshair']}`,
    },
    '& > span:nth-of-type(1)': { top: '-2px', left: '-2px', borderBottom: 'none', borderRight: 'none' },
    '& > span:nth-of-type(2)': { top: '-2px', right: '-2px', borderBottom: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(3)': { bottom: '-2px', right: '-2px', borderTop: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(4)': { bottom: '-2px', left: '-2px', borderTop: 'none', borderRight: 'none' },
  }

  const crosshairHoverCss: CSSObject = {
    opacity: 1,
    transform: isSquare ? 'scale(1.2)' : 'scale(1.05, 1.25)',
  }

  return (
    <div
      css={{
        pointerEvents: 'none',
        userSelect: 'none',
        position: 'fixed',
        zIndex: 9999,
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      }}
    >
      <div css={[crosshairCss, visible && crosshairHoverCss]}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
