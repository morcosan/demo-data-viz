'use client'

import '@mantine/core/styles/Input.css'
import { useCallback, useEffect, useRef } from 'react'
import { useDefaults, useRefHandle } from '../../utilities/react-utils'
import { Keyboard } from '../../utilities/various-utils'
import { type InputElement, type TextFieldProps } from './_types'
import { useStyles } from './_use-styles'

export type { TextFieldHandle, TextFieldProps, TextFieldSize, TextFieldVariant } from './_types'

/** Basic text and textarea field component */
export const TextField = (rawProps: TextFieldProps) => {
  const props = useDefaults(rawProps, {
    variant: 'default',
    size: 'md',
  })
  const { onSubmit, onChange } = props
  const inputRef = useRef<InputElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const isNoop = Boolean(props.disabled || props.readonly)
  const { cssInput, cssPrefix, cssRoot, cssSuffix } = useStyles(props, isNoop)

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent) => event.key === Keyboard.ENTER && onSubmit?.(event),
    [onSubmit],
  )

  const updateInputHeight = useCallback(() => {
    const elem = inputRef.current

    if (elem && props.multiline) {
      // Must set 'auto' to calculate real height
      elem.style.height = 'auto'
      // Calculate real height
      let height = elem.scrollHeight

      if (props.maxRows) {
        const minRows = props.minRows || 1
        const maxRows = props.maxRows > minRows ? props.maxRows : minRows
        const style = window.getComputedStyle(elem)
        const lineHeight = parseFloat(style.lineHeight)
        const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
        const maxHeight = lineHeight * maxRows + paddingY
        const minHeight = lineHeight + paddingY
        height = Math.min(Math.max(height, minHeight), maxHeight)
      }

      // Set real height
      elem.style.height = height + 'px'
    }
  }, [props.multiline, props.maxRows, props.minRows])

  const handleChange = useCallback(
    (event: ReactChangeEvent<InputElement>) => {
      onChange?.(event.target.value, event)
      updateInputHeight()
    },
    [props.minRows, props.maxRows, onChange, updateInputHeight],
  )

  useEffect(() => {
    if (props.multiline && inputRef.current) {
      inputRef.current.rows = props.minRows || 1
      updateInputHeight()
    }
  }, [props.minRows, props.maxRows, props.multiline, updateInputHeight])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = props.value || ''
      updateInputHeight()
    }
  }, [props.value, updateInputHeight])

  useRefHandle(
    props.ref,
    wrapperRef,
    {
      getValue: () => inputRef.current?.value || '',
      setValue: (value: string) => {
        inputRef.current && (inputRef.current.value = value || '')
        updateInputHeight()
      },
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    },
    [updateInputHeight],
  )

  const bindings = {
    ref: inputRef,
    id: props.id,
    maxLength: props.maxLength || undefined,
    placeholder: props.placeholder,
    'aria-label': props.ariaLabel,
    'aria-description': props.ariaDescription,
    'aria-invalid': props.invalid,
    'aria-disabled': props.disabled,
    readOnly: isNoop,
    css: cssInput,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onKeyDown: handleKeyDown,
    onChange: handleChange,
  }

  return (
    <div ref={wrapperRef} css={cssRoot} className={props.className} style={props.style}>
      {Boolean(props.prefix) && <div css={cssPrefix}>{props.prefix}</div>}

      {props.multiline ? <textarea rows={props.minRows} {...bindings} /> : <input type="text" {...bindings} />}

      {Boolean(props.suffix) && <div css={cssSuffix}>{props.suffix}</div>}
    </div>
  )
}
