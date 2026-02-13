'use client'

import { QueryKey, useQuery } from '@app-api'
import { EmptyState, LayoutPane, LoadingSpinner } from '@app-components'
import { useTranslation } from '@app-i18n'
import { formatNumber, useLocalStorage, useVirtualScroll, type VirtualItem } from '@app-utils'
import { SearchSvg, TextField, TOKENS__SPACING } from '@ds/core.ts'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { EurostatApi } from '../_api/eurostat-api.ts'
import { type BaseDataset, type ViewedDatasets } from '../_types.ts'
import { DatasetItem } from './dataset-item.tsx'

interface Props extends ReactProps {
	onClickDataset?: () => void
}

export const DatasetListing = (props: Props) => {
	const { t } = useTranslation()
	const storage = useLocalStorage<ViewedDatasets>(QueryKey.VIEWED_DATASETS)
	const searchParams = useSearchParams()
	const idParam = searchParams.get('id')
	const [searchKeyword, setSearchKeyword] = useState('')
	const { data, isLoading, error } = useQuery<BaseDataset[]>({
		queryKey: [QueryKey.EUROSTAT_DATASETS],
		queryFn: EurostatApi.fetchDatasets,
	})
	const allDatasets = data || []

	const datasets = useMemo((): BaseDataset[] => {
		const viewedStats = storage.data || {}
		const keyword = searchKeyword.trim().toLowerCase()
		const filtered = keyword
			? allDatasets.filter((dataset: BaseDataset) => dataset.title?.toLowerCase().includes(keyword))
			: allDatasets

		return filtered.map((dataset: BaseDataset) => ({
			...dataset,
			stats: viewedStats[dataset.id] || dataset.stats,
		}))
	}, [allDatasets, searchKeyword, storage.data])

	const itemHeight = parseInt(TOKENS__SPACING['md-2'].$value)
	const gapSize = parseInt(TOKENS__SPACING['xs-1'].$value)
	const { vItems, vTotalSize, vScrollerRef } = useVirtualScroll({
		count: datasets.length,
		itemSize: itemHeight + gapSize,
	})

	const handleSearchChange = (value: string) => setSearchKeyword(value)

	return (
		<LayoutPane className={cx('flex flex-col', props.className)}>
			<div className="shadow-below-sm z-sticky p-scrollbar-w relative">
				<TextField
					value={searchKeyword}
					disabled={isLoading}
					id="dataset-search"
					size="sm"
					placeholder={t('core.placeholder.search')}
					ariaLabel={t('dataViz.label.datasetSearch')}
					prefix={<SearchSvg className="ml-xs-2 w-xs-5 mt-px" />}
					onChange={handleSearchChange}
				/>

				<div className="text-size-xs mt-xs-1 ml-xs-0 -mb-xs-1">
					{t('dataViz.label.datasetResults', { total: formatNumber(datasets.length) })}
				</div>
			</div>

			{isLoading ? (
				<div className="flex-center flex h-full">
					<LoadingSpinner />
				</div>
			) : error ? (
				<div className="flex-center flex h-full">
					<EmptyState type="error">{t('dataViz.error.fetchDatasets')}</EmptyState>
				</div>
			) : (
				<div ref={vScrollerRef} className="px-scrollbar-w py-a11y-scrollbar flex-1 overflow-y-auto">
					<ul className="-mb-xs-1 relative" style={{ height: vTotalSize }}>
						{vItems.map((vItem: VirtualItem) => (
							<DatasetItem
								key={datasets[vItem.index].id}
								dataset={datasets[vItem.index]}
								keyword={searchKeyword}
								height={itemHeight}
								selected={idParam === datasets[vItem.index].id}
								className="absolute top-0 left-0 w-full"
								style={{ transform: `translateY(${vItem.start}px)` }}
								onClick={props.onClickDataset}
							/>
						))}
					</ul>
				</div>
			)}
		</LayoutPane>
	)
}
