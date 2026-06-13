import type { CSSObject } from '@emotion/react'
import { useThemeService } from '../theme-service'

export interface CrosshairProps {
  visible: boolean
  top: number
  left: number
  width: number
  height: number
  square: boolean
}

export const Crosshair = (props: CrosshairProps) => {
  const { visible, top, left, height, width, square } = props
  const { tokens } = useThemeService()
  const heightPx = `${height}px`

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
    transform: square ? 'scale(1.2)' : 'scale(1.05, 1.25)',
  }

  return (
    <div
      css={{
        pointerEvents: 'none',
        userSelect: 'none',
        position: 'fixed',
        zIndex: 9999,
        top: top,
        left: left,
        width: width,
        height: height,
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
