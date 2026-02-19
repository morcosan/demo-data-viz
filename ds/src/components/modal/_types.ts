import { type ReactNode } from 'react'

export type ModalWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ModalHeight = 'fit' | 'full'

export interface ModalProps {
  /**
   * Slots
   */
  /** Content to be rendered as title for modal */
  title: ReactNode
  /** Content to be rendered inside the modal */
  children: ReactNode
  /** Content to be rendered in footer, on the bottom-right corner, as action button */
  actions?: ReactNode
  /** Extra content to be rendered in footer, on the bottom-left corner */
  extras?: ReactNode

  /**
   * Props
   */
  /** Flag for displaying the modal */
  opened: boolean
  /** Property that determines width and max-width for modal */
  width?: ModalWidth
  /** Property that determines height and max-height for modal */
  height?: ModalHeight
  /**
	 - Flag for disabling the overlay click and `Escape` key
	 - It also increases the background contrast
	 */
  noDismiss?: boolean
  /** Flag for hiding all close buttons and disabling `onClose` event */
  noClose?: boolean
  /** Flag for hiding the footer */
  noFooter?: boolean

  /**
   * Events
   */
  /** Event emitted when modal is opened (after the transition animation) */
  onOpened?: () => void
  /** Event emitted when any close button is clicked or when `Escape` key is pressed */
  onClose?: () => void
  /** Event emitted when modal is closed (after the transition animation) */
  onClosed?: () => void
}
