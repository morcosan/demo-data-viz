import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import CloseSvg from '../app/test/close.svg'

const meta: Meta = {
	title: 'Test / SVGR',
}

const Default: StoryObj = {
	tags: ['controls'],

	render() {
		return (
			<div>
				Fucking svgr
				<br />
				<br />
				<div>{String(CloseSvg)}</div>
				<br />
				<CloseSvg />
			</div>
		)
	},
}

export default meta
export { Default }
