import Plotly from 'plotly.js-dist-min'
import { useEffect, useMemo, useRef } from 'react'
import { type ChoroplethEntry } from '../_types'

export interface Props extends ReactProps {
  entries: ChoroplethEntry[]
}

export const MapCanvas = (props: Props) => {
  const { entries, className } = props
  const canvasReF = useRef(null)

  const config = useMemo(
    () => ({
      locations: entries.map((e) => e.key),
      z: entries.map((e) => e.value),
      text: entries.map((e) => e.label),
    }),
    [entries],
  )

  useEffect(() => {
    if (!canvasReF.current) return

    Plotly.newPlot(
      canvasReF.current,
      [
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
      ],
      {
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
        autosize: true,
      },
      {
        responsive: true,
        displayModeBar: false,
      },
    )

    return () => {
      canvasReF.current && Plotly.purge(canvasReF.current)
    }
  }, [])

  return <div ref={canvasReF} className={className} />
}
