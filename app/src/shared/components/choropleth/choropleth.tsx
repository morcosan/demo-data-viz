'use client'

import { useTranslation } from '@app-i18n'
import { wait } from '@ds/core'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { Tooltip } from '../tooltip/tooltip'
import { Chart } from './_partials/chart'
import { type ChoroplethProps } from './_types'

export type { ChoroData, ChoroEntry, ChoroplethProps, ChoroView } from './_types'

export const Choropleth = (props: ChoroplethProps) => {
  const { data, loading, toolbar, chartProps, className, style } = props
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  const preloadData = async () => {
    return Promise.all([
      import('@app/shared/utils/geo-data/world-map.json'),
      data.cities.length && import('@app/shared/utils/geo-data/cities.json'),
    ])
  }

  useEffect(() => {
    const init = async () => {
      await Promise.all([preloadData(), wait(200)]) // Show 200ms loading to avoid UI freeze on load
      setIsLoading(false)
    }
    init()
  }, [])

  return (
    <div className={cx('bg-color-bg-card flex w-full flex-col', className)} style={style}>
      {toolbar && (
        <div
          className={cx(
            'z-sticky bg-color-bg-card shadow-below-sm',
            'p-xs-1 gap-y-xs-1 gap-x-sm-1 flex flex-wrap items-center',
            'text-size-sm',
          )}
        >
          {toolbar}
        </div>
      )}

      <Tooltip label={t('dataViz.notice.mapKeyboard')} position="bottom" noFlip noHover noTouch>
        <div
          className={cx(
            'after:a11y-outline-proxy after:outline-offset-[-1px]!',
            'min-h-0 flex-1 overflow-hidden',
            chartProps?.className,
          )}
          style={chartProps?.style}
        >
          {isLoading || loading ? (
            <div className="flex-center flex h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <Chart {...props} className="h-full w-full" />
          )}
        </div>
      </Tooltip>
    </div>
  )
}
