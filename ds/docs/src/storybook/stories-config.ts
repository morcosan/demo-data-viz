import { type ArgTypes, type InputType } from 'storybook/internal/types'
import { fn } from 'storybook/test'

// Keep for later: Storybook v10 cannot load JSDoc for methods
// type RefInstance<C> = JsxProps<C> extends { ref?: Ref<infer R> } ? NonNullable<R> : never
// type MethodKeys<C> = Array<keyof RefInstance<C>>

type PropKeys<C> = Array<keyof JsxProps<C>>
type ControlType =
  | 'object'
  | 'boolean'
  | 'check'
  | 'inline-check'
  | 'radio'
  | 'inline-radio'
  | 'select'
  | 'multi-select'
  | 'number'
  | 'range'
  | 'file'
  | 'color'
  | 'date'
  | 'text'
  | Array<string | number>
  | false

type Defaults<C> = Partial<JsxProps<C>>
type ArgsConfig<C> = {
  slots?: Defaults<C>
  props?: Defaults<C>
  events?: PropKeys<C>
  inlineRadios?: PropKeys<C>
  noDefaults?: PropKeys<C>
  hasMethods?: boolean
}

type ControlParam = {
  header: string
  control?: ControlType
  value?: unknown
}

const defineArgDefault = (value: unknown): string => (typeof value === 'string' ? `'${value}'` : String(value))
const defineArgType = ({ control, header, value }: ControlParam): InputType => ({
  control,
  table: {
    category: header,
    defaultValue: value ? { summary: defineArgDefault(value) } : undefined,
  },
})

const defineArgs = <C>({ slots, props, events, hasMethods, noDefaults, inlineRadios }: ArgsConfig<C>) => {
  const argTypes: ArgTypes = {}

  Object.keys(slots || {}).forEach(
    (key: string) => (argTypes[key] = defineArgType({ header: 'Slots', control: 'text' })),
  )
  Object.entries(props || {}).forEach(([key, value]: [string, unknown]) => {
    const cKey = key as keyof JsxProps<C>
    argTypes[key] = defineArgType({
      header: 'Props',
      control: inlineRadios?.includes(cKey) ? 'inline-radio' : undefined,
      value: noDefaults?.includes(cKey) ? undefined : value,
    })
  })
  events?.forEach((key: keyof JsxProps<C>) => (argTypes[key as string] = defineArgType({ header: 'Events' })))
  hasMethods && (argTypes['ref'] = defineArgType({ header: 'Methods', control: false }))

  return {
    argTypes,
    args: {
      ...(slots || {}),
      ...(props || {}),
      ...events?.reduce((acc, event) => ({ ...acc, [event]: fn() }), {}),
    },
  }
}

const defineMeta = <C>(component: C, config: ArgsConfig<C>) => ({ component, ...defineArgs(config) })

export { defineMeta }
