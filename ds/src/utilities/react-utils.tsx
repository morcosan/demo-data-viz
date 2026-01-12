import { useMemo, type ReactNode } from 'react'

interface HOC<C = any> {
	comp: C
	props: JsxProps<C>
}
interface Props extends ReactProps {
	hocs: HOC[]
}

const HocComposer = ({ children, hocs }: Props) => {
	return hocs.reduceRight(
		(acc: ReactNode, hoc: HOC) => <hoc.comp {...(hoc.props || {})}>{acc}</hoc.comp>,
		children
	)
}
HocComposer.hoc = <C,>(comp: C, props: JsxProps<C>): HOC<C> => ({ comp, props })

const useDefaults = <P extends Record<string, any>>(rawProps: P, defaults: Partial<P>, truthy?: boolean): P => {
	return useMemo(() => {
		const props = { ...defaults } as any

		Object.entries(rawProps).forEach(([key, value]) => {
			const isValid = truthy ? Boolean(value) : value !== undefined
			if (isValid) {
				props[key] = value
			}
		})

		return props
	}, [rawProps, defaults, truthy])
}

// eslint-disable-next-line react-refresh/only-export-components
export { HocComposer, useDefaults, type HOC }
