import { Keyboard } from '@ds/core'
import { debounce } from 'lodash'
import { type RefObject, useMemo } from 'react'

interface Props {
  hoverRef: RefObject<Element | null>
  tooltipRef: RefObject<Element | null>
}

export const useScrolling = (props: Props) => {
  const scrollToView = useMemo(() => {
    return debounce(() => {
      props.hoverRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      props.tooltipRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, 200)
  }, [])

  // Swap left/right arrows for tab navigation
  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (!event.isTrusted) return
    if (![Keyboard.ARROW_RIGHT, Keyboard.ARROW_LEFT].includes(event.key)) return
    event.stopPropagation()
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', {
        ...event.nativeEvent,
        key: event.key === Keyboard.ARROW_RIGHT ? Keyboard.ARROW_LEFT : Keyboard.ARROW_RIGHT,
        bubbles: true,
        cancelable: true,
      }),
    )
    scrollToView()
  }

  return { handleKeyDown }
}
