import { useCallback, useEffect, useRef, useState } from 'react'
import { queryElementsWithTabIndex } from '../../utilities/internal/html-utils'
import { Keyboard, wait } from '../../utilities/various-utils'
import { ANIM_TIME, type ModalProps } from './_types'

let _globalStackIndex = 0

export const useEvents = (props: ModalProps) => {
  const { opened, onClose, onClosed, onOpened, noDismiss } = props
  const [isVisible, setIsVisible] = useState(false)
  const [stackIndex, setStackIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const focusTrap1Ref = useRef<HTMLDivElement>(null)
  const focusTrap2Ref = useRef<HTMLDivElement>(null)

  const isLastStackIndex = (index: number) => Boolean(index && index === _globalStackIndex)
  const computeStackIndex = () => {
    if (opened) {
      _globalStackIndex++
      setStackIndex(_globalStackIndex)
    } else {
      if (stackIndex === 0) return
      _globalStackIndex = _globalStackIndex > 1 ? _globalStackIndex - 1 : 0
      // Delay stack index to keep the modal above
      wait(ANIM_TIME.HIDE).then(() => setStackIndex(0))
    }
  }

  const handleModalOpen = () => {
    if (isVisible) return
    setIsVisible(true)
    wait(ANIM_TIME.SHOW).then(onOpened)
    wait(10).then(() => modalRef.current?.focus()) // Wait for html to be visible
    triggerRef.current = document.activeElement as HTMLElement | null
  }
  const handleModalClose = () => {
    if (!isVisible) return
    setIsVisible(false)
    wait(ANIM_TIME.HIDE).then(onClosed)
    triggerRef.current?.focus()
  }

  const handleWindowKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isVisible || !isLastStackIndex(stackIndex)) return
      if (event.key !== Keyboard.ESCAPE) return
      if (noDismiss) return
      event.stopPropagation()
      onClose?.()
    },
    [isVisible, stackIndex, onClose, noDismiss],
  )

  const handleWindowFocusIn = useCallback(
    (event: FocusEvent) => {
      const target = event.target as HTMLElement

      if (!isVisible || !isLastStackIndex(stackIndex)) return
      if (!target || !modalRef.current) return
      if (modalRef.current.contains(target)) return

      const targets = queryElementsWithTabIndex(modalRef.current)
      if (!targets.length) return

      const firstTarget = targets[0]
      const lastTarget = targets[targets.length - 1]

      if (target === focusTrap1Ref.current) lastTarget.focus()
      if (target === focusTrap2Ref.current) firstTarget.focus()
    },
    [isVisible, stackIndex],
  )

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('focusin', handleWindowFocusIn)
      window.addEventListener('keydown', handleWindowKeyDown)
    }
    return () => {
      window.removeEventListener('focusin', handleWindowFocusIn)
      window.removeEventListener('keydown', handleWindowKeyDown)
    }
  }, [isVisible, handleWindowFocusIn, handleWindowKeyDown])

  useEffect(() => {
    computeStackIndex()
    opened ? handleModalOpen() : handleModalClose()
  }, [opened])

  return {
    focusTrap1Ref,
    focusTrap2Ref,
    isVisible,
    modalRef,
    stackIndex,
  }
}
