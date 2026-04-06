import { Tooltip as MantineTooltip } from '@mantine/core'
import '@mantine/core/styles/Tooltip.css'

export interface TooltipProps extends ReactProps {
  label: string
}

export const DocsTooltip = ({ children, label }: TooltipProps) => {
  return (
    <MantineTooltip
      label={label}
      position="top-start"
      offset={3}
      zIndex="var(--ds-z-index-tooltip)"
      styles={{
        tooltip: {
          color: 'var(--ds-color-text-default)',
          backgroundColor: 'var(--ds-color-bg-menu)',
          boxShadow: 'var(--ds-shadow-sm)',
          border: '1px solid var(--ds-color-border-default)',
          padding: 'var(--ds-spacing-xs-2) var(--ds-spacing-xs-4) var(--ds-spacing-xs-0)',
          whiteSpace: 'pre-line',
        },
      }}
      events={{ hover: true, focus: true, touch: true }}
    >
      {children}
    </MantineTooltip>
  )
}
