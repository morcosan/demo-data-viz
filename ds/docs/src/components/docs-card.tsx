export const DocsCard = ({ children, className }: ReactProps) => {
  return (
    <div className={cx('ds-surface-card px-xs-5 py-xs-3 my-sm-0 overflow-auto [&>*:first-child]:m-0!', className)}>
      {children}
    </div>
  )
}
