import { HighlightedText } from '@app/components/highlighted-text/highlighted-text.tsx'
import Link from 'next/link'
import type { Dataset } from '../_api/eurostat-api.ts'

interface Props extends ReactProps {
	dataset: Dataset
	keyword: string
	selected?: boolean
	onClick?: () => void
}

export const DatasetItem = (props: Props) => {
	return (
		<li className={props.className} style={props.style}>
			<Link
				href={`/datasets?code=${encodeURIComponent(props.dataset.code)}`}
				className={cx(
					'relative flex items-center overflow-hidden',
					'px-xs-4 py-xs-2 h-sm-9 rounded-sm shadow-xs',
					'active:translate-y-px',
					props.selected
						? 'bg-color-secondary-button-bg text-color-secondary-button-text font-weight-md'
						: 'bg-color-bg-card'
				)}
				onClick={props.onClick}
			>
				<HighlightedText
					text={props.dataset.title}
					keyword={props.keyword}
					className="text-size-sm line-clamp-2"
				/>
				<span className={cx('hover:bg-color-hover-text-default absolute-overlay')} />
			</Link>
		</li>
	)
}
