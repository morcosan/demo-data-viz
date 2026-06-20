import { type CSSObject } from '@emotion/react'
import { Loader } from '@mantine/core'
import '@mantine/core/styles/Loader.css'
import { type CSSProperties, type ReactNode } from 'react'
import { useThemeService } from '../../services/theme-service'
import { useDataProps } from '../../utilities/react-utils'
import { useHoverEffect } from '../../utilities/use-hover-effect'
import { type BaseButtonSize, type BaseButtonState, type BaseButtonVariant, type LinkType } from './types'
import { useButtonStyles } from './use-button-styles'
import { useClickable } from './use-clickable'

interface BaseButtonProps extends HtmlDataProps {
  // Slots
  children: ReactNode
  tooltip?: string
  ariaDescription?: string

  // Props
  size: BaseButtonSize
  variant: BaseButtonVariant
  state: BaseButtonState
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
  const styles = useButtonStyles({ state, size, variant })
  const isSolid = variant === 'primary' || variant === 'danger'
  const isOutline = variant === 'secondary'
  const isTextOnly = variant === 'default' || variant === 'optional' || variant === 'caution'
  const isMenuItem = variant === 'menu-default' || variant === 'menu-caution'
  const hoverEffect = useHoverEffect({ small: size === 'xs', wide: isMenuItem })

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

  const surfaceCss: CSSObject = {
    ...(isPressed ? styles.surfacePress : styles.surfaceDefault),
    ...(isNoop ? noopProps : {}),
    transition: ['all 0.3s ease', 'background-size 0s step-start', 'background-position 0s step-start'].join(','),
    width: '100%',
    height: '100%',
    padding: isIcon ? 0 : `0 ${styles.paddingX}`,
    borderRadius: tokens.radius[isIcon ? 'full' : isMenuItem ? 'sm' : 'max'],
    ...(isPressed ? { transform: `scale(${styles.scalePressed})`, boxShadow: 'none' } : {}),
  }
  const surfaceHoverCss: CSSObject = {
    ...styles.surfaceHover,
    transform: 'scale(1)',
  }
  const childrenCss: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMenuItem ? 'unset' : 'center',
    textAlign: isMenuItem ? 'left' : 'center',
    width: '100%',
    height: '100%',
    opacity: state === 'loading' ? 0 : 1,
    lineHeight: 1,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    fill: 'currentColor',
    stroke: 'currentColor',
  }
  const buttonCss: CSSObject = {
    position: 'relative',
    display: 'inline-flex',
    height: styles.height,
    minHeight: styles.height,
    borderRadius: surfaceCss.borderRadius,
    outlineOffset: `calc(1px + ${tokens.spacing['a11y-outline']})`, // CSS bug: outline offset overlaps border width
    opacity: isNoop ? 0.4 : 1,
    cursor: isNoop ? 'not-allowed' : 'pointer',
    '& > span': {
      pointerEvents: 'none',
      userSelect: 'none',
    },
    '&:hover, &:focus': isNoop
      ? {}
      : pressing
        ? { '& > span:nth-of-type(1)': hoverEffect.css }
        : {
            '& > span:nth-of-type(1)': hoverEffect.css,
            '& > span:nth-of-type(2)': surfaceHoverCss,
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
      {hoverEffect.html}
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
