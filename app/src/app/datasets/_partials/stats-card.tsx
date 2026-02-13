interface Props extends ReactProps {
	label: string
}

export const StatsCard = ({ label, children }: Props) => {
	return (
		<div
			className={cx(
				'xl:min-w-lg-0 w-fit flex-1 xl:flex-initial',
				'px-xs-6 py-xs-2 flex flex-col',
				'bg-color-bg-card border-color-border-subtle rounded-md border',
				'whitespace-nowrap'
			)}
		>
			<div className="text-size-xs text-color-text-subtle">{label}</div>
			<div className="text-size-md font-weight-md">{children}</div>
		</div>
	)
}
