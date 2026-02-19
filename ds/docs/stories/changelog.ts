export const changelog: ChangelogItem[] = [
  {
    version: 'v0.1.0',
    date: null,
    changes: {
      tokens: ['Added basic tokens for color, elevation, radius, spacing and typography'],
      components: [
        'Created Button component',
        'Created IconButton component',
        'Created Modal component',
        'Created TextField component',
      ],
      services: [
        'Added ThemeService system with `light` and `dark` themes',
        'Added UiLibraryService system with Mantine library',
        'Added A11yService system with `default` and `pointer` modes',
      ],
      assets: ['Added 20+ icons and 10+ logos'],
      docs: ['Created basic Storybook docs for design tokens, web core and versioning'],
    },
  },
]
