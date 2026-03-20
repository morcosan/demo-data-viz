import { useEffect, useRef, useState } from 'react'
import { queryElementsWithTabIndex } from '../../utilities/internal/html-utils'
import { Keyboard, wait } from '../../utilities/various-utils'
import { ANIM_TIME, type ModalProps } from './_types'

let _globalStackIndex = 0

export const useEvents = (props: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [stackIndex, setStackIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const focusTrap1Ref = useRef<HTMLDivElement>(null)
  const focusTrap2Ref = useRef<HTMLDivElement>(null)

  const isLastStackIndex = (index: number) => Boolean(index && index === _globalStackIndex)
  const computeStackIndex = () => {
    if (props.opened) {
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
    wait(ANIM_TIME.SHOW).then(props.onOpened)
    wait(10).then(() => modalRef.current?.focus()) // Wait for html to be visible
    triggerRef.current = document.activeElement as HTMLElement | null
  }
  const handleModalClose = () => {
    if (!isVisible) return
    setIsVisible(false)
    wait(ANIM_TIME.HIDE).then(props.onClosed)
    triggerRef.current?.focus()
  }

  const handleWindowKeyDown = (event: KeyboardEvent) => {
    if (!isVisible || !isLastStackIndex(stackIndex)) return
    if (event.key !== Keyboard.ESCAPE) return
    if (props.noDismiss) return
    event.stopPropagation()
    props.onClose?.()
  }

  const handleWindowFocusIn = (event: FocusEvent) => {
    const target = event.target as HTMLElement

    if (!isVisible || !isLastStackIndex(stackIndex)) return
    if (!target || !modalRef.current) return
    if (modalRef.current.contains(target)) return

    const targets = queryElementsWithTabIndex(modalRef.current)
    const firstTarget = targets[0]
    const lastTarget = targets[targets.length - 1]

    if (target === focusTrap1Ref.current) lastTarget.focus()
    if (target === focusTrap2Ref.current) firstTarget.focus()
  }

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('focusin', handleWindowFocusIn)
      window.addEventListener('keydown', handleWindowKeyDown)
    }
    return () => {
      window.removeEventListener('focusin', handleWindowFocusIn)
      window.removeEventListener('keydown', handleWindowKeyDown)
    }
  }, [isVisible, props.noDismiss, props.noClose])

  useEffect(() => {
    computeStackIndex()
    props.opened ? handleModalOpen() : handleModalClose()
  }, [props.opened])

  return {
    focusTrap1Ref,
    focusTrap2Ref,
    isVisible,
    modalRef,
    stackIndex,
  }
}
