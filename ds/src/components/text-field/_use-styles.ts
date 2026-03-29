import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { CSS__ABSOLUTE_OVERLAY, CSS_A11Y_OUTLINE_PROXY } from '../../utilities/internal/css-utils'
import type { TextFieldProps } from './_types'

export const useStyles = (props: TextFieldProps, isNoop: boolean) => {
  const { $fontSize, $color, $lineHeight, $spacing, $radius } = useThemeService()
  const ifNotNoop = (css: CSSObject) => (isNoop ? {} : css)

  const tokens = {
    minHeight: (() => {
      if (props.size === 'sm') return $spacing['field-h-sm']
      if (props.size === 'md') return $spacing['field-h-md']
      if (props.size === 'lg') return $spacing['field-h-lg']
      if (props.size === 'xl') return $spacing['field-h-xl']
      return ''
    })(),
    buttonPadding: (() => {
      if (props.size === 'sm') return `calc((${$spacing['field-h-sm']} - ${$spacing['button-h-xs']}) / 2)`
      if (props.size === 'md') return `calc((${$spacing['field-h-md']} - ${$spacing['button-h-sm']}) / 2)`
      if (props.size === 'lg') return `calc((${$spacing['field-h-lg']} - ${$spacing['button-h-sm']}) / 2)`
      if (props.size === 'xl') return `calc((${$spacing['field-h-xl']} - ${$spacing['button-h-md']}) / 2)`
      return ''
    })(),
    textPaddingX: (() => {
      if (props.size === 'sm') return $spacing['xs-4']
      if (props.size === 'md') return $spacing['xs-5']
      if (props.size === 'lg') return $spacing['xs-7']
      if (props.size === 'xl') return $spacing['xs-8']
      return ''
    })(),
    textPaddingY: (() => {
      if (props.size === 'sm') return $spacing['xs-2']
      if (props.size === 'md') return $spacing['xs-3']
      if (props.size === 'lg') return $spacing['xs-5']
      if (props.size === 'xl') return $spacing['xs-7']
      return ''
    })(),
    borderRadius: (() => {
      if (props.size === 'sm') return $radius['sm']
      if (props.size === 'md') return $radius['sm']
      if (props.size === 'lg') return $radius['md']
      if (props.size === 'xl') return $radius['md']
      return ''
    })(),
    borderColor: props.invalid
      ? $color['danger-page-text']
      : props.readonly
        ? $color['border-subtle']
        : $color['border-default'],
    borderColorHover: props.invalid ? $color['danger-page-text'] : $color['border-hover'],
    borderColorActive: (() => {
      if (props.invalid) return $color['danger-page-text']
      if (props.variant === 'default') return $color['border-active']
      if (props.variant === 'primary') return $color['primary-page-text']
      if (props.variant === 'secondary') return $color['secondary-page-text']
      return ''
    })(),
  }

  const cssRoot: CSSObject = {
    ...CSS_A11Y_OUTLINE_PROXY,
    position: 'relative',
    zIndex: 0,
    display: 'flex',
    alignItems: 'stretch',
    height: props.multiline ? 'unset' : tokens.minHeight,
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
      background: props.readonly ? 'transparent' : $color['bg-field'],
      opacity: props.disabled ? 0.4 : 1,
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
    paddingTop: `calc(${tokens.textPaddingY} + 2px)`, // The text inside doesn't look centered with the new font
    borderRadius: tokens.borderRadius,
    background: 'transparent',
    color: $color['text-default'],
    lineHeight: $lineHeight['md'],
    fontSize: props.size === 'sm' ? $fontSize['sm'] : $fontSize['md'],
    opacity: props.disabled ? 0.4 : 1,
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
