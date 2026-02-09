'use client'

import { ArrowBackSvg, IconButton } from '@ds/core.ts'
import { useQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type Dataset, EurostatApi } from './_api/eurostat-api.ts'
import { DatasetListing } from './_partials/dataset-listing.tsx'
import { DatasetPreview } from './_partials/dataset-preview.tsx'

type MobileView = 'listing' | 'preview'

export default function DatasetsPage() {
	const { t } = useTranslation()
	const { data: datasets, isLoading } = useQuery<Dataset[]>({
		queryKey: ['eurostat-datasets'],
		queryFn: EurostatApi.fetchDatasets,
	})
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
						datasets={datasets || []}
						loading={isLoading}
						onClickDataset={() => setMobileView('preview')}
					/>
					<DatasetPreview
						className={cx('flex-1', mobileView === 'preview' ? 'flex' : 'hidden lg:flex')}
						datasets={datasets || []}
					/>
				</Suspense>
			</div>
		</div>
	)
}
