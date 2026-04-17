import { Tooltip as MantineTooltip } from '@mantine/core'
import '@mantine/core/styles/Tooltip.css'

export interface TooltipProps extends ReactProps {
  label: string
  position?: 'top' | 'bottom'
  noFlip?: boolean
  noHover?: boolean
  noFocus?: boolean
  noTouch?: boolean
  container?: HTMLElement | null
}

export const Tooltip = (props: TooltipProps) => {
  const { children, label, position = 'top', noFlip, noHover, noFocus, noTouch, container } = props

  return (
    <MantineTooltip
      label={label}
      position={position === 'top' ? 'top-start' : 'bottom-start'}
      middlewares={noFlip ? { flip: false, shift: { crossAxis: true } } : undefined}
      offset={3}
      zIndex="var(--ds-z-index-tooltip)"
      styles={{
        tooltip: {
          color: 'var(--ds-color-text-default)',
          backgroundColor: 'var(--ds-color-bg-menu)',
          boxShadow: 'var(--ds-shadow-sm)',
          border: '1px solid var(--ds-color-border-default)',
          padding: 'var(--ds-spacing-xs-1) var(--ds-spacing-xs-4) var(--ds-spacing-xs-0)',
          whiteSpace: 'pre-line',
        },
      }}
      events={{ hover: !noHover, focus: !noFocus, touch: !noTouch }}
      portalProps={container ? { target: container } : undefined}
    >
      {children}
    </MantineTooltip>
  )
}
