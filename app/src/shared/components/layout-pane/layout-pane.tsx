'use client'

import { type Ref, useImperativeHandle, useRef } from 'react'

interface Props extends ReactProps {
  ref?: Ref<{
    getBoundingClientRect: () => DOMRect | undefined
  }>
}

export const LayoutPane = (props: Props) => {
  const innerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(props.ref, () => ({
    getBoundingClientRect: () => innerRef.current?.getBoundingClientRect(),
  }))

  return (
    <div ref={innerRef} className={cx('bg-color-bg-pane rounded-md shadow-xs', props.className)} style={props.style}>
      {props.children}
    </div>
  )
}
