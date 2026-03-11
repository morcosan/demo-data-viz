import { type Rule } from 'eslint'
import { type ImportDeclaration } from 'estree'

const enforceDistImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: { description: "Enforce DS imports to use '@ds/core.ts' or '/ds/dist/scripts/'" },
    messages: { useDistImport: "DS imports must use '@ds/core.ts' or '/ds/dist/scripts/'" },
  },
  create: (context: Rule.RuleContext) => ({
    ImportDeclaration: (node: ImportDeclaration) => {
      const path = String(node.source.value)
      const isDsImport = path.startsWith('ds/') || path.includes('../ds/')

      if (!isDsImport) return

      const isDocsImport = path.includes('/docs')
      const isScriptsImport = path.includes('/scripts')
      const relativePrefix = path.match(/^(\.\.\/)+/)?.[0] || '' // Tooling cannot use alias, only relative
      const validPath =
        isDocsImport && isScriptsImport
          ? `${relativePrefix}ds/dist/docs/scripts.ts`
          : isScriptsImport
            ? `${relativePrefix}ds/dist/scripts/`
            : isDocsImport
              ? '@ds/docs/core'
              : '@ds/core'
      const isValid = path.startsWith(validPath)

      if (!isValid) {
        context.report({
          node,
          messageId: 'useDistImport',
          fix: (fixer) => fixer.replaceText(node.source, `'${validPath}'`),
        })
      }
    },
  }),
}

export { enforceDistImports }
