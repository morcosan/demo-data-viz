import { type CSSObject } from '@emotion/react'
import { Loader } from '@mantine/core'
import '@mantine/core/styles/Loader.css'
import { type CSSProperties, type ReactNode } from 'react'
import { useThemeService } from '../../services/theme-service'
import { useDataProps } from '../../utilities/react-utils'
import { type BaseButtonSize, type BaseVariant, type ClickableState, type LinkType } from './types'
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
  noCorners?: boolean
  noPadding?: boolean
  className?: string
  style?: CSSProperties
}

export const useButtonBase = (props: BaseButtonProps) => {
  const { ariaDescription, children, className, size, style, tooltip, state, variant, noCorners, noPadding } = props
  const { tokens } = useThemeService()
  const { bindings: clickableBindings, isNoop, isPressed, pressing } = useClickable(props)
  const dataProps = useDataProps(props)

  const isSelected = state === 'selected'
  const isSolid = variant === 'primary' || variant === 'danger'
  const isOutline = variant === 'secondary'
  const isTextOnly = variant === 'tertiary' || variant === 'optional' || variant === 'caution'
  const isMenuItem = variant === 'menu-default' || variant === 'menu-caution'

  const height = (() => {
    if (size === 'xs') return tokens.spacing['button-h-xs']
    if (size === 'sm') return tokens.spacing['button-h-sm']
    if (size === 'md') return tokens.spacing['button-h-md']
    if (size === 'lg') return tokens.spacing['button-h-lg']
    return ''
  })()
  const paddingX = (() => {
    // Subtract border from padding
    if (isMenuItem) return `calc(${tokens.spacing['button-px-item']} - 1px)`
    if (size === 'xs') return `calc(${tokens.spacing['button-px-xs']} - 1px)`
    if (size === 'sm') return `calc(${tokens.spacing['button-px-sm']} - 1px)`
    if (size === 'md') return `calc(${tokens.spacing['button-px-md']} - 1px)`
    if (size === 'lg') return `calc(${tokens.spacing['button-px-lg']} - 1px)`
  })()
  const spinnerSize = (() => {
    if (size === 'xs') return tokens.spacing['xs-5']
    if (size === 'sm') return tokens.spacing['xs-7']
    if (size === 'md') return tokens.spacing['xs-9']
    if (size === 'lg') return tokens.spacing['sm-0']
    return ''
  })()
  const fontSize = (() => {
    if (isMenuItem) return 'unset'
    if (size === 'xs') return tokens.fontSize['xs']
    if (size === 'sm') return tokens.fontSize['sm']
    if (size === 'md') return tokens.fontSize['md']
    if (size === 'lg') return tokens.fontSize['lg']
  })()
  const fontWeight = isMenuItem ? tokens.fontWeight['sm'] : tokens.fontWeight['md']

  const surfaceDefault = ((): CSSObject => {
    if (variant === 'primary') return tokens.surface['button-primary']
    if (variant === 'secondary') return tokens.surface['button-secondary']
    if (variant === 'tertiary') return tokens.surface['button-tertiary']
    if (variant === 'optional') return tokens.surface['button-optional']
    if (variant === 'danger') return tokens.surface['button-danger']
    if (variant === 'caution') return tokens.surface['button-caution']
    if (variant === 'menu-default') return tokens.surface['button-tertiary']
    if (variant === 'menu-caution') return tokens.surface['button-caution']
    return {}
  })()
  const surfaceHovered = ((): CSSObject => {
    if (variant === 'primary') return tokens.surface['button-primary-hovered']
    if (variant === 'secondary') return tokens.surface['button-secondary-hovered']
    if (variant === 'tertiary') return tokens.surface['button-tertiary-hovered']
    if (variant === 'optional') return tokens.surface['button-optional-hovered']
    if (variant === 'danger') return tokens.surface['button-danger-hovered']
    if (variant === 'caution') return tokens.surface['button-caution-hovered']
    if (variant === 'menu-default') return tokens.surface['button-tertiary-hovered']
    if (variant === 'menu-caution') return tokens.surface['button-caution-hovered']
    return {}
  })()
  const surfacePressed = ((): CSSObject => {
    if (variant === 'primary') return tokens.surface['button-primary-pressed']
    if (variant === 'secondary') return tokens.surface['button-secondary-pressed']
    if (variant === 'tertiary') return tokens.surface['button-tertiary-hovered']
    if (variant === 'optional') return tokens.surface['button-optional-hovered']
    if (variant === 'danger') return tokens.surface['button-danger-hovered']
    if (variant === 'caution') return tokens.surface['button-caution-hovered']
    if (variant === 'menu-default') return tokens.surface['button-tertiary-hovered']
    if (variant === 'menu-caution') return tokens.surface['button-caution-hovered']
    return {}
  })()
  const surfaceSelected = ((): CSSObject => {
    if (variant === 'primary') return tokens.surface['button-primary-selected']
    if (variant === 'secondary') return tokens.surface['button-secondary-pressed']
    if (variant === 'tertiary') return tokens.surface['button-tertiary-hovered']
    if (variant === 'optional') return tokens.surface['button-optional-hovered']
    if (variant === 'danger') return tokens.surface['button-danger-hovered']
    if (variant === 'caution') return tokens.surface['button-caution-hovered']
    if (variant === 'menu-default') return tokens.surface['button-tertiary-hovered']
    if (variant === 'menu-caution') return tokens.surface['button-caution-hovered']
    return {}
  })()
  const noopProps = ((): CSSObject => {
    const noopColor = tokens.color['text-subtle']
    if (isSolid) return { backgroundColor: noopColor, borderColor: noopColor }
    if (isOutline) return { color: noopColor, backgroundColor: 'transparent', borderColor: noopColor }
    if (isTextOnly || isMenuItem) return { color: noopColor }
    return {}
  })()

  const crosshairSelector = '& > span:nth-child(1)'
  const surfaceSelector = '& > span:nth-child(2)'
  const crosshairCss: CSSObject = {
    position: 'absolute',
    inset: 0,
  }
  const surfaceCss: CSSObject = {
    ...(isPressed ? surfacePressed : isSelected ? surfaceSelected : surfaceDefault),
    ...(isNoop ? noopProps : {}),
    ...(noCorners ? { borderRadius: tokens.radius['full'] } : {}),
    position: 'relative',
    transition: 'all 0.3s ease',
    width: '100%',
    height: '100%',
    padding: noPadding ? 0 : `0 ${paddingX}`,
    ...(pressing ? { transform: 'scale(0.95)' } : {}),
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
    fontSize: fontSize,
    fontWeight: fontWeight,
    fill: 'currentColor',
    stroke: 'currentColor',
  }
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
    '--loader-size': `${spinnerSize} !important`,
    '--loader-color': `${isSolid ? tokens.color['text-inverse'] : tokens.color['text-subtle']} !important`,
  }
  const buttonCss: CSSObject = {
    position: 'relative',
    display: 'inline-flex',
    height: height,
    minHeight: height,
    borderRadius: surfaceCss.borderRadius,
    outlineOffset: `calc(1px + ${tokens.spacing['a11y-outline']})`, // CSS bug: outline offset overlaps border width
    opacity: isNoop ? 0.4 : 1,
    cursor: isNoop ? 'not-allowed' : 'pointer',
    '&:hover, &:focus':
      isNoop || pressing
        ? {}
        : {
            [surfaceSelector]: surfaceHovered,
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
      <span css={crosshairCss}></span>
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
    height,
    isMenuItem,
    isNoop,
    isPressed,
    isSolid,
  }
}
