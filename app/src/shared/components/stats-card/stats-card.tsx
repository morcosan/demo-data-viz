import { Button } from '@ds/core'

export interface StatsCardProps extends ReactProps {
  type?: 'default' | 'button'
  label?: string
  onClick?: () => void
}

export const StatsCard = (props: StatsCardProps) => {
  return (
    <div
      className={cx(
        'xl:min-w-lg-0 w-fit flex-1 xl:flex-initial',
        'flex flex-col justify-center',
        props.type === 'button' ? 'px-xs-4 py-xs-3' : 'px-xs-6 py-xs-2',
        'bg-color-bg-card border-color-border-subtle rounded-md border',
        'whitespace-nowrap',
        props.className,
      )}
    >
      {props.type === 'button' ? (
        <Button variant="text-default" size="sm" className="px-xs-3!" onClick={props.onClick}>
          {props.children}
        </Button>
      ) : (
        <>
          <div className="text-size-xs text-color-text-subtle">{props.label}</div>
          <div className="text-size-md font-weight-md">{props.children}</div>
        </>
      )}
    </div>
  )
}
