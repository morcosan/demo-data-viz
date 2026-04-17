import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { useEffect, useRef, useState } from 'react'
import { Tooltip, type TooltipProps } from './tooltip'

const meta: Meta = {
  title: 'Components / Tooltip',
  ...defineMeta(Tooltip, {
    slots: {
      children: '',
    },
    props: {
      label: 'Tooltip',
      position: 'top',
      noFlip: false,
      noHover: false,
      noFocus: false,
      noTouch: false,
    },
    clearDefaults: ['label'],
    inlineRadios: ['position'],

    render: ({ children, ...rest }: TooltipProps) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const ref = useRef<HTMLDivElement>(null)
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [container, setContainer] = useState<HTMLElement | null>(null)

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const elem = ref.current
        if (elem) {
          elem.scrollTop = (elem.scrollHeight - elem.clientHeight) / 2
          setContainer(elem)
        }
      }, [])

      return (
        <div ref={ref} className="h-xl-0 w-xl-0 border-color-border-default relative overflow-auto border">
          <div className="flex-center h-xxl-0 flex">
            <Tooltip {...rest} container={container}>
              {children ? (
                <div dangerouslySetInnerHTML={{ __html: children || '' }} />
              ) : (
                <div className="w-fit border" tabIndex={0}>
                  Content with tooltip
                </div>
              )}
            </Tooltip>
          </div>
        </div>
      )
    },
  }),
}

const Default: StoryObj<typeof Tooltip> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
