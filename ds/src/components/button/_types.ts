import { type CSSProperties, type ReactNode } from 'react'
import { type BaseButtonSize, type BaseButtonState, type BaseButtonVariant, type LinkType } from '../_shared/types'

export type ButtonState = BaseButtonState
export type ButtonVariant = BaseButtonVariant
export type ButtonSize = BaseButtonSize

export interface ButtonProps extends HtmlDataProps {
  /**
   * Slots
   */
  /** Content to be rendered inside the button */
  children: ReactNode
  /** Text to be displayed as tooltip on hover / focus */
  tooltip?: string
  /** Text used by screen reader as description for the button */
  ariaDescription?: string

  /**
   * Props
   */
  /** Property for changing the button state */
  state?: ButtonState
  /** Property that determines color and highlight */
  variant?: ButtonVariant
  /** Property that determines total height and padding */
  size?: ButtonSize
  /** URL path for transforming the button into `<a>` link */
  linkHref?: string
  /**
   - Link behavior when linkHref is set
   - `internal` creates a router `Link` component
   - `external` creates an `<a>` link that opens in new tab
   - `inactive` creates an `<a>` link without any behavior
   */
  linkType?: LinkType
  /** CSS class attribute for the wrapper element */
  className?: string
  /** CSS style attribute for the wrapper element */
  style?: CSSProperties

  /**
   * Events
   */
  /** Event emitted when button is clicked, tapped or triggered via `Enter` / `Space` keys */
  onClick?: (event: ReactMouseEvent) => void
}
