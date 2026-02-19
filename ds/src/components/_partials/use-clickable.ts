import { useCallback, useEffect, useState } from 'react'
import { isA11yModePointer } from '../../services/a11y-service.tsx'
import { useRoutingService } from '../../services/routing-service.tsx'
import { Keyboard } from '../../utilities/various-utils.ts'
import { type LinkType } from './types.ts'

export interface ClickableProps {
  loading?: boolean
  disabled?: boolean
  linkHref?: string
  linkType?: LinkType
  onClick?(event: ReactMouseEvent): void
}

export const useClickable = (props: ClickableProps) => {
  const { onClick: onClickProp } = props
  const { navigate } = useRoutingService()
  const [isPressed, setIsPressed] = useState(false)

  const linkTarget = props.linkType === 'internal' ? '_self' : '_blank'
  const isNoop = props.disabled || props.loading

  const handleClick = useCallback(
    (event: ReactMouseEvent) => {
      if (isNoop || props.linkType !== 'external') event.preventDefault()
      if (isNoop) return

      onClickProp?.(event)

      if (isA11yModePointer()) {
        const button = event.target as HTMLElement
        button.blur()
      }

      if (props.linkHref && props.linkType === 'internal') {
        navigate(props.linkHref)
      }
    },
    [isNoop, props.linkType, props.linkHref, onClickProp, navigate],
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
    if (props.linkHref) {
      bindings.href = props.linkHref
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
