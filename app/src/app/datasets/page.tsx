'use client'

import { ErrorBoundary } from '@app-components'
import { useTranslation } from '@app-i18n'
import { ArrowBackSvg, IconButton } from '@ds/core'
import { Suspense, useState } from 'react'
import { DatasetListing } from './_partials/dataset-listing'
import { DatasetPreview } from './_partials/dataset-preview'

type MobileView = 'listing' | 'preview'

export default function DatasetsPage() {
  const { t } = useTranslation()
  const [mobileView, setMobileView] = useState<MobileView>('listing')

  const handleBackClick = () => setMobileView('listing')

  return (
    <div className="flex h-full w-full flex-col">
      <div className="gap-xs-1 mb-xs-5 lg:mb-xs-7 flex items-center">
        <IconButton
          tooltip={t('core.action.back')}
          className={cx(mobileView === 'listing' && 'hidden!', 'translate-y-px lg:hidden!')}
          onClick={handleBackClick}
        >
          <ArrowBackSvg className="h-xs-7" />
        </IconButton>
        <h1 className="text-size-lg lg:text-size-xl font-weight-xl">{t('dataViz.label.datasets')}</h1>
      </div>

      <div className="gap-xs-9 flex min-h-0 flex-1">
        <Suspense fallback={null}>
          <DatasetListing
            className={cx('lg:w-xl-0 w-full', mobileView === 'listing' ? 'flex' : 'hidden lg:flex')}
            onClickDataset={() => setMobileView('preview')}
          />
          <ErrorBoundary>
            <DatasetPreview className={cx('min-w-0 flex-1', mobileView === 'preview' ? 'flex' : 'hidden lg:flex')} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  )
}
