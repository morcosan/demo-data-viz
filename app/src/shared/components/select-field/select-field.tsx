'use client'

import { useTranslation } from '@app-i18n'
import { ClassNames, css } from '@emotion/react'
import { Select, type ComboboxItem, type SelectProps as MantineSelectProps } from '@mantine/core'
import '@mantine/core/styles/CloseButton.css'
import '@mantine/core/styles/Combobox.css'
import '@mantine/core/styles/Popover.css'

export type SelectOption = ComboboxItem

export interface SelectFieldProps {
  options: SelectOption[]
  value: string | null
  placeholder?: string
  clearable?: boolean
  onChange?: (value: string | null) => void
}

export const SelectField = (props: SelectFieldProps) => {
  const { t } = useTranslation()

  const getSelectProps = (css: Function): MantineSelectProps => ({
    data: props.options,
    defaultValue: props.value,
    placeholder: props.placeholder,
    clearable: props.clearable,
    onChange: props.onChange,
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
    className: 'a11y-outline-proxy',
    classNames: {
      root: css`
        ${cssField.styles}
      `,
      dropdown: css`
        ${cssDropdown.styles}
      `,
    },
    clearButtonProps: { title: t('core.action.clearSelection') },
  })

  return <ClassNames>{({ css }) => <Select {...getSelectProps(css)} />}</ClassNames>
}

/************************************************************************************
 * CSS
 */

const cssField = css`
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
    padding-right: var(--ds-spacing-sm-6);
    padding-left: var(--ds-spacing-xs-4);
    pointer-events: auto;
    color: var(--ds-color-text-default);
    text-overflow: ellipsis;

    &:focus {
      border: 1px solid var(--ds-color-border-active);
    }

    &::placeholder {
      color: var(--ds-color-text-placeholder);
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

const cssDropdown = css`
  z-index: var(--ds-z-index-dropdown) !important;
  box-shadow: var(--ds-shadow-md);
  border: 1px solid var(--ds-color-border-subtle);
  background-color: var(--ds-color-bg-menu);
  padding: var(--ds-spacing-xs-1);
  overflow: auto;

  & .mantine-Select-option {
    position: relative;
    color: var(--ds-color-text-default);

    &:hover:not([data-combobox-disabled]) {
      background: var(--ds-color-hover-text-default);
    }

    &[data-combobox-selected] {
      background: var(--ds-color-secondary-button-bg) !important;
      color: var(--ds-color-secondary-button-text) !important;
    }

    & svg {
      opacity: 1;
    }
  }
`
