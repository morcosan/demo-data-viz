import { type ReactNode, type Ref } from 'react'

export type InputElement = HTMLInputElement & HTMLTextAreaElement
export type TextFieldVariant = 'default' | 'primary' | 'secondary'
export type TextFieldSize = 'sm' | 'md' | 'lg' | 'xl'

export interface TextFieldProps {
  /**
   * Slots
   */
  /** Text value displayed inside the field */
  value?: string
  /** Text displayed as placeholder when `value` prop is empty */
  placeholder?: string
  /** Text used by screen reader as label for the field */
  ariaLabel?: string
  /** Text used by screen reader as description for the field */
  ariaDescription?: string
  /** Content to be rendered inside the field, on the left */
  prefix?: ReactNode
  /** Content to be rendered inside the field, on the right */
  suffix?: ReactNode

  /**
   * Props
   */
  /** Unique id attribute for the `input` / `textarea` element */
  id: string
  /** Property that determines active border color when the field is focused */
  variant?: TextFieldVariant
  /** Property that determines the height and padding for the field */
  size?: TextFieldSize
  /** Maximum number of characters allowed for `value` prop */
  maxLength?: number
  /**
	 - Flag for allowing multiple lines of text separated by `\n` character
	 - The field will auto-expand based on `minRows` and `maxRows` props
	 - It uses `<textarea>` HTML element instead of `<input>` element
	 */
  multiline?: boolean
  /** Minimum number of rows displayed when `value` prop is empty */
  minRows?: number
  /**
	 - Maximum number of rows displayed before enforcing vertical scrolling
	 - If `maxRows` is smaller than `minRows`, then `minRows` is used instead
	 */
  maxRows?: number
  /**
	 - Flag for marking the field as read-only and disable editing
	 - The field is still accessible via keyboard navigation
	 */
  readonly?: boolean
  /** Flag for completely disable the field and its interaction */
  disabled?: boolean
  /** Flag for displaying the error state */
  invalid?: boolean
  /** CSS class attribute for the wrapper element */
  className?: string

  /**
   * Events
   */
  /**
   * Event emitted when the field is edited and `value` prop must change
   * @param value - new value of the field
   * @param event - DOM event object
   */
  onChange?: (value: string, event: ReactChangeEvent) => void
  /**
   * Event emitted when `Enter` key is pressed, before `onChange` is emitted
   * @param event - DOM event object
   */
  onSubmit?: (event: ReactKeyboardEvent) => void
  /**
   * Event emitted when the field receives keyboard focus
   * @param event - DOM event object
   */
  onFocus?: (event: ReactFocusEvent) => void
  /**
   * Event emitted when the field loses keyboard focus
   * @param event - DOM event object
   */
  onBlur?: (event: ReactFocusEvent) => void

  /**
   * Methods
   */
  /**
   * Reference object for imperative methods
   * @param setValue(value:string):void 	- Sets the current value of `<input>` or `<textarea>` element
   * @param getValue():string 						- Returns the current value of `<input>` or `<textarea>` element
   * @param focus():void 									- Triggers focus on the `<input>` or `<textarea>` element
   * @param blur():void 									- Triggers blur on the `<input>` or `<textarea>` element
   */
  ref?: Ref<TextFieldRef>
}

export interface TextFieldRef {
  setValue(value: string): void
  getValue(): string
  focus(): void
  blur(): void
}
