'use client'

import { useTranslation } from '@app-i18n'
import { WarningSvg } from '@ds/core.ts'
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary'

export const ErrorBoundary = (props: ReactProps) => {
  const { t } = useTranslation()

  const fallbackRender = ({ error }: FallbackProps) => {
    const message = String(error instanceof Error ? error.message : error)

    return (
      <div className={cx('flex-center p-xs-3 flex h-full w-full flex-1', props.className)}>
        <div
          className={cx(
            'p-xs-7 lg:p-sm-0 flex flex-wrap',
            'bg-color-danger-card-bg border-color-danger-card-text rounded-md border shadow-sm',
            'text-color-danger-card-text font-weight-lg',
          )}
        >
          <WarningSvg className="h-xs-9 mr-xs-5 mb-xs-5 mt-xs-0 -ml-xs-0" />
          <div>
            <div className="mb-xs-5">{t('core.label.unexpectedError')}</div>
            <div className="text-color-danger-card-subtext text-size-sm">{message}</div>
          </div>
        </div>
      </div>
    )
  }

  return <ReactErrorBoundary fallbackRender={fallbackRender}>{props.children}</ReactErrorBoundary>
}
