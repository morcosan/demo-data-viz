'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { wait } from '../utilities/various-utils'
import { Crosshair } from './_partials/crosshair'
import { useDomRegistry } from './_partials/use-dom-registry'

/**
 * Constants
 */
const TARGET_SELECTOR = [
  'button:not([aria-disabled="true"])',
  'a:not([aria-disabled="true"])',
  '[role="button"]:not([aria-disabled="true"])',
  '[role="option"]:not([aria-disabled="true"]):not([data-combobox-disabled="true"])',
  'input:not([disabled="true"]):not([aria-disabled="true"])',
].join(',')
const ANIM_DURATION = 300

/**
 * Context
 */
type Store = {
  enabled: boolean
  setEnabled(value: boolean): void
}
const Context = createContext<Store>({
  enabled: false,
  setEnabled: () => {},
})
const useCrosshairService = () => useContext(Context)

/**
 * Provider
 */
interface CrosshairEntry {
  id: number
  rect: DOMRect
  visible: boolean
}
interface Props extends ReactProps {
  enabled: boolean
}
const CrosshairService = ({ enabled, children }: Props) => {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [crosshairs, setCrosshairs] = useState<CrosshairEntry[]>([])
  const registryRef = useDomRegistry(TARGET_SELECTOR)
  const animTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setIsEnabled(enabled)
  }, [enabled])

  useEffect(() => {
    let nextId = 0
    let currElem: HTMLElement | null = null

    const getHoveredElement = (x: number, y: number): HTMLElement | null => {
      const topmost = document.elementFromPoint(x, y)
      if (!topmost) return null

      let node: Element | null = topmost
      while (node) {
        if (node instanceof HTMLElement && registryRef.current.has(node)) {
          return node
        }
        node = node.parentElement
      }

      return null
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!isEnabled) {
        currElem = null
        setCrosshairs([])
        return
      }

      const elem = getHoveredElement(event.clientX, event.clientY)
      if (currElem === elem) return

      clearTimeout(animTimerRef.current)

      if (!elem) {
        currElem = null
        setCrosshairs((prev) => prev.map((entry) => ({ ...entry, visible: false })))
        animTimerRef.current = setTimeout(() => setCrosshairs([]), ANIM_DURATION)
        return
      }

      currElem = elem
      const rect = elem.getBoundingClientRect()
      const id = nextId++
      setCrosshairs((prev) => [...prev, { id, rect, visible: false }])
      wait(1).then(() => setCrosshairs((prev) => [...prev.map((entry) => ({ ...entry, visible: entry.id === id }))]))
      animTimerRef.current = setTimeout(
        () => setCrosshairs((prev) => prev.filter((entry) => entry.id === id)),
        ANIM_DURATION,
      )
    }

    document.addEventListener('mousemove', onMouseMove)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [isEnabled, registryRef])

  const store: Store = useMemo(() => ({ enabled: isEnabled, setEnabled: setIsEnabled }), [isEnabled])

  return (
    <Context.Provider value={store}>
      {children}
      {crosshairs.map((entry) => (
        <Crosshair key={entry.id} visible={entry.visible} targetRect={entry.rect} />
      ))}
    </Context.Provider>
  )
}

/**
 * Export
 */
/* eslint-disable react-refresh/only-export-components */
export { CrosshairService, useCrosshairService }
