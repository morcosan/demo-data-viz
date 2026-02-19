import { type ReactNode } from 'react'
import { type LinkType } from '../_partials/types'

export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type IconButtonVariant =
  | 'text-default'
  | 'text-subtle'
  | 'text-danger'
  | 'solid-primary'
  | 'solid-secondary'
  | 'solid-danger'
  | 'ghost-primary'
  | 'ghost-secondary'
  | 'ghost-danger'

export interface IconButtonProps {
  /**
   * Slots
   */
  /** Content to be rendered inside the button */
  children: ReactNode
  /** Text to be displayed as tooltip on hover / focus */
  tooltip: string
  /** Text used by screen reader as description for the button */
  ariaDescription?: string

  /**
   * Props
   */
  /** Property that determines total height and padding */
  size?: IconButtonSize
  /** Property that determines color and highlight */
  variant?: IconButtonVariant
  /** Flag for enforcing the highlight for pressed state */
  pressed?: boolean
  /**
	 - Flag for enabling loading state (non-interactive)
	 - It has priority over `disabled` prop
	 */
  loading?: boolean
  /** Flag for enabling disabled state (non-interactive) */
  disabled?: boolean
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

  /**
   * Events
   */
  /** Event emitted when button is clicked, tapped or triggered via `Enter` / `Space` keys */
  onClick?: (event: ReactMouseEvent) => void
}
