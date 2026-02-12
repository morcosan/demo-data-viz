interface Props extends ReactProps {
	text: string
	keyword: string
}

export const HighlightedText = ({ text, keyword, className }: Props) => {
	const lowerKeyword = keyword.toLowerCase()
	const regexKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const regex = new RegExp(`(${regexKeyword}|\n)`, 'gi')
	const parts = text
		.split(regex)
		.filter((v: string) => v)
		.reduce((acc: string[], v: string) => (v === '\n' && acc[acc.length - 1] === '\n' ? acc : [...acc, v]), [])

	return (
		<span className={className}>
			{parts.map((part, j) =>
				part.toLowerCase() === lowerKeyword ? (
					<span key={j} className="bg-color-secondary-button-bg text-color-secondary-button-text px-px">
						{part}
					</span>
				) : part === '\n' ? (
					<br key={j} />
				) : (
					part
				)
			)}
		</span>
	)
}
