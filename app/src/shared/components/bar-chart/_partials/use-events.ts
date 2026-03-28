import { Keyboard } from '@ds/core'
import { debounce } from 'lodash'
import { type RefObject, useMemo } from 'react'


export const useEvents = (hoverRef: RefObject<Element | null>, tooltipRef: RefObject<Element | null>) => {
  const scrollToView = useMemo(() => {
    return debounce(() => {
      hoverRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      tooltipRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
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
