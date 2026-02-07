import { Button, Modal, type ModalProps } from '@ds/core.ts'
import { defineMeta, DocsPage, loremLongText } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useEffect, useMemo, useState } from 'react'

const meta: Meta = {
	title: 'Components / Modal',
	...defineMeta(Modal, {
		slots: {
			title: 'Modal title',
			children: loremLongText(20),
			actions:
				'<button class="p-xs-3 bg-color-primary-button-bg text-color-text-inverse rounded-md">Submit</button>',
			extras: 'Extra content',
		},
		props: {
			opened: false,
			width: 'md',
			height: 'fit',
			noDismiss: false,
			noClose: false,
			noFooter: false,
		},
		events: ['onOpened', 'onClose', 'onClosed'],
		inlineRadios: ['width', 'height'],
	}),
}

const Default: StoryObj<typeof Modal> = {
	tags: ['autodocs', 'controls'],

	render: function Story(props: ModalProps) {
		const [opened, setOpened] = useState(false)

		useEffect(() => {
			setOpened(props.opened)
		}, [props.opened])

		return (
			<>
				<Button variant="text-default" onClick={() => setOpened(true)}>
					Open modal
				</Button>

				<Modal
					{...props}
					opened={opened}
					actions={<div dangerouslySetInnerHTML={{ __html: String(props.actions) }} />}
					onClose={() => {
						setOpened(false)
						props.onClose?.()
					}}
				/>
			</>
		)
	},
}

const Nesting: StoryObj<typeof Modal> = {
	render: function Render() {
		const [opened1, setOpened1] = useState(false)
		const [opened2, setOpened2] = useState(false)
		const [opened3, setOpened3] = useState(false)

		const slotTriggers = useMemo(
			() => (
				<div className="gap-xs-5 flex">
					<Button variant="text-default" onClick={() => setOpened1(true)}>
						Open modal #1
					</Button>
					<Button variant="text-default" onClick={() => setOpened2(true)}>
						Open modal #2
					</Button>
					<Button variant="text-default" onClick={() => setOpened3(true)}>
						Open modal #3
					</Button>
				</div>
			),
			[]
		)

		return (
			<DocsPage type="component">
				<div className="flex-center py-sm-2">{slotTriggers}</div>

				<Modal opened={opened1} title="Modal #1" width="sm" onClose={() => setOpened1(false)}>
					{slotTriggers}
				</Modal>
				<Modal opened={opened2} title="Modal #2" width="md" onClose={() => setOpened2(false)}>
					{slotTriggers}
				</Modal>
				<Modal opened={opened3} title="Modal #3" width="lg" onClose={() => setOpened3(false)}>
					{slotTriggers}
				</Modal>
			</DocsPage>
		)
	},
}

export default meta
export { Default, Nesting }
