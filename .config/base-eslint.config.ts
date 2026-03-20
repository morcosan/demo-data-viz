type Config = import('eslint').Linter.Config

const baseConfig: Config[] = [
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'max-lines': ['error', 300],

      'react/prop-types': 'off', // Useless for TypeScript
      'react/no-unknown-property': ['error', { ignore: ['css'] }], // Allow Emotion

      'react-hooks/exhaustive-deps': 'off', // Bug: This rule is broken, it gives false positives all the time
      'react-hooks/refs': 'off', // Bug: This rule is broken, it gives false positives all the time
      'react-hooks/set-state-in-effect': 'off', // TODO: fix this issue

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { caughtErrors: 'none' }],

      'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
    },
  },
  {
    files: ['**/*.d.ts', './*.ts', '.storybook/main.ts', '**/scripts/**/*.ts'],
    rules: {
      'import/extensions': ['error', 'ignorePackages', { ts: 'always' }],
    },
  },
]

export { baseConfig }
