export const CHANGELOG: ChangelogItem[] = [
  {
    version: '0.10.0',
    date: '16-05-2026',
    changes: {
      components: ['Added `data-*` props to all components'],
      utils: ['Added `useDataProps` utility hook', 'Added `data-*` global type definition for html elements'],
      docs: ['Added docs for `useRefHandle` and `useDataProps`'],
      internal: ['Refactored `__dirname` in config files'],
    },
  },
  {
    version: '0.9.0',
    date: '25-04-2026',
    changes: {
      docs: [
        'Added indicator for current version in changelog page',
        'Split color tokens page into two pages (primitive vs semantic)',
        'Added `DocsColorSwatch` docs component',
      ],
      internal: ['Added pipeline for building token CSS files', 'Renamed package.json scripts'],
    },
  },
  {
    version: '0.8.1',
    date: '21-04-2026',
    changes: {
      tokens: ['Adjusted spacing tokens for button'],
      components: [
        'Added `ariaDescribedBy` prop to `TextField` component',
        'Added `not-allowed` cursor to disabled `TextField` component',
      ],
      assets: ['Updated `info.svg` icon'],
    },
  },
  {
    version: '0.8.0',
    date: '17-04-2026',
    changes: {
      tokens: ['Added `blue-*`, `border-highlight` and `map-*` color tokens'],
      components: ['Added `onFocus` and `onBlur` keys to `ReactProps` type'],
      utils: ['Added `after:a11y-outline-proxy` helper class for a11y outline'],
    },
  },
  {
    version: '0.7.0',
    date: '06-04-2026',
    changes: {
      deprecated: ['Deprecated `useDefaults` utility hook'],
      internal: ['Refactored props setup for all components and hooks'],
    },
  },
  {
    version: '0.6.0',
    date: '05-04-2026',
    changes: {
      tokens: ['Added `Geist` font files and updated font-family tokens'],
      components: ['Adjusted text alignment inside components'],
      services: ['Updated default font-family for Mantine config'],
    },
  },
  {
    version: '0.5.0',
    date: '29-03-2026',
    changes: {
      tokens: ['Added `chart-bar-*` color tokens'],
    },
  },
  {
    version: '0.4.1',
    date: '29-03-2026',
    changes: {
      components: ['Fixed width for `TextField` component'],
    },
  },
  {
    version: '0.4.0',
    date: '20-03-2026',
    changes: {
      breaking: ['Renamed ref interface for `TextField` component'],
      components: [
        'Refactored all components using custom implementation',
        'Fixed text alignment inside `TextField` component',
      ],
      utils: ['Added `ref?: Ref<T>` to global `ReactProps` interface', 'Added `useRefHandle` utility hook'],
      docs: [
        'Improved story config utilities and styles',
        'Added shortcuts config for Storybook stories with `StoryShortcut` global type',
        'Added `DocsTooltip` component',
      ],
    },
  },
  {
    version: '0.3.1',
    date: '17-03-2026',
    changes: {
      components: ['Fixed text alignment inside `Button` component'],
    },
  },
  {
    version: '0.3.0',
    date: '16-03-2026',
    changes: {
      tokens: [
        'Added font-family tokens for sans-serif and monospace',
        'Added `-mono` variant to font-size tokens',
        'Updated color token for `bg-coding`',
      ],
      docs: [
        'Applied font-family token to all stories and improved story styles',
        'Improved typography docs page',
        'Refactored changelog',
      ],
    },
  },
  {
    version: '0.2.7',
    date: '14-03-2026',
    changes: {
      utils: ['Added `suffix-raw.d.ts` file'],
    },
  },
  {
    version: '0.2.6',
    date: '11-03-2026',
    changes: {
      utils: ['Fixed eslint rule for DS paths'],
      docs: ['Added `argTypesEnhancers` for Storybook stories'],
    },
  },
  {
    version: '0.2.5',
    date: '01-03-2026',
    changes: {
      assets: ['Added more icons'],
    },
  },
  {
    version: '0.2.4',
    date: '27-02-2026',
    changes: {
      utils: ['Added `emotion.d.ts` file'],
    },
  },
  {
    version: '0.2.3',
    date: '25-02-2026',
    changes: {
      components: ['Refactored `Modal` component with `h1` tag for title'],
      assets: ['Refactored and fixed licensing for all assets'],
    },
  },
  {
    version: '0.2.2',
    date: '13-02-2026',
    changes: {
      tokens: ['Added `bg-highlight` color token'],
    },
  },
  {
    version: '0.2.1',
    date: '13-02-2026',
    changes: {
      docs: ['Added `PreviewMdxPage` component for Storybook stories'],
    },
  },
  {
    version: '0.2.0',
    date: '12-02-2026',
    changes: {
      breaking: ['Renamed all `*.svg` assets to `*.svgr`', 'Reset import config for `*.svg` files to be url-based'],
    },
  },
  {
    version: '0.1.3',
    date: '07-02-2026',
    changes: {
      breaking: ['Moved all asset files from `/dist` to `/src` folder'],
      docs: ['Improved config for Storybook stories'],
    },
  },
  {
    version: '0.1.2',
    date: '06-02-2026',
    changes: {
      tokens: ['Updated semantic color for page'],
    },
  },
  {
    version: '0.1.1',
    date: '01-02-2026',
    changes: {
      assets: ['Removed width and height from all svg files'],
    },
  },
  {
    version: '0.1.0',
    date: '20-12-2025',
    changes: {
      tokens: ['Added basic tokens for color, elevation, radius, spacing and typography'],
      components: ['Created `Button`, `IconButton`, `Modal`, `TextField` components'],
      services: [
        'Added `ThemeService` with `light` and `dark` themes',
        'Added `UiLibraryService` with Mantine library',
        'Added `A11yService` with `default` and `pointer` modes',
      ],
      assets: ['Added basic icons and logos'],
      docs: ['Created basic Storybook docs for design tokens, web core and versioning'],
    },
  },
] as const
