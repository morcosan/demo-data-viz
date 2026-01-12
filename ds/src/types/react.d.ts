import type {
	ChangeEvent,
	CSSProperties,
	FocusEvent,
	JSXElementConstructor,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
} from 'react'

declare module 'react' {
	interface CSSProperties {
		[key: string]: string | number | undefined
	}
}

export {}
declare global {
	type JsxProps<C> = C extends JsxFn<infer P> ? P : unknown
	type JsxFn<P = ReactProps> = JSXElementConstructor<P>

	type ReactChangeEvent<T = unknown> = ChangeEvent<T>
	type ReactFocusEvent = FocusEvent
	type ReactKeyboardEvent = KeyboardEvent
	type ReactMouseEvent = MouseEvent

	interface ReactProps {
		id?: string
		className?: string
		style?: CSSProperties
		children?: ReactNode
	}
}
