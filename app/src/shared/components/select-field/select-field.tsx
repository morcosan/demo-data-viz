import { useTranslation } from '@app-i18n'
import { type CSSObject } from '@emotion/react'
import { type ComboboxItem, Select, type SelectProps } from '@mantine/core'
import '@mantine/core/styles/CloseButton.css'
import '@mantine/core/styles/Combobox.css'
import '@mantine/core/styles/Popover.css'
import './select-field-styles.css'

export type SelectOption = ComboboxItem

interface Props {
  options: SelectOption[]
  value: string | null
  clearable?: boolean
  onChange?: (value: string | null) => void
}

export const SelectField = (props: Props) => {
  const { t } = useTranslation()

  const css: CSSObject = {
    '--input-height-sm': 'var(--ds-spacing-field-h-sm)',

    '& .mantine-Input-section': {
      justifyContent: 'end',
    },

    '& [data-combined-clear-section]': {
      gap: '0 !important',
      padding: '0 !important',
    },

    '& .mantine-Select-input': {
      cursor: 'default',
      border: '1px solid var(--ds-color-border-default)',
      backgroundColor: 'var(--ds-color-bg-field)',
      paddingRight: 'var(--ds-spacing-sm-6)',
      paddingLeft: 'var(--ds-spacing-xs-4)',
      pointerEvents: 'auto',
      color: 'var(--ds-color-text-default)',
      textOverflow: 'ellipsis',

      '&:focus': {
        border: '1px solid var(--ds-color-border-active)',
      },

      '&::placeholder': {
        color: 'var(--ds-color-text-placeholder)',
      },
    },

    '& .select-field--clear': {
      cursor: 'pointer',
      borderRadius: 'var(--ds-radius-full)',
      backgroundColor: 'transparent !important',
      color: 'var(--ds-color-text-subtle)',

      '&:hover': {
        backgroundColor: 'var(--ds-color-hover-text-default) !important',
      },
    },
  }

  const selectProps: SelectProps = {
    comboboxProps: { offset: 2 },
    classNames: {
      dropdown: 'select-field--dropdown',
      option: 'select-field--option',
    },
    clearButtonProps: {
      title: t('core.action.clearSelection'),
      className: 'select-field--clear',
    },
    withScrollArea: false,
    allowDeselect: false,
    clearable: props.clearable,
    css,
  }

  return <Select {...selectProps} data={props.options} defaultValue={props.value} onChange={props.onChange} />
}
