'use client'

import { useId } from 'react'
import { CloseSvg } from '../../assets/icons'
import { useI18nService } from '../../services/i18n-service'
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
  const { cssModal, cssActions, cssModalBody, cssFooter, cssTitle, cssOverlay, cssRoot, tokens } = useStyles({
    ...props,
    height,
    isVisible,
    stackIndex,
    width,
  })
  const modalId = useId()

  return (
    <div css={cssRoot}>
      {/* OVERLAY */}
      <div css={cssOverlay} onClick={() => !noDismiss && onClose?.()} />

      {/* FOCUS TRAP */}
      <div ref={focusTrap1Ref} tabIndex={0} aria-hidden="true" />

      {/* MODAL */}
      <section ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={modalId} tabIndex={-1} css={cssModal}>
        {/* TITLE */}
        <h1 id={modalId} css={cssTitle}>
          {title}
        </h1>

        {/* CLOSE BUTTON */}
        {!noClose && (
          <IconButton
            tooltip={translate('ds.action.close')}
            variant="text-subtle"
            className="absolute!"
            css={{ top: tokens.modalContentPY, right: tokens.modalContentPY }}
            onClick={onClose}
          >
            <CloseSvg className="h-xs-7" />
          </IconButton>
        )}

        {/* BODY */}
        <div css={cssModalBody}>{children}</div>

        {/* FOOTER */}
        <div css={cssFooter}>
          {extras}

          <div css={cssActions}>
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
