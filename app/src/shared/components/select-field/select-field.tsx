'use client'

import { useTranslation } from '@app-i18n'
import { ClassNames, css } from '@emotion/react'
import { Select, type ComboboxItem, type SelectProps } from '@mantine/core'
import '@mantine/core/styles/CloseButton.css'
import '@mantine/core/styles/Combobox.css'
import '@mantine/core/styles/Popover.css'
import { useEffect, useImperativeHandle, useRef } from 'react'

export type SelectOption = ComboboxItem
export type SelectValue = string | null

export interface SelectFieldProps extends ReactProps<HTMLInputElement> {
  id: string
  options: SelectOption[]
  value: SelectValue
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  ariaDescription?: string
  ariaDescribedBy?: string
  onChange?: (value: string | null) => void
}

export const SelectField = (props: SelectFieldProps) => {
  const {
    ariaDescribedBy,
    ariaDescription,
    className,
    clearable,
    disabled,
    id,
    onBlur,
    onChange,
    onFocus,
    options,
    placeholder,
    ref,
    style,
    value,
  } = props
  const { t } = useTranslation()
  const innerRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

  useEffect(() => {
    if (disabled) innerRef.current?.setAttribute('aria-disabled', String(disabled))
    if (ariaDescription) innerRef.current?.setAttribute('aria-description', ariaDescription)
    if (ariaDescribedBy) innerRef.current?.setAttribute('aria-describedby', ariaDescribedBy)
  }, [disabled, ariaDescribedBy, ariaDescription])

  const getSelectProps = (css: Function): SelectProps => ({
    id: id,
    data: options,
    value: value,
    placeholder: placeholder,
    clearable: clearable && !disabled,
    allowDeselect: false,
    withScrollArea: false,
    comboboxProps: {
      offset: 2,
      middlewares: {
        size: {
          apply({ availableHeight, elements }) {
            elements.floating.style.maxHeight = `min(400px, ${availableHeight}px)`
            elements.floating.style.minHeight = `min(200px, ${elements.floating.scrollHeight}px)`
          },
        },
      },
    },
    className: cx('a11y-outline-proxy', className),
    style: style,
    classNames: {
      root: css`
        ${fieldCss.styles}
      `,
      input: cx(clearable && !disabled && 'clearable', disabled && 'disabled'),
      dropdown: css`
        ${dropdownCss.styles}
      `,
    },
    clearButtonProps: { title: t('core.action.clearSelection') },
    onChange: onChange,
    onFocus: onFocus,
    onBlur: onBlur,
    onClickCapture: (event) => disabled && event.stopPropagation(),
    onKeyDownCapture: (event) => disabled && event.stopPropagation(),
  })

  return <ClassNames>{({ css }) => <Select {...getSelectProps(css)} ref={innerRef} />}</ClassNames>
}

/**********************************************************************************************************************
 * CSS
 */

const fieldCss = css`
  border-radius: var(--ds-radius-sm);

  & .mantine-Input-wrapper {
    --input-height-sm: var(--ds-spacing-field-h-sm);
  }

  & .mantine-Input-section {
    justify-content: end;
  }

  & [data-combined-clear-section] {
    gap: 0 !important;
    padding: 0 !important;
  }

  & .mantine-Select-input {
    cursor: default;
    border: 1px solid var(--ds-color-border-default);
    border-radius: var(--ds-radius-sm);
    background-color: var(--ds-color-bg-field);
    padding-right: var(--ds-spacing-sm-5);
    padding-left: var(--ds-spacing-xs-4);
    pointer-events: auto;
    color: var(--ds-color-text-default);
    text-overflow: ellipsis;

    &:not(.clearable) {
      padding-right: var(--ds-spacing-xs-8);
    }

    &:not(.disabled):focus {
      border: 1px solid var(--ds-color-border-active);
    }

    &::placeholder {
      color: var(--ds-color-text-placeholder);
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  & .mantine-InputClearButton-root {
    cursor: pointer;
    border-radius: var(--ds-radius-full);
    background-color: transparent !important;
    color: var(--ds-color-text-subtle);

    &:hover {
      background-color: var(--ds-color-hover-text-default) !important;
    }
  }
`

const dropdownCss = css`
  z-index: var(--ds-z-index-dropdown) !important;
  box-shadow: var(--ds-shadow-md) !important;
  border: 1px solid var(--ds-color-border-subtle) !important;
  background-color: var(--ds-color-bg-popup) !important;
  padding: var(--ds-spacing-xs-1) !important;
  overflow: auto !important;

  & .mantine-Select-option {
    position: relative !important;
    color: var(--ds-color-text-default) !important;

    &:hover:not([data-combobox-disabled]) {
      background: var(--ds-color-hover-text-default);
    }

    &[data-combobox-selected] {
      background: var(--ds-color-secondary-button-bg) !important;
      color: var(--ds-color-secondary-button-text) !important;
    }

    & svg {
      opacity: 1 !important;
      margin-top: -2px !important;
    }
  }
`
