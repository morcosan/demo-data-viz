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
type ArgsParam<C> = {
	args: {
		slots?: Defaults<C>
		props?: Defaults<C>
		events?: PropKeys<C>
	}
	hasMethods?: boolean
	noDefaults?: PropKeys<C>
	inlineRadios?: PropKeys<C>
}

type ControlParam = {
	header: string
	control?: ControlType
	value?: unknown
}

const createArgDefault = (value: unknown): string => (typeof value === 'string' ? `'${value}'` : String(value))
const createArgType = ({ control, header, value }: ControlParam): InputType => ({
	control,
	table: {
		category: header,
		defaultValue: value ? { summary: createArgDefault(value) } : undefined,
	},
})

const createArgsConfig = <C>({ args, hasMethods, noDefaults, inlineRadios }: ArgsParam<C>) => {
	const argTypes: ArgTypes = {}

	Object.keys(args.slots || {}).forEach(
		(key: string) => (argTypes[key] = createArgType({ header: 'Slots', control: 'text' }))
	)
	Object.entries(args.props || {}).forEach(([key, value]: [string, unknown]) => {
		const cKey = key as keyof JsxProps<C>
		argTypes[key] = createArgType({
			header: 'Props',
			control: inlineRadios?.includes(cKey) ? 'inline-radio' : undefined,
			value: noDefaults?.includes(cKey) ? undefined : value,
		})
	})
	args.events?.forEach((key: keyof JsxProps<C>) => (argTypes[key as string] = createArgType({ header: 'Events' })))
	hasMethods && (argTypes['ref'] = createArgType({ header: 'Methods', control: false }))

	return {
		argTypes,
		args: {
			...(args.slots || {}),
			...(args.props || {}),
			...args.events?.reduce((acc, event) => ({ ...acc, [event]: fn() }), {}),
		},
	}
}

export { createArgsConfig }
