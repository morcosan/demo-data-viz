export const LayoutPane = ({ children, className }: ReactProps) => {
	return <div className={cx('bg-color-bg-pane rounded-md shadow-xs', className)}>{children}</div>
}
