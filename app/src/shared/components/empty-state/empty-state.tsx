import { useDefaults } from '@ds/core.ts'

interface Props extends ReactProps {
	type?: 'default' | 'error'
}

export const EmptyState = (rawProps: Props) => {
	const props = useDefaults(rawProps, { type: 'default' })

	return (
		<div className={cx('gap-xs-3 p-xs-3 flex items-end', props.className)}>
			<div className="text-size-xxl">{props.type === 'default' ? '😉' : '😢'}</div>

			<div
				className={cx(
					'px-xs-5 py-xs-2 relative h-fit translate-y-[-20px]',
					'border-color-border-subtle bg-color-bg-menu rounded-md border shadow-xs',
					"before:absolute before:content-[''] after:absolute after:content-['']",
					// Arrow border
					'before:bottom-[3px] before:left-[-9px]',
					'before:border-y-[8px] before:border-y-transparent',
					'before:border-r-color-border-subtle before:border-r-[8px]',
					// Arrow fill
					'after:bottom-[4px] after:left-[-7px]',
					'after:border-y-[7px] after:border-y-transparent',
					'after:border-r-color-bg-menu after:border-r-[7px]'
				)}
			>
				{props.children}
			</div>
		</div>
	)
}
