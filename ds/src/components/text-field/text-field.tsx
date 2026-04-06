'use client'

import '@mantine/core/styles/Input.css'
import { useCallback, useEffect, useRef } from 'react'
import { useRefHandle } from '../../utilities/react-utils'
import { Keyboard } from '../../utilities/various-utils'
import { type InputElement, type TextFieldProps } from './_types'
import { useStyles } from './_use-styles'

export type { TextFieldHandle, TextFieldProps, TextFieldSize, TextFieldVariant } from './_types'

/** Basic text and textarea field component */
export const TextField = (props: TextFieldProps) => {
  const {
    ariaDescription,
    ariaLabel,
    className,
    disabled,
    id,
    invalid,
    maxLength,
    minRows: minRowsProp,
    maxRows: maxRowsProp,
    multiline,
    onBlur,
    onChange,
    onFocus,
    onSubmit,
    placeholder,
    prefix,
    readonly,
    ref,
    size = 'md',
    style,
    suffix,
    value,
    variant = 'default',
  } = props
  const inputRef = useRef<InputElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const isNoop = Boolean(disabled || readonly)
  const { cssInput, cssPrefix, cssRoot, cssSuffix } = useStyles({ ...props, isNoop, size, variant })

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent) => event.key === Keyboard.ENTER && onSubmit?.(event),
    [onSubmit],
  )

  const updateInputHeight = useCallback(() => {
    const elem = inputRef.current

    if (elem && multiline) {
      // Must set 'auto' to calculate real height
      elem.style.height = 'auto'
      // Calculate real height
      let height = elem.scrollHeight

      if (maxRowsProp) {
        const minRows = minRowsProp || 1
        const maxRows = maxRowsProp > minRows ? maxRowsProp : minRows
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
  }, [minRowsProp, maxRowsProp, multiline])

  const handleChange = useCallback(
    (event: ReactChangeEvent<InputElement>) => {
      onChange?.(event.target.value, event)
      updateInputHeight()
    },
    [minRowsProp, maxRowsProp, onChange, updateInputHeight],
  )

  useEffect(() => {
    if (multiline && inputRef.current) {
      inputRef.current.rows = minRowsProp || 1
      updateInputHeight()
    }
  }, [minRowsProp, maxRowsProp, multiline, updateInputHeight])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value || ''
      updateInputHeight()
    }
  }, [value, updateInputHeight])

  useRefHandle(
    ref,
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
    id: id,
    maxLength: maxLength || undefined,
    placeholder: placeholder,
    'aria-label': ariaLabel,
    'aria-description': ariaDescription,
    'aria-invalid': invalid,
    'aria-disabled': disabled,
    readOnly: isNoop,
    css: cssInput,
    onFocus: onFocus,
    onBlur: onBlur,
    onKeyDown: handleKeyDown,
    onChange: handleChange,
  }

  return (
    <div ref={wrapperRef} css={cssRoot} className={className} style={style}>
      {Boolean(prefix) && <div css={cssPrefix}>{prefix}</div>}

      {multiline ? <textarea rows={minRowsProp} {...bindings} /> : <input type="text" {...bindings} />}

      {Boolean(suffix) && <div css={cssSuffix}>{suffix}</div>}
    </div>
  )
}
