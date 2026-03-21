export const changelog: ChangelogItem[] = [
  {
    version: 'v0.4.1',
    date: null,
    changes: {
      components: ['Fixed width for `TextField` component'],
    },
  },
  {
    version: 'v0.4.0',
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
    version: 'v0.3.1',
    date: '17-03-2026',
    changes: {
      components: ['Fixed text alignment inside `Button` component'],
    },
  },
  {
    version: 'v0.3.0',
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
    version: 'v0.2.7',
    date: '14-03-2026',
    changes: {
      utils: ['Added `suffix-raw.d.ts` file'],
    },
  },
  {
    version: 'v0.2.6',
    date: '11-03-2026',
    changes: {
      utils: ['Fixed eslint rule for DS paths'],
      docs: ['Added `argTypesEnhancers` for Storybook stories'],
    },
  },
  {
    version: 'v0.2.5',
    date: '01-03-2026',
    changes: {
      assets: ['Added more icons'],
    },
  },
  {
    version: 'v0.2.4',
    date: '27-02-2026',
    changes: {
      utils: ['Added `emotion.d.ts` file'],
    },
  },
  {
    version: 'v0.2.3',
    date: '25-02-2026',
    changes: {
      components: ['Refactored `Modal` component with `h1` tag for title'],
      assets: ['Refactored and fixed licensing for all assets'],
    },
  },
  {
    version: 'v0.2.2',
    date: '13-02-2026',
    changes: {
      tokens: ['Added `bg-highlight` color token'],
    },
  },
  {
    version: 'v0.2.1',
    date: '13-02-2026',
    changes: {
      docs: ['Added `PreviewMdxPage` component for Storybook stories'],
    },
  },
  {
    version: 'v0.2.0',
    date: '12-02-2026',
    changes: {
      breaking: ['Renamed all `*.svg` assets to `*.svgr`', 'Reset import config for `*.svg` files to be url-based'],
    },
  },
  {
    version: 'v0.1.3',
    date: '07-02-2026',
    changes: {
      breaking: ['Moved all asset files from `/dist` to `/src` folder'],
      docs: ['Improved config for Storybook stories'],
    },
  },
  {
    version: 'v0.1.2',
    date: '06-02-2026',
    changes: {
      tokens: ['Updated semantic color for page'],
    },
  },
  {
    version: 'v0.1.1',
    date: '01-02-2026',
    changes: {
      assets: ['Removed width and height from all svg files'],
    },
  },
  {
    version: 'v0.1.0',
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
]
