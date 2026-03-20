import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { CSS__FIXED_OVERLAY } from '../../utilities/internal/css-utils'
import { ANIM_TIME, type ModalProps } from './_types'

export const useStyles = (props: ModalProps, isVisible: boolean, stackIndex: number) => {
  const { $blur, $color, $fontSize, $fontWeight, $spacing, $radius, $shadow, $zIndex } = useThemeService()

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
    backgroundColor: $color['bg-pane'],
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
    backgroundColor: $color['bg-pane'],
    color: $color['text-default'],
  }
  const cssTitle: CSSObject = {
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
  const cssFooter: CSSObject = {
    display: props.noFooter ? 'none' : 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: $spacing['xs-5'],
  }
  const cssActions: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    gap: $spacing['xs-9'],
    marginLeft: 'auto',
  }
  const cssRoot: CSSObject = {
    ...CSS__FIXED_OVERLAY,
    visibility: isVisible ? 'visible' : 'hidden',
    padding: tokens.modalMargin,
    zIndex: tokens.modalZIndex,
    transition: isVisible ? 'none' : `visibility ${ANIM_TIME.HIDE}ms ease-in`,
  }
  const cssOverlay: CSSObject = {
    ...CSS__FIXED_OVERLAY,
    zIndex: -1,
    backgroundColor: tokens.modalOverlayBgColor,
    backdropFilter: tokens.modalOverlayBlur,
    opacity: isVisible ? 1 : 0,
    transition: isVisible ? `opacity ${ANIM_TIME.SHOW}ms ease-out` : `opacity ${ANIM_TIME.HIDE}ms ease-in`,
  }
  const cssModal: CSSObject = {
    ...cssModalCard,
    ...cssModalContent,
    transform: isVisible ? 'translateY(0)' : `translateY(calc(-2 * ${tokens.modalMargin}))`,
    transition: `transform ${ANIM_TIME.SHOW}ms ease-out`,
  }

  return {
    cssActions,
    cssFooter,
    cssModal,
    cssModalBody,
    cssOverlay,
    cssRoot,
    cssTitle,
    tokens,
  }
}
