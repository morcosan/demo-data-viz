'use client'

import { useId } from 'react'
import { CloseSvg } from '../../assets/icons'
import { useI18nService } from '../../services/i18n-service'
import { useDataProps } from '../../utilities/react-utils'
import { Button } from '../button/button'
import { IconButton } from '../icon-button/icon-button'
import { type ModalProps } from './_types'
import { useEvents } from './_use-events'
import { useStyles } from './_use-styles'

export type { ModalProps, ModalWidth } from './_types'

/** Basic modal component */
export const Modal = (props: ModalProps) => {
  const { actions, children, extras, height = 'fit', noClose, noDismiss, onClose, title, width = 'md' } = props
  const { translate } = useI18nService()
  const { focusTrap1Ref, focusTrap2Ref, isVisible, modalRef, stackIndex } = useEvents({ ...props, width, height })
  const { modalCss, actionsCss, modalBodyCss, footerCss, titleCss, overlayCss, rootCss, cssVars } = useStyles({
    ...props,
    height,
    isVisible,
    stackIndex,
    width,
  })
  const dataProps = useDataProps(props)
  const modalId = useId()

  return (
    <div css={rootCss} {...dataProps}>
      {/* OVERLAY */}
      <div css={overlayCss} onClick={() => !noDismiss && onClose?.()} />

      {/* FOCUS TRAP */}
      <div ref={focusTrap1Ref} tabIndex={0} aria-hidden="true" />

      {/* MODAL */}
      <section ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={modalId} tabIndex={-1} css={modalCss}>
        {/* TITLE */}
        <h1 id={modalId} css={titleCss}>
          {title}
        </h1>

        {/* CLOSE BUTTON */}
        {!noClose && (
          <IconButton
            tooltip={translate('ds.action.close')}
            variant="text-subtle"
            className="absolute!"
            css={{ top: cssVars.modalContentPY, right: cssVars.modalContentPY }}
            onClick={onClose}
          >
            <CloseSvg className="h-xs-7" />
          </IconButton>
        )}

        {/* BODY */}
        <div css={modalBodyCss}>{children}</div>

        {/* FOOTER */}
        <div css={footerCss}>
          {extras}

          <div css={actionsCss}>
            {!noClose && (
              <Button variant="text-default" onClick={onClose}>
                {translate('ds.action.close')}
              </Button>
            )}
            {actions}
          </div>
        </div>
      </section>

      {/* FOCUS TRAP */}
      <div ref={focusTrap2Ref} tabIndex={0} aria-hidden="true" />
    </div>
  )
}
