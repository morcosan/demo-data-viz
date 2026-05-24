import type { Rule } from 'eslint'
import { z, type ZodArray, type ZodObject } from 'zod'
import { getLocFromPath } from './json-utils.ts'

type ZodIssue = z.ZodError['issues'][number]
type ErrorId = {
  invalidJson: string
  invalidKeyExtra: string
  invalidKeyMissing: string
  invalidSchema: string
}

const defineJsonValidation = (schema: ZodArray | ZodObject, errorId: ErrorId) => {
  return (context: Rule.RuleContext) => ({
    // Using @eslint/json parser
    Document: (node: any) => {
      let json: unknown
      try {
        json = JSON.parse(context.sourceCode.getText())
      } catch (error) {
        context.report({
          node,
          messageId: errorId.invalidJson,
          data: { message: error instanceof SyntaxError ? error.message : String(error) },
        })
        return
      }

      const result = schema.safeParse(json)

      if (!result.success) {
        flattenUnionIssues(result.error.issues).forEach((issue) => {
          if (issue.code === 'unrecognized_keys') {
            issue.keys.forEach((key) => {
              const keyLoc = getLocFromPath(node, [...issue.path, key])
              context.report({
                node,
                loc: keyLoc ?? node.loc!,
                messageId: errorId.invalidKeyExtra,
                data: { key },
              })
            })
          } else {
            const key = issue.path.join('.')
            const loc = getLocFromPath(node, issue.path)
            context.report({
              node,
              loc: loc ?? node.loc!,
              messageId: key ? errorId.invalidKeyMissing : errorId.invalidSchema,
              data: {
                key: String(key ?? ''),
                error: issue.message.replace('Invalid input: ', '').replaceAll('"', "'"),
              },
            })
          }
        })
      }
    },
  })
}

const getIssueSpecificity = (issues: ZodIssue[]) => {
  const maxDepth = Math.max(...issues.map((i) => i.path.length), 0)
  const hasMissingKey = issues.some((i) => i.code === 'invalid_type' && i.path.length > 0)
  return maxDepth * 10 + (hasMissingKey ? 1 : 0)
}

const flattenUnionIssues = (issues: ZodIssue[]): ZodIssue[] => {
  return issues.flatMap((issue) => {
    if (issue.code === 'invalid_union') {
      const bestBranch = issue.errors.reduce((best, current) => {
        return getIssueSpecificity(current) >= getIssueSpecificity(best) ? current : best
      })
      return flattenUnionIssues(bestBranch.map((inner) => ({ ...inner, path: [...issue.path, ...inner.path] })))
    }
    return [issue]
  })
}

export { defineJsonValidation, type ErrorId }
