'use client'

import { type CSSObject } from '@emotion/react'
import { TextInput as MantineInput, Textarea as MantineTextarea, type TextareaProps } from '@mantine/core'
import '@mantine/core/styles/Input.css'
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useThemeService } from '../../services/theme-service.tsx'
import { CSS__ABSOLUTE_OVERLAY, CSS_A11Y_OUTLINE_PROXY } from '../../utilities/internal/css-utils.ts'
import { useDefaults } from '../../utilities/react-utils.tsx'
import { Keyboard } from '../../utilities/various-utils.ts'
import { type InputElement, type TextFieldProps, type TextFieldRef } from './_types.ts'

export type { TextFieldProps, TextFieldRef, TextFieldSize, TextFieldVariant } from './_types.ts'

/** Basic text and textarea field component */
export const TextField = (rawProps: TextFieldProps) => {
  const props = useDefaults(rawProps, {
    variant: 'default',
    size: 'md',
  })
  const { onSubmit, onChange: onChangeProp } = props
  const { $fontSize, $color, $lineHeight, $spacing, $radius } = useThemeService()
  const [value, setValue] = useState(props.value)
  const inputRef = useRef<InputElement>(null)
  const isNoop = props.disabled || props.readonly
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
    display: 'inline-flex',
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

  const inputBindings = {
    maxLength: props.maxLength || undefined,
    placeholder: props.placeholder,
    'aria-label': props.ariaLabel,
    'aria-description': props.ariaDescription,
    'aria-invalid': props.invalid,
    'aria-disabled': props.disabled,
    readOnly: isNoop,
  }

  const cssMantine: CSSObject = {
    '.mantine-Input-wrapper': {
      ...cssRoot,
      width: '100%',
      height: props.multiline ? '100%' : tokens.minHeight,
    },
    '.mantine-Input-input': {
      ...cssInput,
      border: 'unset',
    },
    '.mantine-Input-section': {
      position: 'unset',
      width: 'unset',
      color: 'unset',
    },
    '.mantine-Input-section[data-position="left"]': cssPrefix,
    '.mantine-Input-section[data-position="right"]': cssSuffix,
  }

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent) => event.key === Keyboard.ENTER && onSubmit?.(event),
    [onSubmit],
  )

  const handleChange = useCallback(
    (event: ReactChangeEvent<InputElement>) => {
      setValue(event.target.value)
      onChangeProp?.(event.target.value, event)
    },
    [onChangeProp],
  )

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const methods: TextFieldRef = {
    setValue: (value: string) => inputRef.current && (inputRef.current.value = value || ''),
    getValue: () => inputRef.current?.value || '',
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
  }
  useImperativeHandle(props.ref, () => ({
    ...methods,
    setValue: (value: string) => setValue(value),
    getValue: () => value || '',
  }))

  const bindings = {
    ...inputBindings,
    ref: inputRef,
    id: props.id,
    value: value,
    leftSection: props.prefix,
    rightSection: props.suffix,
    className: props.className,
    css: cssMantine,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
  }
  const bindingsForTextArea: TextareaProps = {
    ...bindings,
    autosize: true,
    minRows: props.minRows,
    maxRows: props.maxRows || undefined,
  }

  return props.multiline ? <MantineTextarea {...bindingsForTextArea} /> : <MantineInput {...bindings} />
}
