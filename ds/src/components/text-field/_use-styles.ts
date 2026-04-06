import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { CSS__ABSOLUTE_OVERLAY, CSS_A11Y_OUTLINE_PROXY } from '../../utilities/internal/css-utils'
import type { TextFieldProps } from './_types'

interface Props extends TextFieldProps {
  isNoop: boolean
}

export const useStyles = (props: Props) => {
  const { disabled, invalid, isNoop, multiline, readonly, size, variant } = props
  const { $fontSize, $color, $lineHeight, $spacing, $radius } = useThemeService()
  const ifNotNoop = (css: CSSObject) => (isNoop ? {} : css)

  const tokens = {
    minHeight: (() => {
      if (size === 'sm') return $spacing['field-h-sm']
      if (size === 'md') return $spacing['field-h-md']
      if (size === 'lg') return $spacing['field-h-lg']
      if (size === 'xl') return $spacing['field-h-xl']
      return ''
    })(),
    buttonPadding: (() => {
      if (size === 'sm') return `calc((${$spacing['field-h-sm']} - ${$spacing['button-h-xs']}) / 2)`
      if (size === 'md') return `calc((${$spacing['field-h-md']} - ${$spacing['button-h-sm']}) / 2)`
      if (size === 'lg') return `calc((${$spacing['field-h-lg']} - ${$spacing['button-h-sm']}) / 2)`
      if (size === 'xl') return `calc((${$spacing['field-h-xl']} - ${$spacing['button-h-md']}) / 2)`
      return ''
    })(),
    textPaddingX: (() => {
      if (size === 'sm') return $spacing['xs-4']
      if (size === 'md') return $spacing['xs-5']
      if (size === 'lg') return $spacing['xs-7']
      if (size === 'xl') return $spacing['xs-8']
      return ''
    })(),
    textPaddingY: (() => {
      if (size === 'sm') return $spacing['xs-2']
      if (size === 'md') return $spacing['xs-3']
      if (size === 'lg') return $spacing['xs-5']
      if (size === 'xl') return $spacing['xs-7']
      return ''
    })(),
    borderRadius: (() => {
      if (size === 'sm') return $radius['sm']
      if (size === 'md') return $radius['sm']
      if (size === 'lg') return $radius['md']
      if (size === 'xl') return $radius['md']
      return ''
    })(),
    borderColor: invalid ? $color['danger-page-text'] : readonly ? $color['border-subtle'] : $color['border-default'],
    borderColorHover: invalid ? $color['danger-page-text'] : $color['border-hover'],
    borderColorActive: (() => {
      if (invalid) return $color['danger-page-text']
      if (variant === 'default') return $color['border-active']
      if (variant === 'primary') return $color['primary-page-text']
      if (variant === 'secondary') return $color['secondary-page-text']
      return ''
    })(),
  }

  const cssRoot: CSSObject = {
    ...CSS_A11Y_OUTLINE_PROXY,
    position: 'relative',
    zIndex: 0,
    display: 'flex',
    alignItems: 'stretch',
    height: multiline ? 'unset' : tokens.minHeight,
    minHeight: tokens.minHeight,
    borderRadius: tokens.borderRadius,
    color: $color['text-placeholder'],

    '&::before': {
      ...CSS__ABSOLUTE_OVERLAY,
      content: `''`,
      zIndex: -1,
      borderWidth: '1px',
      borderColor: tokens.borderColor,
      borderRadius: tokens.borderRadius,
      background: readonly ? 'transparent' : $color['bg-field'],
      opacity: disabled ? 0.4 : 1,
    },

    ...ifNotNoop({
      '&:hover::before': { borderColor: tokens.borderColorHover },

      '&:has(input:focus), &:has(textarea:focus)': {
        color: $color['text-default'],

        '&::before, &:hover::before': {
          borderWidth: '2px',
          borderColor: tokens.borderColorActive,
        },
      },
    }),
  }
  const cssInput: CSSObject = {
    '--ds-spacing-scrollbar-w': $spacing['xs-1'],
    width: '100%',
    height: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    padding: `${tokens.textPaddingY} ${tokens.textPaddingX}`,
    borderRadius: tokens.borderRadius,
    background: 'transparent',
    color: $color['text-default'],
    lineHeight: $lineHeight['md'],
    fontSize: size === 'sm' ? $fontSize['sm'] : $fontSize['md'],
    opacity: disabled ? 0.4 : 1,
    resize: 'none',

    '&:focus-visible': {
      outline: 'none',
    },
    '&::placeholder': {
      color: $color['text-placeholder'],
      opacity: 1,
    },
  }
  const cssPrefix: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '100%',
    padding: tokens.buttonPadding,
    paddingRight: 0,
  }
  const cssSuffix: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '100%',
    padding: tokens.buttonPadding,
    paddingLeft: 0,
  }

  return {
    cssInput,
    cssPrefix,
    cssRoot,
    cssSuffix,
    tokens,
  }
}
