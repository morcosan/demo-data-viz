'use client'

import { wait } from '@ds/core'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { EchartsCanvas } from './_partials/echarts-canvas'
import { type ChoroplethCountry, type ChoroplethData, type ChoroplethProps } from './_types'

export type { ChoroplethCountry, ChoroplethData, ChoroplethProps }

export const Choropleth = (props: ChoroplethProps) => {
  const { data, loading, queries = [] } = props
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Show 200ms loading to avoid UI freeze due to large data
    setIsLoading(true)
    wait(200).then(() => setIsLoading(false))
  }, [data])

  return (
    <div className={cx('bg-color-bg-card w-full', props.className)} style={props.style}>
      {isLoading || loading ? (
        <div className="flex-center flex h-full">
          <LoadingSpinner />
        </div>
      ) : (
        // <PlotlyCanvas entries={data.entries} className="h-full w-full" />
        <EchartsCanvas countries={data.countries} className="h-full w-full" />
      )}
    </div>
  )
}
