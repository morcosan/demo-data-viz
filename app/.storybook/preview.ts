import type { Preview } from '@storybook/nextjs-vite'

const preview: Preview = {
	parameters: {
		options: {
			showPanel: true,
			panelPosition: 'right', // left/right only
		},

		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
}

export default preview
