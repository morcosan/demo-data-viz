'use client'

import { useImperativeHandle, useRef } from 'react'

interface Handle {
  getBoundingClientRect: () => DOMRect | undefined
}

export const LayoutPane = ({ ref, children, className, style }: ReactProps<Handle>) => {
  const innerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getBoundingClientRect: () => innerRef.current?.getBoundingClientRect(),
  }))

  return (
    <div ref={innerRef} className={cx('bg-color-bg-pane rounded-md shadow-xs', className)} style={style}>
      {children}
    </div>
  )
}
