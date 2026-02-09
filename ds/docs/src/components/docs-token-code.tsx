import { wait } from '@ds/core.ts'
import { type ReactNode, useState } from 'react'

interface Props {
	iconSvg: ReactNode
	value: string
	size?: string
	loading?: boolean
}

export const DocsTokenCode = ({ iconSvg, value, size, loading }: Props) => {
	const [copied, setCopied] = useState(false)

	const buttonClass = cx(
		'absolute-center origin-center cursor-pointer overflow-hidden',
		'border-color-border-default bg-color-bg-card rounded-xs border',
		'px-xs-0 w-full min-w-full',
		'hover:w-fit focus:w-fit',
		'hover:w-fit focus:w-fit',
		'hover:px-xs-2 focus:px-xs-2',
		'hover:py-xs-1 focus:py-xs-1',
		'hover:z-popup focus:z-popup',
		'hover:shadow-md focus:shadow-md',
		'hover:bg-color-bg-card focus:bg-color-bg-card',
		'hover:scale-[1.1] focus:scale-[1.1]'
	)

	const copiedClass = cx(
		'flex-center absolute-overlay bg-color-success-card-bg',
		'text-size-sm font-weight-md text-color-success-card-text'
	)

	const handleClick = (event: ReactMouseEvent) => {
		const button = event.target as HTMLButtonElement
		button.blur()

		navigator.clipboard.writeText(value)
		setCopied(true)
		wait(600).then(() => setCopied(false))
	}

	return loading ? (
		<div className={cx('flex-center h-sm-4 border-color-border-subtle rounded-xs border', size || 'w-md-8')}>
			...
		</div>
	) : (
		<div className={cx('h-sm-4 relative', size || 'w-md-8')}>
			<button type="button" className={buttonClass} onClick={handleClick}>
				<code className="gap-xs-2 bg-color-bg-card! pointer-events-none flex w-full! items-center border-0!">
					<span className="h-xs-6 mt-px ml-px block">{iconSvg}</span>
					<span className="line-clamp-1">{value}</span>
				</code>

				{Boolean(copied) && <div className={copiedClass}>Copied</div>}
			</button>
		</div>
	)
}
