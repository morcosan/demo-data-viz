import { useI18nService } from '@ds/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'

const meta: Meta = {
	title: 'Test / I18n',
}

const Default: StoryObj = {
	tags: ['controls'],

	render: function Story() {
		const { translate, loading } = useI18nService()

		return (
			<div>
				Loading: {loading ? 'true' : 'false'}
				<br />
				Translate: {translate('ds.action.close')}
			</div>
		)
	},
}

export default meta
export { Default }
