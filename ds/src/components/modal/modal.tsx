'use client'

import { type CSSObject } from '@emotion/react'
import { Modal as MantineModal, type TransitionOverride } from '@mantine/core'
import '@mantine/core/styles/Modal.css'
import '@mantine/core/styles/ModalBase.css'
import { useEffect, useRef, useState } from 'react'
import { CloseSvg } from '../../assets/icons.ts'
import { useI18nService } from '../../services/i18n-service.tsx'
import { useThemeService } from '../../services/theme-service.tsx'
import { CSS__FIXED_OVERLAY } from '../../utilities/internal/css-utils.ts'
import { useDefaults } from '../../utilities/react-utils.tsx'
import { wait } from '../../utilities/various-utils.ts'
import { Button } from '../button/button.tsx'
import { IconButton } from '../icon-button/icon-button.tsx'
import { type ModalProps } from './_types.ts'

export type { ModalProps, ModalWidth } from './_types.ts'

let _globalStackIndex = 0

/** Basic modal component */
export const Modal = (rawProps: ModalProps) => {
	const props = useDefaults<ModalProps>(rawProps, {
		width: 'md',
		height: 'fit',
	})
	const { $blur, $color, $fontSize, $fontWeight, $spacing, $radius, $shadow, $zIndex } = useThemeService()
	const { translate } = useI18nService()
	const [stackIndex, setStackIndex] = useState(0)
	const rootRef = useRef<HTMLDivElement>(null)

	const ANIM_TIME = {
		SHOW: 300, // ms
		HIDE: 150, // ms
	}

	const tokens = {
		modalOverlayBgColor: props.noDismiss ? $color['modal-overlay-strong'] : $color['modal-overlay-subtle'],
		modalOverlayBlur: props.noDismiss ? `blur(${$blur['default']})` : `blur(${$blur['subtle']})`,
		modalMargin: $spacing['xs-9'],
		modalContentPX: $spacing['sm-0'],
		modalContentPY: $spacing['xs-8'],
		modalZIndex: `calc(${$zIndex['modal']} + ${stackIndex})`,
		modalWidth: (() => {
			if (props.width === 'xs') return $spacing['modal-xs']
			if (props.width === 'sm') return $spacing['modal-sm']
			if (props.width === 'md') return $spacing['modal-md']
			if (props.width === 'lg') return $spacing['modal-lg']
			if (props.width === 'xl') return $spacing['modal-xl']
			if (props.width === 'full') return '100%'
			return ''
		})(),
		modalHeight: (() => {
			if (props.height === 'fit') return 'fit-content'
			if (props.height === 'full') return '100%'
			return ''
		})(),
	}

	const cssModalOverlay: CSSObject = {
		...CSS__FIXED_OVERLAY,
		zIndex: -1,
		backgroundColor: tokens.modalOverlayBgColor,
		backdropFilter: tokens.modalOverlayBlur,
	}
	const cssModalCard: CSSObject = {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		minHeight: 0,
		width: '100%',
		maxWidth: tokens.modalWidth,
		height: tokens.modalHeight,
		maxHeight: '100%',
		margin: `0 auto`,
		border: `1px solid ${$color['border-shadow']}`,
		borderRadius: $radius['lg'],
		backgroundColor: $color['bg-page'],
		boxShadow: $shadow['lg'],
	}
	const cssModalContent: CSSObject = {
		display: 'flex',
		flexDirection: 'column',
		gap: $spacing['sm-0'],
		minHeight: 0,
		height: tokens.modalHeight,
		maxHeight: '100%',
		padding: `${tokens.modalContentPY} ${tokens.modalContentPX}`,
		backgroundColor: $color['bg-page'],
		color: $color['text-default'],
	}
	const cssModalTitle: CSSObject = {
		display: 'flex',
		alignItems: 'center',
		minHeight: $spacing['button-h-md'],
		marginRight: $spacing['button-h-md'],
		fontSize: $fontSize['lg'],
		fontWeight: $fontWeight['lg'],
	}
	const cssModalBody: CSSObject = {
		flex: '1 1 0%',
		margin: `0 calc(-1 * ${tokens.modalContentPX})`,
		padding: `${$spacing['a11y-padding']} 0`,
		paddingLeft: tokens.modalContentPX,
		paddingRight: `calc(${tokens.modalContentPX} - ${$spacing['scrollbar-w']})`,
		overflowY: 'scroll',
	}
	const cssModalFooter: CSSObject = {
		display: props.noFooter ? 'none' : 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginTop: $spacing['xs-5'],
	}
	const cssModalActions: CSSObject = {
		display: 'flex',
		alignItems: 'center',
		gap: $spacing['xs-9'],
		marginLeft: 'auto',
	}

	const isLastStackIndex = (index: number) => Boolean(index && index === _globalStackIndex)

	const computeStackIndex = () => {
		if (props.opened) {
			_globalStackIndex++
			setStackIndex(_globalStackIndex)
		} else {
			if (stackIndex === 0) return

			_globalStackIndex = _globalStackIndex > 1 ? _globalStackIndex - 1 : 0
			// Delay stack index to keep the modal above
			wait(ANIM_TIME.HIDE).then(() => setStackIndex(0))
		}
	}

	useEffect(() => {
		computeStackIndex()
	}, [props.opened])

	const slotCloseX = !props.noClose && (
		<IconButton
			tooltip={translate('ds.action.close')}
			variant="text-subtle"
			className="absolute!"
			css={{ top: tokens.modalContentPY, right: tokens.modalContentPY }}
			onClick={props.onClose}
		>
			<CloseSvg className="h-xs-7" />
		</IconButton>
	)

	const slotFooter = (
		<>
			{props.extras}

			<div css={cssModalActions}>
				{!props.noClose && (
					<Button variant="text-default" onClick={props.onClose}>
						{translate('ds.action.close')}
					</Button>
				)}
				{props.actions}
			</div>
		</>
	)

	const slotContent = (
		<>
			{/* TITLE */}
			<div css={cssModalTitle}>{props.title}</div>
			{/* CLOSE-X */}
			{slotCloseX}
			{/* BODY */}
			<div css={cssModalBody}>{props.children}</div>
			{/* FOOTER */}
			<div css={cssModalFooter}>{slotFooter}</div>
		</>
	)

	const transitionProps: TransitionOverride = {
		duration: ANIM_TIME.SHOW,
		exitDuration: ANIM_TIME.HIDE,
		transition: 'fade-down',
	}
	const cssRoot: CSSObject = {
		...CSS__FIXED_OVERLAY,
		display: props.opened ? 'block' : 'none',
		zIndex: tokens.modalZIndex,

		'.mantine-Modal-overlay': cssModalOverlay,
		'.mantine-Modal-inner': {
			padding: tokens.modalMargin,
			height: '100%',
		},
		'.mantine-Modal-content': {
			...cssModalCard,
			maxWidth: '100%',
		},
		'.mantine-Modal-header': cssModalTitle,
		'.mantine-Modal-body': cssModalContent,
	}

	useEffect(() => {
		if (props.opened) {
			// Wait for modal to be added to DOM
			wait(10).then(() => {
				const elem = rootRef.current?.querySelector('.mantine-Modal-content') as HTMLElement | null
				elem?.focus()
			})
		}
	}, [props.opened])

	return (
		<MantineModal
			ref={rootRef}
			opened={props.opened}
			size={cssModalCard.maxWidth as string}
			closeOnClickOutside={!props.noDismiss}
			closeOnEscape={!props.noDismiss}
			transitionProps={transitionProps}
			withCloseButton={false}
			lockScroll={false}
			css={cssRoot}
			keepMounted
			onClose={() => isLastStackIndex(stackIndex) && props.onClose?.()}
			onEnterTransitionEnd={() => props.onOpened?.()}
			onExitTransitionEnd={() => props.onClosed?.()}
		>
			{slotContent}
		</MantineModal>
	)
}
