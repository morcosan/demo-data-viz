import { getTokenValue_COLOR, useThemeService } from '@ds/core'
import { type Config, type Data, type Layout } from 'plotly.js-dist-min'
import { useEffect, useMemo, useRef } from 'react'
import { type ChoroplethCountry } from '../_types'

type PlotlyData = Partial<Data>
type PlotlyConfig = Partial<Config>
type PlotlyLayout = Partial<Layout>

export interface Props extends ReactProps {
  countries: ChoroplethCountry[]
}

export const PlotlyCanvas = (props: Props) => {
  const { countries, className } = props
  const { colorTheme } = useThemeService()
  const canvasRef = useRef<HTMLDivElement>(null)
  const plotlyRef = useRef<typeof import('plotly.js-dist-min')>(null)

  const plotlyData = useMemo((): PlotlyData => {
    return {
      locations: countries.map((e) => e.iso3),
      z: countries.map((e) => e.value),
      text: countries.map((e) => e.name),
      type: 'choropleth',
      locationmode: 'ISO-3',
      hovertemplate: '<b>%{text}</b><br>Value: %{z}<extra></extra>',
      colorscale: [
        [0, getTokenValue_COLOR('map-value-min', colorTheme)],
        [1, getTokenValue_COLOR('map-value-max', colorTheme)],
      ],
      colorbar: {
        thickness: 15,
        len: 0.6,
      },
      marker: {
        line: { color: 'white', width: 0.5 },
      },
    }
  }, [countries, colorTheme])

  const plotlyLayout: PlotlyLayout = {
    margin: { t: 0, b: 0, l: 0, r: 0 },
    geo: {
      showland: true,
      landcolor: getTokenValue_COLOR('map-land', colorTheme),
      showocean: true,
      oceancolor: getTokenValue_COLOR('map-ocean', colorTheme),
      showframe: false,
      showcountries: true,
    },
    paper_bgcolor: 'transparent',
    autosize: true,
  }

  const plotlyConfig: PlotlyConfig = {
    responsive: true,
    displayModeBar: false,
  }

  useEffect(() => {
    import('plotly.js-dist-min').then((plotly) => {
      if (!canvasRef.current) return
      plotlyRef.current = plotly
      plotly.newPlot(canvasRef.current, [plotlyData], plotlyLayout, plotlyConfig)
    })

    return () => {
      if (!canvasRef.current) return
      plotlyRef.current?.purge(canvasRef.current)
    }
  }, [plotlyData])

  return <div ref={canvasRef} className={className} />
}
