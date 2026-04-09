'use client'

import { wait } from '@ds/core'
import { useCallback, useEffect, useState } from 'react'
import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import { TextHighlight } from '../text-highlight/text-highlight'
import { Canvas } from './_partials/canvas'
import { type ChoroplethCountry, type ChoroplethData, type ChoroplethProps } from './_types'

export type { ChoroplethCountry, ChoroplethData, ChoroplethProps }

export const Choropleth = (props: ChoroplethProps) => {
  const { data, loading, queries = [], nameFn: nameFnProp } = props
  const [isLoading, setIsLoading] = useState(false)

  const nameFn = useCallback(
    (value: string) => {
      const lcValue = value.toLowerCase()
      const query = queries?.find((query) => lcValue.includes(query.toLowerCase())) || ''

      return nameFnProp ? nameFnProp(value, query) : <TextHighlight text={value} query={query} />
    },
    [nameFnProp, queries],
  )

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
        <Canvas countries={data.countries} cities={data.cities} nameFn={nameFn} className="h-full w-full" />
      )}
    </div>
  )
}
