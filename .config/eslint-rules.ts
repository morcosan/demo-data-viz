type RulesRecord = import('eslint').Linter.RulesRecord

const baseRules: RulesRecord = {
  'max-lines': ['error', 300],

  'react-hooks/exhaustive-deps': 'off', // This rule is broken, it gives false positives all the time
  'react-hooks/set-state-in-effect': 'off', // TODO: fix this issue

  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-expressions': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', { caughtErrors: 'none' }],

  'import/extensions': ['error', 'ignorePackages'],
}

export { baseRules }
