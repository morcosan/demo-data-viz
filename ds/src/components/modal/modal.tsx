'use client'

import { useId } from 'react'
import { CloseSvg } from '../../assets/icons'
import { useI18nService } from '../../services/i18n-service'
import { useDefaults } from '../../utilities/react-utils'
import { Button } from '../button/button'
import { IconButton } from '../icon-button/icon-button'
import { type ModalProps } from './_types'
import { useEvents } from './_use-events'
import { useStyles } from './_use-styles'

export type { ModalProps, ModalWidth } from './_types'

/** Basic modal component */
export const Modal = (rawProps: ModalProps) => {
  const props = useDefaults<ModalProps>(rawProps, {
    width: 'md',
    height: 'fit',
  })
  const { translate } = useI18nService()
  const modalId = useId()
  const { focusTrap1Ref, focusTrap2Ref, isVisible, modalRef, stackIndex } = useEvents(props)
  const { cssModal, cssActions, cssModalBody, cssFooter, cssTitle, cssOverlay, cssRoot, tokens } = useStyles(
    props,
    isVisible,
    stackIndex,
  )

  return (
    <div css={cssRoot}>
      {/* OVERLAY */}
      <div css={cssOverlay} onClick={() => !props.noDismiss && props.onClose?.()} />

      {/* FOCUS TRAP */}
      <div ref={focusTrap1Ref} tabIndex={0} aria-hidden="true" />

      {/* MODAL */}
      <section ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={modalId} tabIndex={-1} css={cssModal}>
        {/* TITLE */}
        <h1 id={modalId} css={cssTitle}>
          {props.title}
        </h1>

        {/* CLOSE BUTTON */}
        {!props.noClose && (
          <IconButton
            tooltip={translate('ds.action.close')}
            variant="text-subtle"
            className="absolute!"
            css={{ top: tokens.modalContentPY, right: tokens.modalContentPY }}
            onClick={props.onClose}
          >
            <CloseSvg className="h-xs-7" />
          </IconButton>
        )}

        {/* BODY */}
        <div css={cssModalBody}>{props.children}</div>

        {/* FOOTER */}
        <div css={cssFooter}>
          {props.extras}

          <div css={cssActions}>
            {!props.noClose && (
              <Button variant="text-default" onClick={props.onClose}>
                {translate('ds.action.close')}
              </Button>
            )}
            {props.actions}
          </div>
        </div>
      </section>

      {/* FOCUS TRAP */}
      <div ref={focusTrap2Ref} tabIndex={0} aria-hidden="true" />
    </div>
  )
}
