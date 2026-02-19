import { type Rule } from 'eslint'
import { type ImportDeclaration } from 'estree'

const enforceDistImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: { description: "Enforce DS imports to use '@ds/core.ts' or '/ds/dist/tooling/'" },
    messages: { useDistImport: "DS imports must use '@ds/core.ts' or '/ds/dist/tooling/'" },
  },
  create: (context: Rule.RuleContext) => ({
    ImportDeclaration: (node: ImportDeclaration) => {
      const path = String(node.source.value)
      const isDsImport = path.includes('../ds/') // `@ds/` import is valid due to `ds/dist/` alias

      if (!isDsImport) return

      const isDocsImport = path.includes('/docs')
      const isToolingImport = path.includes('/tooling')
      const relativePrefix = path.match(/^(\.\.\/)+/)?.[0] || '' // Tooling cannot use alias, only relative
      const validPath =
        isDocsImport && isToolingImport
          ? `${relativePrefix}ds/dist/docs/tooling.ts`
          : isToolingImport
            ? `${relativePrefix}ds/dist/tooling/`
            : isDocsImport
              ? '@ds/docs/core.ts'
              : '@ds/core.ts'
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
