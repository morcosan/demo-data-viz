'use client'

import { wait } from '@ds/core'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { Chart } from './_partials/chart'
import { type ChoroplethProps } from './_types'

export type * from './_types'

export const Choropleth = (props: ChoroplethProps) => {
  const { data, loading, toolbar, className, style } = props
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Show 200ms loading to avoid UI freeze due to large data
    setIsLoading(true)
    wait(200).then(() => setIsLoading(false))
  }, [data])

  return (
    <div className={cx('bg-color-bg-card flex w-full flex-col', className)} style={style}>
      {toolbar}

      <div className="a11y-outline-proxy min-h-0 flex-1">
        {isLoading || loading ? (
          <div className="flex-center flex h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <Chart {...props} className="h-full w-full" />
        )}
      </div>
    </div>
  )
}
