import { useCallback, useEffect, useState } from 'react'
import { isA11yModePointer } from '../../services/a11y-service'
import { useRoutingService } from '../../services/routing-service'
import { Keyboard } from '../../utilities/various-utils'
import { type LinkType } from './types'

export interface ClickableProps {
  loading?: boolean
  disabled?: boolean
  linkHref?: string
  linkType?: LinkType
  onClick?: (event: ReactMouseEvent) => void
}

export const useClickable = (props: ClickableProps) => {
  const { disabled, linkHref, linkType, loading, onClick } = props
  const { navigate } = useRoutingService()
  const [isPressed, setIsPressed] = useState(false)

  const linkTarget = linkType === 'internal' ? '_self' : '_blank'
  const isNoop = disabled || loading

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

  const handleMouseDown = () => !isNoop && setIsPressed(true)
  const handleMouseLeave = () => setIsPressed(false)
  const handleMouseUp = () => setIsPressed(false)

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (isNoop) return
    if (event.key === Keyboard.SPACE || event.key === Keyboard.ENTER) {
      event.preventDefault()
      setIsPressed(true)
    }
  }

  const handleKeyUp = (event: ReactKeyboardEvent) => {
    if (isNoop) return
    if (event.key === Keyboard.SPACE || event.key === Keyboard.ENTER) {
      const elem = event.target as HTMLButtonElement
      elem.click()
      setIsPressed(false)
    }
  }

  useEffect(() => {
    setIsPressed(false)
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
    handleClick,
    handleKeyDown,
    handleKeyUp,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
  }
}
