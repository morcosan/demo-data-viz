import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { CSS__FIXED_OVERLAY } from '../../utilities/internal/css-utils'
import { ANIM_TIME, type ModalProps } from './_types'

interface Props extends ModalProps {
  isVisible: boolean
  stackIndex: number
}

export const useStyles = (props: Props) => {
  const { height, isVisible, noDismiss, noFooter, stackIndex, width } = props
  const { tokens } = useThemeService()

  const cssVars = {
    modalOverlayBgColor: noDismiss ? tokens.color['modal-overlay-strong'] : tokens.color['modal-overlay-subtle'],
    modalOverlayBlur: noDismiss ? `blur(${tokens.blur['default']})` : `blur(${tokens.blur['subtle']})`,
    modalMargin: tokens.spacing['xs-9'],
    modalContentPX: tokens.spacing['sm-0'],
    modalContentPY: tokens.spacing['xs-8'],
    modalZIndex: `calc(${tokens.zIndex['modal']} + ${stackIndex})`,
    modalWidth: (() => {
      if (width === 'xs') return tokens.spacing['modal-xs']
      if (width === 'sm') return tokens.spacing['modal-sm']
      if (width === 'md') return tokens.spacing['modal-md']
      if (width === 'lg') return tokens.spacing['modal-lg']
      if (width === 'xl') return tokens.spacing['modal-xl']
      if (width === 'full') return '100%'
      return ''
    })(),
    modalHeight: (() => {
      if (height === 'fit') return 'fit-content'
      if (height === 'full') return '100%'
      return ''
    })(),
  }

  const modalCardCss: CSSObject = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    width: '100%',
    maxWidth: cssVars.modalWidth,
    height: cssVars.modalHeight,
    maxHeight: '100%',
    margin: `0 auto`,
    border: `1px solid ${tokens.color['border-shadow']}`,
    borderRadius: tokens.radius['lg'],
    backgroundColor: tokens.color['bg-pane'],
    boxShadow: tokens.shadow['lg'],
  }
  const modalContentCss: CSSObject = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing['sm-0'],
    minHeight: 0,
    height: cssVars.modalHeight,
    maxHeight: '100%',
    padding: `${cssVars.modalContentPY} ${cssVars.modalContentPX}`,
    backgroundColor: tokens.color['bg-pane'],
    color: tokens.color['text-default'],
  }
  const titleCss: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    minHeight: tokens.spacing['button-h-md'],
    marginRight: tokens.spacing['button-h-md'],
    fontSize: tokens.fontSize['lg'],
    fontWeight: tokens.fontWeight['lg'],
  }
  const modalBodyCss: CSSObject = {
    flex: '1 1 0%',
    margin: `0 calc(-1 * ${cssVars.modalContentPX})`,
    padding: `${tokens.spacing['a11y-padding']} 0`,
    paddingLeft: cssVars.modalContentPX,
    paddingRight: `calc(${cssVars.modalContentPX} - ${tokens.spacing['scrollbar-w']})`,
    overflowY: 'scroll',
  }
  const footerCss: CSSObject = {
    display: noFooter ? 'none' : 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: tokens.spacing['xs-5'],
  }
  const actionsCss: CSSObject = {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing['xs-9'],
    marginLeft: 'auto',
  }
  const rootCss: CSSObject = {
    ...CSS__FIXED_OVERLAY,
    visibility: isVisible ? 'visible' : 'hidden',
    padding: cssVars.modalMargin,
    zIndex: cssVars.modalZIndex,
    transition: isVisible ? 'none' : `visibility ${ANIM_TIME.HIDE}ms ease-in`,
  }
  const overlayCss: CSSObject = {
    ...CSS__FIXED_OVERLAY,
    zIndex: -1,
    backgroundColor: cssVars.modalOverlayBgColor,
    backdropFilter: cssVars.modalOverlayBlur,
    opacity: isVisible ? 1 : 0,
    transition: isVisible ? `opacity ${ANIM_TIME.SHOW}ms ease-out` : `opacity ${ANIM_TIME.HIDE}ms ease-in`,
  }
  const modalCss: CSSObject = {
    ...modalCardCss,
    ...modalContentCss,
    transform: isVisible ? 'translateY(0)' : `translateY(calc(-2 * ${cssVars.modalMargin}))`,
    transition: `transform ${ANIM_TIME.SHOW}ms ease-out`,
  }

  return {
    actionsCss,
    cssVars,
    footerCss,
    modalBodyCss,
    modalCss,
    overlayCss,
    rootCss,
    titleCss,
  }
}
