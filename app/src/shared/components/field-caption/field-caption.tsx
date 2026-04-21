export const FieldCaption = ({ children, id, className, style }: ReactProps) => {
  return (
    <div
      id={id}
      className={cx('text-size-xs text-color-text-subtle px-xs-1 pt-xs-0 font-weight-sm italic', className)}
      style={style}
    >
      {children}
    </div>
  )
}
