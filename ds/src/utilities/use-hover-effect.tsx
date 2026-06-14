import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../services/theme-service'

export interface HoverEffectProps {
  small?: boolean
}

export const useHoverEffect = ({ small }: HoverEffectProps) => {
  const { tokens } = useThemeService()

  const rootCss: CSSObject = {
    position: 'absolute',
    inset: 0,
    zIndex: tokens.zIndex['tooltip'],
    border: `1px dotted ${tokens.color['button-hover-effect']}`,
    transition: 'all 0.3s ease',
    transform: 'scale(1.35)',
    opacity: 0,
    pointerEvents: 'none',
    userSelect: 'none',

    '& > span': {
      position: 'absolute',
      width: small ? '6px' : '10px',
      height: small ? '6px' : '10px',
      border: `${small ? '2px' : '3px'} solid ${tokens.color['button-hover-effect']}`,
    },
    '& > span:nth-of-type(1)': { top: '-2px', left: '-2px', borderBottom: 'none', borderRight: 'none' },
    '& > span:nth-of-type(2)': { top: '-2px', right: '-2px', borderBottom: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(3)': { bottom: '-2px', right: '-2px', borderTop: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(4)': { bottom: '-2px', left: '-2px', borderTop: 'none', borderRight: 'none' },
  }

  const hoverCss: CSSObject = {
    opacity: 1,
    transform: small ? 'scale(1.2)' : 'scale(1.05, 1.25)',
  }

  const hoverHtml = (
    <span css={rootCss}>
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
