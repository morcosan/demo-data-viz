import { useTranslation } from '@app-i18n'
import { type ComboboxItem, Select, type SelectProps } from '@mantine/core'
import '@mantine/core/styles/CloseButton.css'
import '@mantine/core/styles/Combobox.css'
import '@mantine/core/styles/Popover.css'
import './select-field-styles.css'

export type SelectOption = ComboboxItem

interface Props {
  options: SelectOption[]
  value: string | null
  onChange?: (value: string | null) => void
}

export const SelectField = (props: Props) => {
  const { t } = useTranslation()

  const selectProps: SelectProps = {
    comboboxProps: { offset: 2 },
    classNames: {
      wrapper: 'select-field',
      input: 'select-field--input',
      dropdown: 'select-field--dropdown',
      option: 'select-field--option',
    },
    clearButtonProps: {
      title: t('core.action.clearSelection'),
      className: 'select-field--clear',
    },
    withScrollArea: false,
    allowDeselect: false,
    clearable: false,
  }

  return <Select {...selectProps} data={props.options} defaultValue={props.value} onChange={props.onChange} />
}
