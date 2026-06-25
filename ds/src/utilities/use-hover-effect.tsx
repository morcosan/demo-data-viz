import { type CSSObject } from '@emotion/react'
import { useA11yService } from '../services/a11y-service'
import { useThemeService } from '../services/theme-service'

export interface HoverEffectProps {
  small?: boolean
  rounded?: boolean
}

export const useHoverEffect = ({ small, rounded }: HoverEffectProps) => {
  const { tokens } = useThemeService()
  const { a11yMode } = useA11yService()

  const startPos = rounded ? '-15px' : '-17px'
  const hoverPos = rounded ? '-5px' : small ? '-6px' : '-7px'
  const pressPos = `calc(${hoverPos} + 2px)`

  const defaultCss: CSSObject = {
    position: 'absolute',
    inset: 0,
    zIndex: tokens.zIndex['tooltip'],
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0,
    '& > span': {
      position: 'absolute',
      width: small ? '7px' : '8px',
      height: small ? '7px' : '8px',
      border: '2px solid transparent',
      transition: `all ${tokens.motion['duration-sm']} ease`,
    },
    '& > span:nth-of-type(1)': { top: startPos, left: startPos, borderBottom: 'none', borderRight: 'none' },
    '& > span:nth-of-type(2)': { top: startPos, right: startPos, borderBottom: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(3)': { bottom: startPos, right: startPos, borderTop: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(4)': { bottom: startPos, left: startPos, borderTop: 'none', borderRight: 'none' },
  }

  const hoverCss: CSSObject = {
    opacity: 1,
    '& > span': { borderColor: tokens.color['button-hover-effect'] },
    '& > span:nth-of-type(1)': { top: hoverPos, left: hoverPos },
    '& > span:nth-of-type(2)': { top: hoverPos, right: hoverPos },
    '& > span:nth-of-type(3)': { bottom: hoverPos, right: hoverPos },
    '& > span:nth-of-type(4)': { bottom: hoverPos, left: hoverPos },
  }

  const pressCss: CSSObject = {
    opacity: 1,
    '& > span': { borderColor: tokens.color['button-hover-effect'] },
    '& > span:nth-of-type(1)': { top: pressPos, left: pressPos },
    '& > span:nth-of-type(2)': { top: pressPos, right: pressPos },
    '& > span:nth-of-type(3)': { bottom: pressPos, right: pressPos },
    '& > span:nth-of-type(4)': { bottom: pressPos, left: pressPos },
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
    hoverCss: a11yMode === 'keyboard' ? {} : hoverCss,
    pressCss: a11yMode === 'keyboard' ? {} : pressCss,
  }
}
