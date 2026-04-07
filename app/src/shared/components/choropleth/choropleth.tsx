'use client'

import { useDefaults } from '@ds/core'
import { type ReactNode, useMemo } from 'react'
import Plot from 'react-plotly.js'

export type ChoroplethData = { entries: ChoroplethEntry[] } // Data wrapper required due to Storybook limitations
export type ChoroplethEntry = {
  key: string // ISO-3 country code
  label: string
  value: number
}

export interface ChoroplethProps extends ReactProps {
  data: ChoroplethData
  labelFn?: (value: string, query: string) => ReactNode
  queries?: string[]
  loading?: boolean
  toolbar?: ReactNode
}

export const Choropleth = (rawProps: ChoroplethProps) => {
  const props = useDefaults(rawProps, { queries: [] })
  const { entries } = props.data

  const config = useMemo(
    () => ({
      locations: entries.map((e) => e.key),
      z: entries.map((e) => e.value),
      text: entries.map((e) => e.label),
    }),
    [entries],
  )

  return (
    <div className={cx('bg-color-bg-card w-full', props.className)} style={props.style}>
      <Plot
        data={[
          {
            ...config,
            type: 'choropleth',
            locationmode: 'ISO-3',
            hovertemplate: '<b>%{text}</b><br>Value: %{z}<extra></extra>',
            colorscale: 'Viridis',
            colorbar: {
              thickness: 15,
              len: 0.6,
            },
            marker: {
              line: { color: 'white', width: 0.5 },
            },
          },
        ]}
        layout={{
          margin: { t: 0, b: 0, l: 0, r: 0 },
          geo: {
            showcoastlines: true,
            coastlinecolor: '#aaa',
            showland: true,
            landcolor: '#f0f0f0',
            showocean: true,
            oceancolor: '#d6eaf8',
            showframe: false,
          },
          paper_bgcolor: 'transparent',
        }}
        config={{
          responsive: true,
          displayModeBar: false,
        }}
        className="h-full w-full"
        useResizeHandler
      />
    </div>
  )
}
