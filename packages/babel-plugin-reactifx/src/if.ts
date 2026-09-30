import { createUnusedImportCleanup, isComponentImport } from "./imports"
import { buildChildrenExpression, getCondition } from "./jsx"
import type { Transformer } from "./transformer"

const componentName = "If"
const conditionProp = "cond"
const localsKey = Symbol("reactifxIfLocals")

const importCleanup = createUnusedImportCleanup(localsKey)

// Inlines `<If cond>` elements imported from `reactifx` into `cond ? children : null`.
export const ifTransformer: Transformer = (api, config) => {
  const { types: t } = api

  return {
    Program: importCleanup,
    JSXElement(path, state) {
      if (!config.transformIf) {
        return
      }

      const { name } = path.node.openingElement
      if (!t.isJSXIdentifier(name)) {
        return
      }
      if (!isComponentImport(t, path.scope.getBinding(name.name), componentName)) {
        return
      }

      const { attributes } = path.node.openingElement
      const attribute = attributes[0]

      // Inlining is only safe when `cond` is the sole prop; key/ref and extras must be preserved.
      const isMissingAttribute = attributes.length !== 1 || attribute === undefined
      const isNotConditionProp =
        !t.isJSXAttribute(attribute) || !t.isJSXIdentifier(attribute.name, { name: conditionProp })

      if (isMissingAttribute || isNotConditionProp) {
        return
      }

      const condition = getCondition(t, attribute)
      if (!condition) {
        return
      }

      const expression = t.conditionalExpression(
        condition,
        buildChildrenExpression(t, path.node),
        t.nullLiteral(),
      )
      const parent = path.parentPath
      if (parent.isJSXElement() || parent.isJSXFragment()) {
        path.replaceWith(t.jsxExpressionContainer(expression))
      } else {
        path.replaceWith(expression)
      }

      const locals: Set<string> = state.get(localsKey)
      locals.add(name.name)
    },
  }
}
