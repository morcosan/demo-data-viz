'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Crosshair } from './_partials/crosshair'
import { useDomRegistry } from './_partials/use-dom-registry'

/**
 * Constants
 */
const TARGET_SELECTOR = 'button, [role="button"]'
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
type CrosshairEntry = {
  id: number
  rect: DOMRect
  visible: boolean
}

const CrosshairService = ({ children }: ReactProps) => {
  const [enabled, setEnabled] = useState(true)
  const [crosshairs, setCrosshairs] = useState<CrosshairEntry[]>([])
  const registryRef = useDomRegistry(TARGET_SELECTOR)
  const animTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    let nextId = 0
    let currElem: HTMLElement | null = null

    const getHoveredElement = (x: number, y: number): HTMLElement | null => {
      let bestElem: HTMLElement | null = null
      let bestArea = Infinity
      for (const elem of registryRef.current) {
        const rect = elem.getBoundingClientRect()
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          const area = rect.width * rect.height
          if (area < bestArea) {
            bestElem = elem
            bestArea = area
          }
        }
      }
      return bestElem
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!enabled) {
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
      const entry: CrosshairEntry = { id, rect, visible: true }

      setCrosshairs((prev) => [...prev.map((entry) => ({ ...entry, visible: false })), entry])
      animTimerRef.current = setTimeout(
        () => setCrosshairs((prev) => prev.filter((entry) => entry.id === id)),
        ANIM_DURATION,
      )
    }

    document.addEventListener('mousemove', onMouseMove)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [enabled, registryRef])

  const store: Store = useMemo(() => ({ enabled, setEnabled }), [enabled])

  return (
    <Context.Provider value={store}>
      {children}
      {crosshairs.map((c) => (
        <Crosshair key={c.id} visible={c.visible} targetRect={c.rect} />
      ))}
    </Context.Provider>
  )
}

/**
 * Export
 */
/* eslint-disable react-refresh/only-export-components */
export { CrosshairService, useCrosshairService }
