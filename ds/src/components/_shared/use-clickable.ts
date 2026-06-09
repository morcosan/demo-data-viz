import { useCallback, useEffect, useState } from 'react'
import { isA11yModePointer } from '../../services/a11y-service'
import { useRoutingService } from '../../services/routing-service'
import { Keyboard } from '../../utilities/various-utils'
import { type ClickableState, type LinkType } from './types'

export interface ClickableProps {
  state: ClickableState
  linkHref?: string
  linkType?: LinkType
  onClick?: (event: ReactMouseEvent) => void
}

export const useClickable = (props: ClickableProps) => {
  const { linkHref, linkType, state, onClick } = props
  const { navigate } = useRoutingService()
  const [pressing, setPressing] = useState(false)

  const linkTarget = linkType === 'internal' ? '_self' : '_blank'
  const isNoop = state === 'disabled' || state === 'loading'
  const isPressed = pressing || state === 'pressed'

  const handleClick = useCallback(
    (event: ReactMouseEvent) => {
      if (isNoop || linkType !== 'external') event.preventDefault()
      if (isNoop) return

      onClick?.(event)

      if (isA11yModePointer()) {
        const button = event.target as HTMLElement
        button.blur()
      }

      if (linkHref && linkType === 'internal') {
        navigate(linkHref)
      }
    },
    [isNoop, linkType, linkHref, onClick, navigate],
  )

  const handleMouseDown = () => !isNoop && setPressing(true)
  const handleMouseLeave = () => setPressing(false)
  const handleMouseUp = () => setPressing(false)

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (isNoop) return
    if (event.key === Keyboard.SPACE || event.key === Keyboard.ENTER) {
      event.preventDefault()
      setPressing(true)
    }
  }

  const handleKeyUp = (event: ReactKeyboardEvent) => {
    if (isNoop) return
    if (event.key === Keyboard.SPACE || event.key === Keyboard.ENTER) {
      const elem = event.target as HTMLButtonElement
      elem.click()
      setPressing(false)
    }
  }

  useEffect(() => {
    setPressing(false)
  }, [isNoop])

  const bindings = (() => {
    const bindings: any = {
      'aria-disabled': isNoop,
      onClick: handleClick,
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
    }
    if (linkHref) {
      bindings.href = linkHref
      bindings.target = linkTarget
      bindings.rel = 'noopener noreferrer'
    }
    return bindings
  })()

  return {
    bindings,
    isNoop,
    isPressed,
    linkTarget,
    pressing,
    handleClick,
    handleKeyDown,
    handleKeyUp,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
  }
}
