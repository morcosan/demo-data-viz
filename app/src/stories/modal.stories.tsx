import { Button, Modal, type ModalProps } from '@ds/core.ts'
import { createArgsConfig, loremLongText } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { useEffect, useState } from 'react'

const meta: Meta<typeof Modal> = {
	component: Modal,
	title: 'Test / Modal',
	...createArgsConfig<typeof Modal>({
		args: {
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
		},
		inlineRadios: ['width', 'height'],
	}),
}

const Default: StoryObj<typeof Modal> = {
	tags: ['controls'],

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

export default meta
export { Default }
