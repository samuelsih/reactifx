import type { PluginAPI } from "@babel/core"
import type * as BabelTypes from "@babel/types"

export const getCondition = (
  t: PluginAPI["types"],
  attribute: BabelTypes.JSXAttribute,
): BabelTypes.Expression | null => {
  const { value } = attribute
  // A bare condition attribute means true.
  if (value === null) {
    return t.booleanLiteral(true)
  }
  if (t.isStringLiteral(value)) {
    return value
  }
  if (t.isJSXExpressionContainer(value)) {
    const { expression } = value
    if (!t.isJSXEmptyExpression(expression)) {
      return expression
    }
  }
  return null
}

export const buildChildrenExpression = (
  t: PluginAPI["types"],
  node: BabelTypes.JSXElement,
): BabelTypes.Expression => {
  // Normalizes JSX text children with the same whitespace rules as the JSX transform.
  const built = t.react.buildChildren(node)
  if (built.length === 0) {
    return t.nullLiteral()
  }

  const [child] = built
  const isSingleChild = built.length === 1 && child !== undefined && !t.isJSXSpreadChild(child)
  if (isSingleChild) {
    return child
  }

  // Multiple children keep fragment semantics (and keys) instead of becoming an array.
  const nonWhitespaceChildren = node.children.filter(
    (item) => !t.isJSXText(item) || item.value.trim() !== "",
  )
  return t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), nonWhitespaceChildren)
}
