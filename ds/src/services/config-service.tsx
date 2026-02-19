'use client'

import { createTheme, MantineProvider } from '@mantine/core'
import variablesCSS from '@mantine/core/styles/default-css-variables.css?raw'
import globalCSS from '@mantine/core/styles/global.css?raw'

// Comment out everything related to outline
const fixOutlineCSS = (css?: string) => css?.replace(/^\s*(outline(?:-[^:\s]+)?\s*:[^;]+;)\s*$/gim, '/* $1 */')

const ConfigService = (props: ReactProps) => {
  // Nextjs cannot import ?raw, it will import files as CSS and give undefined vars
  const mantineTheme = createTheme({})
  const mantineCSS = `
		${variablesCSS || ''}
		${fixOutlineCSS(globalCSS) || ''}
	`
  const extraCSS = `
		body {
			background-color: unset;
			color: unset;
			font-size: unset;
			line-height: unset;
		}
	`

  return (
    <MantineProvider theme={mantineTheme}>
      <style>{mantineCSS}</style>
      <style>{extraCSS}</style>
      {props.children}
    </MantineProvider>
  )
}

export { ConfigService }
