import { type CSSObject } from '@emotion/react'
import { Loader } from '@mantine/core'
import '@mantine/core/styles/Loader.css'
import { type CSSProperties, type ReactNode } from 'react'
import { useThemeService } from '../../services/theme-service'
import { useDataProps } from '../../utilities/react-utils'
import { type LinkType } from './types'
import { useClickable } from './use-clickable'

export type BaseButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type BaseButtonHighlight = 'default' | 'pressed' | 'selected'

export type BaseVariant =
  | 'solid-primary'
  | 'solid-secondary'
  | 'solid-danger'
  | 'ghost-primary'
  | 'ghost-secondary'
  | 'ghost-danger'
  | 'text-default'
  | 'text-subtle'
  | 'text-danger'
  | 'item-solid-secondary'
  | 'item-text-default'
  | 'item-text-danger'

type Variant = BaseVariant | undefined

const VARIANTS_DANGER: Variant[] = ['solid-danger', 'ghost-danger', 'text-danger', 'item-text-danger']
const VARIANTS_DEFAULT: Variant[] = ['text-default', 'item-text-default']
const VARIANTS_GHOST: Variant[] = ['ghost-primary', 'ghost-secondary', 'ghost-danger']
const VARIANTS_ITEM: Variant[] = ['item-text-default', 'item-text-danger', 'item-solid-secondary']
const VARIANTS_PRIMARY: Variant[] = ['solid-primary', 'ghost-primary']
const VARIANTS_SECONDARY: Variant[] = ['solid-secondary', 'ghost-secondary', 'item-solid-secondary']
const VARIANTS_SOLID: Variant[] = ['solid-primary', 'solid-secondary', 'solid-danger', 'item-solid-secondary']
const VARIANTS_SUBTLE: Variant[] = ['text-subtle']
const VARIANTS_TEXT: Variant[] = ['text-default', 'text-subtle', 'text-danger', 'item-text-default', 'item-text-danger']

interface BaseButtonProps extends HtmlDataProps {
  // Slots
  children: ReactNode
  tooltip?: string
  ariaDescription?: string

  // Props
  size?: BaseButtonSize
  variant?: BaseVariant
  highlight?: BaseButtonHighlight
  loading?: boolean
  disabled?: boolean
  linkHref?: string
  linkType?: LinkType
  className?: string
  style?: CSSProperties
}

export const useBaseButton = (props: BaseButtonProps) => {
  const { ariaDescription, children, className, highlight, loading, size, style, tooltip, variant } = props
  const { tokens } = useThemeService()
  const { bindings: clickableBindings, isNoop, isPressed } = useClickable(props)
  const dataProps = useDataProps(props)

  const isVDanger = VARIANTS_DANGER.includes(variant)
  const isVDefault = VARIANTS_DEFAULT.includes(variant)
  const isVGhost = VARIANTS_GHOST.includes(variant)
  const isVItem = VARIANTS_ITEM.includes(variant)
  const isVPrimary = VARIANTS_PRIMARY.includes(variant)
  const isVSecondary = VARIANTS_SECONDARY.includes(variant)
  const isVSolid = VARIANTS_SOLID.includes(variant)
  const isVSubtle = VARIANTS_SUBTLE.includes(variant)
  const isVText = VARIANTS_TEXT.includes(variant)

  const baseCssVars = {
    size: (() => {
      if (size === 'xs') return tokens.spacing['button-h-xs']
      if (size === 'sm') return tokens.spacing['button-h-sm']
      if (size === 'md') return tokens.spacing['button-h-md']
      if (size === 'lg') return tokens.spacing['button-h-lg']
      return ''
    })(),
    bgColor: (() => {
      if (isVSolid) {
        if (isNoop) return tokens.color['text-subtle']
        if (isVPrimary) return tokens.color['primary-button-bg']
        if (isVSecondary) return tokens.color['secondary-button-bg']
        if (isVDanger) return tokens.color['danger-button-bg']
      }
      return 'transparent'
    })(),
    borderColor: (() => {
      if (isVGhost) {
        if (isNoop) return tokens.color['text-subtle']
        if (isVPrimary) return tokens.color['primary-page-text']
        if (isVSecondary) return tokens.color['secondary-page-text']
        if (isVDanger) return tokens.color['danger-page-text']
      }
      if (isVSolid) {
        if (isNoop) return tokens.color['text-subtle']
        if (isVPrimary) return tokens.color['primary-button-bg']
        if (isVSecondary) return tokens.color['secondary-button-bg']
        if (isVDanger) return tokens.color['danger-button-bg']
      }
      return 'transparent'
    })(),
    textColor: (() => {
      if (isVSolid) {
        if (isNoop) return tokens.color['white']
        if (isVPrimary) return tokens.color['primary-button-text']
        if (isVSecondary) return tokens.color['secondary-button-text']
        if (isVDanger) return tokens.color['danger-button-text']
      }
      if (isNoop) return tokens.color['text-subtle']
      if (isVGhost) {
        if (isVPrimary) return tokens.color['primary-page-text']
        if (isVSecondary) return tokens.color['secondary-page-text']
        if (isVDanger) return tokens.color['danger-page-text']
      }
      if (isVDanger) return tokens.color['danger-page-text']
      if (isVDefault) return tokens.color['text-default']
      if (isVSubtle) return tokens.color['text-subtle']
      return ''
    })(),
    hoverBgColor: (() => {
      if (isNoop) return 'transparent'
      if (highlight === 'default') {
        if (isVText || isVGhost) return tokens.color['hover-text-default']
        if (isVPrimary) return tokens.color['primary-hover-default']
        if (isVSecondary) return tokens.color['secondary-hover-default']
        if (isVDanger) return tokens.color['danger-hover-default']
      }
      return ''
    })(),
    pressBgColor: (() => {
      if (isNoop || highlight === 'selected') return 'transparent'
      if (isPressed || highlight === 'pressed') {
        if (isVText || isVGhost) return tokens.color['hover-text-pressed']
        if (isVPrimary) return tokens.color['primary-hover-pressed']
        if (isVSecondary) return tokens.color['secondary-hover-pressed']
        if (isVDanger) return tokens.color['danger-hover-pressed']
      }
      return ''
    })(),
    pressTransform: isPressed && highlight === 'default' ? 'translateY(1px)' : 'unset',
    outlineOffset: `calc(1px + ${tokens.spacing['a11y-outline']})`, // CSS bug: outline offset overlaps border width
    opacity: isNoop ? 0.4 : 1,
    cursor: isNoop ? 'not-allowed' : 'pointer',
  }

  const buttonBaseCss: CSSObject = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    lineHeight: 1,
    height: baseCssVars.size,
    minHeight: baseCssVars.size,
    border: `1px solid ${baseCssVars.borderColor}`,
    backgroundColor: baseCssVars.bgColor,
    opacity: baseCssVars.opacity,
    color: baseCssVars.textColor,
    fill: 'currentColor',
    stroke: 'currentColor',
    outlineOffset: baseCssVars.outlineOffset,
    cursor: baseCssVars.cursor,
    verticalAlign: 'middle',
    transform: baseCssVars.pressTransform,

    '&::before, &::after': {
      content: `''`,
      position: 'absolute',
      top: '-1px',
      left: '-1px',
      right: '-1px',
      bottom: '-1px',
    },
    '&::before': isVSolid && !isNoop ? { border: `1px solid ${tokens.color['black-alpha-3']}` } : {},
    '&::after': { backgroundColor: `${baseCssVars.pressBgColor} !important` },
    '&:hover::after, &:focus::after': { backgroundColor: baseCssVars.hoverBgColor },
  }
  const childrenCss: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isVItem ? 'unset' : 'center',
    width: '100%',
    opacity: loading ? 0 : 1,
    pointerEvents: 'none',
    userSelect: 'none',
    textAlign: isVItem ? 'left' : 'center',
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
    '--loader-color': `${isVSolid ? tokens.color['text-inverse'] : tokens.color['text-subtle']} !important`,
  }

  const content = (
    <>
      <span css={childrenCss}>{children}</span>

      {Boolean(loading) && (
        <span css={spinnerCss}>
          <Loader css={spinnerIconCss} />
        </span>
      )}
    </>
  )

  return {
    baseCssVars,
    bindings,
    buttonBaseCss,
    content,
    isNoop,
    isPressed,
    isVDanger,
    isVDefault,
    isVGhost,
    isVItem,
    isVPrimary,
    isVSecondary,
    isVSolid,
    isVSubtle,
    isVText,
  }
}
