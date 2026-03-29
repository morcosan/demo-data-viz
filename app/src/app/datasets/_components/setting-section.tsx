interface Props extends ReactProps {
  header: string
}

export const SettingSection = (props: Props) => {
  const headerClass = cx(
    // Header
    'mb-xs-3 pb-xs-1 relative',
    'text-size-xs font-weight-sm text-color-text-subtle tracking-wider uppercase',
    // Underline
    'after:absolute after:bottom-0 after:left-0',
    'after:bg-color-text-subtle after:w-xs-9 after:h-px',
  )
  const listClass = cx(
    // Rows
    '[&>div]:grid [&>div]:grid-cols-1 sm:[&>div]:grid-cols-[30%_minmax(0,1fr)]',
    '[&>div]:py-xs-7 [&>div]:gap-x-xs-9 [&>div]:items-center',
    '[&>div]:border-color-border-subtle [&>div]:border-b [&>div]:last:border-0',
    // Items
    '[&_dt]:mb-xs-1 sm:[&_dt]:mb-0',
    '[&_dt]:text-size-sm [&_dd]:font-weight-lg',
  )

  return (
    <section className={props.className}>
      <h2 className={headerClass}>{props.header}</h2>
      <dl className={listClass}>{props.children}</dl>
    </section>
  )
}
