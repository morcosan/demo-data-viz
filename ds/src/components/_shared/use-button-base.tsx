import { type CSSObject } from '@emotion/react'
import { Loader } from '@mantine/core'
import '@mantine/core/styles/Loader.css'
import { type CSSProperties, type ReactNode } from 'react'
import { useThemeService } from '../../services/theme-service'
import { useDataProps } from '../../utilities/react-utils'
import { type BaseButtonSize, type BaseVariant, type ClickableState, type LinkType } from './types'
import { useButtonStyles } from './use-button-styles'
import { useClickable } from './use-clickable'

interface BaseButtonProps extends HtmlDataProps {
  // Slots
  children: ReactNode
  tooltip?: string
  ariaDescription?: string

  // Props
  size: BaseButtonSize
  variant: BaseVariant
  state: ClickableState
  linkHref?: string
  linkType?: LinkType
  isIcon?: boolean
  className?: string
  style?: CSSProperties
}

export const useButtonBase = (props: BaseButtonProps) => {
  const { ariaDescription, children, className, size, style, tooltip, state, variant, isIcon } = props
  const { tokens } = useThemeService()
  const { bindings: clickableBindings, isNoop, isPressed, pressing } = useClickable(props)
  const dataProps = useDataProps(props)
  const styles = useButtonStyles({ size, variant })

  const isSelected = state === 'selected'
  const isSolid = variant === 'primary' || variant === 'danger'
  const isOutline = variant === 'secondary'
  const isTextOnly = variant === 'tertiary' || variant === 'optional' || variant === 'caution'
  const isMenuItem = variant === 'menu-default' || variant === 'menu-caution'

  const noopProps = ((): CSSObject => {
    const noopColor = tokens.color['text-subtle']
    if (isSolid) return { color: tokens.color['text-inverse'], backgroundColor: noopColor, borderColor: noopColor }
    if (isOutline) return { color: noopColor, backgroundColor: 'transparent', borderColor: noopColor }
    if (isTextOnly || isMenuItem) return { color: noopColor }
    return {}
  })()

  const spinnerCss: CSSObject = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    userSelect: 'none',
  }
  const spinnerIconCss: CSSObject = {
    '--loader-size': `${styles.spinnerSize} !important`,
    '--loader-color': `${isSolid ? tokens.color['text-inverse'] : tokens.color['text-subtle']} !important`,
  }
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
      backgroundColor: tokens.color['button-crosshair'],
      opacity: 0.01,
    },
    '& > span': {
      position: 'absolute',
      width: `calc(${styles.height} / 4)`,
      height: `calc(${styles.height} / 4)`,
      border: `${styles.crosshairSize} solid ${tokens.color['button-crosshair']}`,
    },
    '& > span:nth-of-type(1)': { top: '-2px', left: '-2px', borderBottom: 'none', borderRight: 'none' },
    '& > span:nth-of-type(2)': { top: '-2px', right: '-2px', borderBottom: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(3)': { bottom: '-2px', right: '-2px', borderTop: 'none', borderLeft: 'none' },
    '& > span:nth-of-type(4)': { bottom: '-2px', left: '-2px', borderTop: 'none', borderRight: 'none' },
  }
  const crosshairHoverCss: CSSObject = {
    opacity: 1,
    transform: isIcon ? 'scale(1.2)' : 'scale(1.05, 1.25)',
  }
  const surfaceCss: CSSObject = {
    ...(isPressed ? styles.surfacePressed : isSelected ? styles.surfaceSelected : styles.surfaceDefault),
    ...(isNoop ? noopProps : {}),
    ...(isIcon ? { borderRadius: tokens.radius['full'] } : {}),
    position: 'relative',
    transition: 'all 0.3s ease',
    width: '100%',
    height: '100%',
    padding: isIcon ? 0 : `0 ${styles.paddingX}`,
    ...(isPressed ? { transform: `scale(${styles.scalePressed})` } : {}),
  }
  const childrenCss: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMenuItem ? 'unset' : 'center',
    textAlign: isMenuItem ? 'left' : 'center',
    width: '100%',
    height: '100%',
    opacity: state === 'loading' ? 0 : 1,
    pointerEvents: 'none',
    userSelect: 'none',
    lineHeight: 1,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    fill: 'currentColor',
    stroke: 'currentColor',
  }
  const crosshairSelector = '& > span:nth-of-type(1)'
  const surfaceSelector = '& > span:nth-of-type(2)'
  const buttonCss: CSSObject = {
    position: 'relative',
    display: 'inline-flex',
    height: styles.height,
    minHeight: styles.height,
    borderRadius: surfaceCss.borderRadius,
    outlineOffset: `calc(1px + ${tokens.spacing['a11y-outline']})`, // CSS bug: outline offset overlaps border width
    opacity: isNoop ? 0.4 : 1,
    cursor: isNoop ? 'not-allowed' : 'pointer',
    '&:hover, &:focus': isNoop
      ? {}
      : pressing
        ? {
            [crosshairSelector]: crosshairHoverCss,
          }
        : {
            [crosshairSelector]: crosshairHoverCss,
            [surfaceSelector]: {
              ...styles.surfaceHovered,
              transform: 'scale(1)',
            },
          },
  }

  const bindings = {
    ...clickableBindings,
    title: tooltip,
    className: className,
    style: style,
    'aria-description': ariaDescription,
    css: buttonCss,
    ...dataProps,
  }

  const content = (
    <>
      <span css={crosshairCss}>
        <span />
        <span />
        <span />
        <span />
      </span>
      <span css={surfaceCss}>
        <span css={childrenCss}>{children}</span>
        {state === 'loading' && (
          <span css={spinnerCss}>
            <Loader css={spinnerIconCss} />
          </span>
        )}
      </span>
    </>
  )

  return {
    bindings,
    buttonCss,
    content,
    isNoop,
    styles,
  }
}
