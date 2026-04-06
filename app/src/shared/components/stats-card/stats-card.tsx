import { Button } from '@ds/core'

export interface StatsCardProps extends ReactProps {
  type?: 'default' | 'button'
  label?: string
  onClick?: () => void
}

export const StatsCard = ({ type, label, onClick, children, className }: StatsCardProps) => {
  return (
    <div
      className={cx(
        'lg:min-w-lg-0 w-fit flex-1 lg:flex-initial',
        'flex flex-col justify-center',
        type === 'button' ? 'px-xs-4 py-xs-3' : 'px-xs-6 py-xs-2',
        'bg-color-bg-card border-color-border-subtle rounded-md border',
        'whitespace-nowrap',
        className,
      )}
    >
      {type === 'button' ? (
        <Button variant="text-default" size="sm" className="px-xs-3!" onClick={onClick}>
          {children}
        </Button>
      ) : (
        <>
          <div className="text-size-xs text-color-text-subtle">{label}</div>
          <div className="text-size-md font-weight-md">{children}</div>
        </>
      )}
    </div>
  )
}
