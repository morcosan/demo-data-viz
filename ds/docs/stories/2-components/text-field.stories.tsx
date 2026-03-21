import {
  IconButton,
  type IconButtonSize,
  type IconButtonVariant,
  Keyboard,
  SendSvg,
  TextField,
  type TextFieldHandle,
  type TextFieldProps,
  type TextFieldSize,
} from '@ds/core'
import { defineMeta, DocsPage } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { createRef } from 'react'

const storyRef = createRef<TextFieldHandle | null>()
const meta: Meta = {
  title: 'Components / Text Field',
  ...defineMeta(TextField, {
    slots: {
      value: '',
      placeholder: 'Type some text',
      ariaLabel: 'Example label',
      ariaDescription: 'Example description',
      prefix: '',
      suffix: '',
    },
    props: {
      id: 'example-id',
      variant: 'default',
      size: 'md',
      maxLength: 0,
      multiline: false,
      minRows: 0,
      maxRows: 0,
      readonly: false,
      disabled: false,
      invalid: false,
      className: '',
      style: {},
    },
    events: ['onChange', 'onSubmit', 'onFocus', 'onBlur'],
    inlineRadios: ['variant', 'size'],
    hasMethods: true,
    shortcuts: [
      {
        keys: [Keyboard.ALT, Keyboard.DIGIT_1],
        label: `setValue('test')`,
        fn: () => storyRef.current?.setValue('test'),
      },
      {
        keys: [Keyboard.ALT, Keyboard.DIGIT_2],
        label: `getValue()`,
        fn: () => alert(storyRef.current?.getValue()),
      },
      {
        keys: [Keyboard.ALT, Keyboard.DIGIT_3],
        label: `focus()`,
        fn: () => storyRef.current?.focus(),
      },
      {
        keys: [Keyboard.ALT, Keyboard.DIGIT_4],
        label: `blur()`,
        fn: () => storyRef.current?.blur(),
      },
    ],
    render: (props: TextFieldProps) => <TextField {...props} ref={storyRef} />,
  }),
}

const Default: StoryObj<typeof TextField> = {
  tags: ['autodocs', 'controls'],
}

const Variants: StoryObj<typeof TextField> = {
  decorators: [
    () => {
      const getSlot = (size: IconButtonSize, variant?: IconButtonVariant) => (
        <IconButton tooltip="Tooltip" size={size} variant={variant}>
          <SendSvg className="h-xs-5" />
        </IconButton>
      )

      const fieldSizes: TextFieldSize[] = ['sm', 'md', 'lg', 'xl']
      const buttonSizes: IconButtonSize[] = ['xs', 'sm', 'sm', 'md']
      const multilines = [false, true]

      return (
        <DocsPage type="component">
          <label className="gap-xs-7 p-sm-0 flex flex-wrap items-center" onClick={(e) => e.preventDefault()}>
            <span className="sr-only">Label</span>

            {fieldSizes.map((size, index) => (
              <div key={size} className="mb-xs-7 gap-xs-7 flex flex-wrap">
                {multilines.map((multiline) => (
                  <div key={multiline ? 1 : 0} className="gap-xs-7 flex w-full flex-wrap items-center">
                    <TextField
                      id={`${size}1`}
                      size={size}
                      placeholder={`${multiline ? 'Multiline' : 'Default'} - ${size}`}
                      multiline={multiline}
                      className="flex-1"
                    />
                    <TextField
                      id={`${size}2`}
                      size={size}
                      placeholder={`${multiline ? 'Multiline' : 'Default'} - ${size}`}
                      prefix={getSlot(buttonSizes[index])}
                      multiline={multiline}
                      className="flex-1"
                    />
                    <TextField
                      id={`${size}3`}
                      size={size}
                      placeholder={`${multiline ? 'Multiline' : 'Default'} - ${size}`}
                      suffix={
                        <>
                          {getSlot(buttonSizes[index])}
                          {getSlot(buttonSizes[index])}
                        </>
                      }
                      multiline={multiline}
                      className="flex-1"
                    />
                    <TextField
                      id={`${size}4`}
                      size={size}
                      placeholder={`${multiline ? 'Multiline' : 'Default'} - ${size}`}
                      suffix={getSlot(buttonSizes[index], 'solid-primary')}
                      multiline={multiline}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            ))}

            <div className="gap-xs-7 flex w-full flex-wrap items-center">
              <TextField id="default" placeholder="Default" className="flex-1" />
              <TextField id="readonly" value="Readonly value" className="flex-1" readonly />
              <TextField id="readonly" placeholder="Readonly placeholder" className="flex-1" readonly />
              <TextField id="disabled" value="Disabled value" className="flex-1" disabled />
              <TextField id="disabled" placeholder="Disabled placeholder" className="flex-1" disabled />
            </div>

            <div className="gap-xs-7 flex w-full flex-wrap items-center">
              <TextField id="default-multiline" placeholder={'Default\nMultiline'} className="flex-1" multiline />
              <TextField
                id="readonly-multiline"
                value={'Readonly value\nMultiline'}
                className="flex-1"
                multiline
                readonly
              />
              <TextField
                id="readonly-multiline"
                placeholder={'Readonly placeholder\nMultiline'}
                className="flex-1"
                multiline
                readonly
              />
              <TextField
                id="disabled-multiline"
                value={'Disabled value\nMultiline'}
                className="flex-1"
                multiline
                disabled
              />
              <TextField
                id="disabled-multiline"
                placeholder={'Disabled placeholder\nMultiline'}
                className="flex-1"
                multiline
                disabled
              />
            </div>

            <div className="gap-xs-7 flex w-full flex-wrap items-center">
              <TextField
                id="variant-default"
                variant="default"
                placeholder="Variant - default"
                suffix={getSlot('sm', 'text-default')}
                className="flex-1"
              />
              <TextField
                id="variant-primary"
                variant="primary"
                placeholder="Variant - primary"
                suffix={getSlot('sm', 'solid-primary')}
                className="flex-1"
              />
              <TextField
                id="variant-secondary"
                variant="secondary"
                placeholder="Variant - secondary"
                suffix={getSlot('sm', 'solid-secondary')}
                className="flex-1"
              />
            </div>
          </label>
        </DocsPage>
      )
    },
  ],
}

export default meta
export { Default, Variants }
