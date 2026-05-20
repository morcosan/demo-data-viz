'use client'

import { useDataProps } from '@ds/core'
import { useImperativeHandle, useRef } from 'react'

interface Handle {
  getBoundingClientRect: () => DOMRect | undefined
}

export const LayoutPane = (props: ReactProps<Handle>) => {
  const { ref, children, className, style } = props
  const dataProps = useDataProps(props)
  const innerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getBoundingClientRect: () => innerRef.current?.getBoundingClientRect(),
  }))

  return (
    <div
      ref={innerRef}
      className={cx('bg-color-bg-sheet rounded-md shadow-xs', className)}
      style={style}
      {...dataProps}
    >
      {children}
    </div>
  )
}
