import { useThemeService } from '@ds/core.ts'
import { Source, type SourceProps } from '@storybook/addon-docs/blocks'

interface Props extends SourceProps {
	filename?: string
}

export const DocsCodeBlock = ({ code, language, filename }: Props) => {
	const { isUiDark } = useThemeService()

	return (
		<div
			className={cx(
				'docs-code-block border-color-border-shadow relative overflow-hidden rounded-md border',
				filename && 'pt-xs-8',
				isUiDark ? 'bg-color-bg-coding' : 'bg-color-grey-18'
			)}
		>
			{filename && (
				<div
					className={cx(
						'px-xs-2 py-xs-0 z-sticky absolute top-0 left-0 rounded-br-sm',
						isUiDark ? 'bg-color-grey-19' : 'bg-color-grey-16',
						'text-size-xs',
						isUiDark ? 'text-color-grey-8' : 'text-color-grey-7'
					)}
				>
					{filename}
				</div>
			)}

			<Source code={code?.replaceAll('//\n', '\n')} language={language} dark format />
		</div>
	)
}
