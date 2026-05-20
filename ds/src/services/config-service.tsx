'use client'

import { createTheme, MantineProvider } from '@mantine/core'
import variablesCSS from '@mantine/core/styles/default-css-variables.css?raw'
import globalCSS from '@mantine/core/styles/global.css?raw'
import { getTokenValue, TOKENS } from '../styles/tokens'

// Comment out everything related to outline
const fixOutlineCSS = (css?: string) => css?.replace(/^\s*(outline(?:-[^:\s]+)?\s*:[^;]+;)\s*$/gim, '/* $1 */')

const ConfigService = ({ children }: ReactProps) => {
  // Nextjs cannot import ?raw, it will import files as CSS and give undefined vars
  const mantineTheme = createTheme({
    fontFamily: getTokenValue(TOKENS.FONT_FAMILY, 'sans'),
    fontFamilyMonospace: getTokenValue(TOKENS.FONT_FAMILY, 'mono'),
  })
  const mantineCSS = `
		${variablesCSS || ''}
		${fixOutlineCSS(globalCSS) || ''}
	`

  return (
    <MantineProvider theme={mantineTheme}>
      <style>{mantineCSS}</style>
      {children}
    </MantineProvider>
  )
}

export { ConfigService }
