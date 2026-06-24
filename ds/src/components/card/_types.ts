import { type CSSProperties, type ReactNode } from 'react'
import { type LinkType } from '../_shared/types'

export type CardState = 'static' | 'active' | 'pressed' | 'selected' | 'loading' | 'disabled'
export type CardSize = 'sm' | 'md' | 'lg' | 'xl'

export interface CardProps extends HtmlDataProps {
  /**
   * Slots
   */
  /** Content to be rendered inside the card */
  children: ReactNode
  /** Text to be displayed as tooltip on hover / focus */
  tooltip?: string
  /** Text used by screen reader as description for the card */
  ariaDescription?: string

  /**
   * Props
   */
  /** Property for changing the card state */
  state?: CardState
  /** Property that determines padding */
  size?: CardSize
  /** URL path for transforming the card into `<a>` link */
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
  /** Event emitted when card is clicked, tapped or triggered via `Enter` / `Space` keys */
  onClick?: (event: ReactMouseEvent) => void
}
