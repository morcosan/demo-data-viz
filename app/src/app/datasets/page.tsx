'use client'

import { ErrorBoundary } from '@app-components'
import { useTranslation } from '@app-i18n'
import { Suspense, useState } from 'react'
import { DatasetListing } from './_partials/dataset-listing'
import { DatasetPreview } from './_partials/dataset-preview'
import { type MobileView } from './_types'

export default function DatasetsPage() {
  const { t } = useTranslation()
  const [mobileView, setMobileView] = useState<MobileView>('listing')

  const handleBackClick = () => setMobileView('listing')

  return (
    <div className="gap-xs-9 flex h-full w-full">
      {/* LEFT SIDE */}
      <div className={cx('lg:w-xl-0 min-w-xl-0 w-full flex-col', mobileView === 'listing' ? 'flex' : 'hidden lg:flex')}>
        <h1 className="text-size-lg lg:text-size-xl font-weight-xl mb-xs-5 lg:mb-xs-7 ml-px">
          {t('dataViz.label.datasets')}
        </h1>
        <Suspense fallback={null}>
          <DatasetListing className="min-h-0 flex-1" onClickDataset={() => setMobileView('preview')} />
        </Suspense>
      </div>

      {/* RIGHT SIDE */}
      <div className={cx('min-w-0 flex-1', mobileView === 'preview' ? 'flex' : 'hidden lg:flex')}>
        <Suspense fallback={null}>
          <ErrorBoundary>
            <DatasetPreview onClickBack={handleBackClick} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  )
}
