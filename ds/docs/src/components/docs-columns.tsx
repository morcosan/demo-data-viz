export const DocsColumns = ({ children }: ReactProps) => {
  return (
    <div
      className={cx(
        'grid grid-cols-1 lg:grid-cols-2',
        'gap-x-sm-0 gap-y-xs-5 my-xs-5 [&_h3:first-child]:mt-xs-5!',
        '[&>div]:overflow-hidden',
      )}
    >
      {children}
    </div>
  )
}
