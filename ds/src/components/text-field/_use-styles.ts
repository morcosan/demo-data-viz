import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { CSS__ABSOLUTE_OVERLAY, CSS_A11Y_OUTLINE_PROXY } from '../../utilities/internal/css-utils'
import type { TextFieldProps } from './_types'

interface Props extends TextFieldProps {
  isNoop: boolean
}

export const useStyles = (props: Props) => {
  const { disabled, invalid, isNoop, multiline, readonly, size, variant } = props
  const { tokens } = useThemeService()
  const ifNotNoop = (css: CSSObject) => (isNoop ? {} : css)

  const cssVars = {
    minHeight: (() => {
      if (size === 'sm') return tokens.spacing['field-h-sm']
      if (size === 'md') return tokens.spacing['field-h-md']
      if (size === 'lg') return tokens.spacing['field-h-lg']
      if (size === 'xl') return tokens.spacing['field-h-xl']
      return ''
    })(),
    buttonPadding: (() => {
      if (size === 'sm') return `calc((${tokens.spacing['field-h-sm']} - ${tokens.spacing['button-h-xs']}) / 2)`
      if (size === 'md') return `calc((${tokens.spacing['field-h-md']} - ${tokens.spacing['button-h-sm']}) / 2)`
      if (size === 'lg') return `calc((${tokens.spacing['field-h-lg']} - ${tokens.spacing['button-h-sm']}) / 2)`
      if (size === 'xl') return `calc((${tokens.spacing['field-h-xl']} - ${tokens.spacing['button-h-md']}) / 2)`
      return ''
    })(),
    textPaddingX: (() => {
      if (size === 'sm') return tokens.spacing['xs-4']
      if (size === 'md') return tokens.spacing['xs-5']
      if (size === 'lg') return tokens.spacing['xs-7']
      if (size === 'xl') return tokens.spacing['xs-8']
      return ''
    })(),
    textPaddingY: (() => {
      if (size === 'sm') return tokens.spacing['xs-2']
      if (size === 'md') return tokens.spacing['xs-3']
      if (size === 'lg') return tokens.spacing['xs-5']
      if (size === 'xl') return tokens.spacing['xs-7']
      return ''
    })(),
    borderRadius: (() => {
      if (size === 'sm') return tokens.radius['sm']
      if (size === 'md') return tokens.radius['sm']
      if (size === 'lg') return tokens.radius['md']
      if (size === 'xl') return tokens.radius['md']
      return ''
    })(),
    borderColor: invalid
      ? tokens.color['danger-page-text']
      : readonly
        ? tokens.color['border-subtle']
        : tokens.color['border-default'],
    borderColorHover: invalid ? tokens.color['danger-page-text'] : tokens.color['border-hover'],
    borderColorActive: (() => {
      if (invalid) return tokens.color['danger-page-text']
      if (variant === 'default') return tokens.color['border-active']
      if (variant === 'primary') return tokens.color['primary-page-text']
      if (variant === 'secondary') return tokens.color['secondary-page-text']
      return ''
    })(),
  }

  const rootCss: CSSObject = {
    ...CSS_A11Y_OUTLINE_PROXY,
    position: 'relative',
    zIndex: 0,
    display: 'flex',
    alignItems: 'stretch',
    height: multiline ? 'unset' : cssVars.minHeight,
    minHeight: cssVars.minHeight,
    borderRadius: cssVars.borderRadius,
    color: tokens.color['text-placeholder'],

    '&::before': {
      ...CSS__ABSOLUTE_OVERLAY,
      content: `''`,
      zIndex: -1,
      borderWidth: '1px',
      borderColor: cssVars.borderColor,
      borderRadius: cssVars.borderRadius,
      background: readonly ? 'transparent' : tokens.color['bg-field'],
      opacity: disabled ? 0.4 : 1,
    },

    ...ifNotNoop({
      '&:hover::before': { borderColor: cssVars.borderColorHover },

      '&:has(input:focus), &:has(textarea:focus)': {
        color: tokens.color['text-default'],

        '&::before, &:hover::before': {
          borderWidth: '2px',
          borderColor: cssVars.borderColorActive,
        },
      },
    }),
  }
  const inputCss: CSSObject = {
    '--ds-spacing-scrollbar-w': tokens.spacing['xs-1'],
    width: '100%',
    height: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    padding: `${cssVars.textPaddingY} ${cssVars.textPaddingX}`,
    borderRadius: cssVars.borderRadius,
    background: 'transparent',
    color: tokens.color['text-default'],
    lineHeight: tokens.lineHeight['md'],
    fontSize: size === 'sm' ? tokens.fontSize['sm'] : tokens.fontSize['md'],
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : undefined,
    resize: 'none',

    '&:focus-visible': {
      outline: 'none',
    },
    '&::placeholder': {
      color: tokens.color['text-placeholder'],
      opacity: 1,
    },
  }
  const prefixCss: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '100%',
    padding: cssVars.buttonPadding,
    paddingRight: 0,
  }
  const suffixCss: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '100%',
    padding: cssVars.buttonPadding,
    paddingLeft: 0,
  }

  return {
    cssVars,
    inputCss,
    prefixCss,
    rootCss,
    suffixCss,
  }
}
