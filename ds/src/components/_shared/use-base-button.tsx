import { type CSSObject } from '@emotion/react'
import { Loader } from '@mantine/core'
import '@mantine/core/styles/Loader.css'
import { type CSSProperties, type ReactNode } from 'react'
import { useThemeService } from '../../services/theme-service'
import { useDataProps } from '../../utilities/react-utils'
import { type LinkType } from './types'
import { type ClickableState, useClickable } from './use-clickable'

export type BaseButtonState = ClickableState
export type BaseButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type BaseVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'optional'
  | 'danger'
  | 'caution'
  | 'menu-default'
  | 'menu-caution'

interface BaseButtonProps extends HtmlDataProps {
  // Slots
  children: ReactNode
  tooltip?: string
  ariaDescription?: string

  // Props
  size: BaseButtonSize
  variant: BaseVariant
  state: BaseButtonState
  linkHref?: string
  linkType?: LinkType
  className?: string
  style?: CSSProperties
}

export const useBaseButton = (props: BaseButtonProps) => {
  const { ariaDescription, children, className, size, style, tooltip, state, variant } = props
  const { tokens } = useThemeService()
  const { bindings: clickableBindings, isNoop, isPressed, pressing } = useClickable(props)
  const dataProps = useDataProps(props)

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
  const surfaceHover = ((): CSSObject => {
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
  const surfacePress = ((): CSSObject => {
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
  const noopProps = ((): CSSObject => {
    const noopColor = tokens.color['text-subtle']
    if (isSolid) return { backgroundColor: noopColor, borderColor: noopColor }
    if (isOutline) return { color: noopColor, backgroundColor: 'transparent', borderColor: noopColor }
    if (isTextOnly || isMenuItem) return { color: noopColor }
    return {}
  })()

  const buttonBaseCss: CSSObject = {
    ...(isPressed ? surfacePress : surfaceDefault),
    ...(isNoop ? noopProps : {}),
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    lineHeight: 1,
    fill: 'currentColor',
    stroke: 'currentColor',
    height: height,
    minHeight: height,
    outlineOffset: `calc(1px + ${tokens.spacing['a11y-outline']})`, // CSS bug: outline offset overlaps border width
    opacity: isNoop ? 0.4 : 1,
    cursor: isNoop ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    '&:hover, &:focus':
      isNoop || pressing
        ? {}
        : {
            ...surfaceHover,
            transform: 'translateY(-2px)',
          },
  }
  const childrenCss: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMenuItem ? 'unset' : 'center',
    textAlign: isMenuItem ? 'left' : 'center',
    width: '100%',
    opacity: state === 'loading' ? 0 : 1,
    pointerEvents: 'none',
    userSelect: 'none',
  }

  const bindings = {
    ...clickableBindings,
    title: tooltip,
    className: className,
    style: style,
    'aria-description': ariaDescription,
    css: buttonBaseCss,
    ...dataProps,
  }

  const spinnerSize = (() => {
    if (size === 'xs') return tokens.spacing['xs-5']
    if (size === 'sm') return tokens.spacing['xs-7']
    if (size === 'md') return tokens.spacing['xs-9']
    if (size === 'lg') return tokens.spacing['sm-0']
    return ''
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
    '--loader-size': `${spinnerSize} !important`,
    '--loader-color': `${isSolid ? tokens.color['text-inverse'] : tokens.color['text-subtle']} !important`,
  }

  const content = (
    <>
      <span css={childrenCss}>{children}</span>

      {state === 'loading' && (
        <span css={spinnerCss}>
          <Loader css={spinnerIconCss} />
        </span>
      )}
    </>
  )

  return {
    bindings,
    buttonBaseCss,
    content,
    height,
    isMenuItem,
    isNoop,
    isPressed,
    isSolid,
  }
}
