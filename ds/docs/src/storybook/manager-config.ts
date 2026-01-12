import { type Addon_Config } from 'storybook/internal/types'
import { type State } from 'storybook/manager-api'

export const addonConfig = {
	panelPosition: 'right',
	layoutCustomisations: {
		showPanel(state: State) {
			const story = state.filteredIndex?.[state.storyId]
			// Show controls panel only if the story has 'controls' tag
			return Boolean(story?.tags.includes('controls') && state.viewMode !== 'docs')
		},
	},
} satisfies Addon_Config
