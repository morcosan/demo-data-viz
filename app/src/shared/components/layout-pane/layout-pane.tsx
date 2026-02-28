import { forwardRef, type Ref } from 'react'

export const LayoutPane = forwardRef<HTMLDivElement, ReactProps>((props: ReactProps, ref: Ref<HTMLDivElement>) => {
  return (
    <div ref={ref} className={cx('bg-color-bg-pane rounded-md shadow-xs', props.className)} style={props.style}>
      {props.children}
    </div>
  )
})
