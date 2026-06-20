import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../services/theme-service'

export interface HoverEffectProps {
  small?: boolean
  wide?: boolean
}

export const useHoverEffect = ({ small, wide }: HoverEffectProps) => {
  const { tokens } = useThemeService()

  const startPos = '-12px'
  const endPos = small ? '-3px' : wide ? '-5px' : '-4px'

  const defaultCss: CSSObject = {
    position: 'absolute',
    inset: 0,
    zIndex: tokens.zIndex['tooltip'],
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0,
    '& > span': {
      position: 'absolute',
      width: small ? '6px' : '8px',
      height: small ? '6px' : '8px',
      border: '2px solid transparent',
      transition: 'all 0.3s ease',
    },
    '& > span:nth-of-type(1)': { top: startPos, left: startPos, borderBottom: 'none', borderRight: 'none' },
    '& > span:nth-of-type(2)': { top: startPos, right: startPos, borderBottom: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(3)': { bottom: startPos, right: startPos, borderTop: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(4)': { bottom: startPos, left: startPos, borderTop: 'none', borderRight: 'none' },
  }

  const hoverCss: CSSObject = {
    opacity: 1,
    '& > span': { borderColor: tokens.color['button-hover-effect'] },
    '& > span:nth-of-type(1)': { top: endPos, left: endPos },
    '& > span:nth-of-type(2)': { top: endPos, right: endPos },
    '& > span:nth-of-type(3)': { bottom: endPos, right: endPos },
    '& > span:nth-of-type(4)': { bottom: endPos, left: endPos },
  }

  const hoverHtml = (
    <span css={defaultCss}>
      <span />
      <span />
      <span />
      <span />
    </span>
  )

  return {
    html: hoverHtml,
    css: hoverCss,
  }
}
