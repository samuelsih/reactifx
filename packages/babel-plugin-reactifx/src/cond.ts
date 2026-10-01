import type * as BabelTypes from "@babel/types"

import { createUnusedImportCleanup, isComponentImport } from "./imports"
import { buildChildrenExpression, getCondition } from "./jsx"
import type { Transformer } from "./transformer"

const componentName = "Cond"
const conditionProp = "cond"
const localsKey = Symbol("reactifxCondLocals")

const importCleanup = createUnusedImportCleanup(localsKey)

type Branch = {
  kind: "If" | "ElseIf"
  test: BabelTypes.Expression
  consequent: BabelTypes.Expression
}

// Inlines `<Cond>` elements imported from `@samuelsih/reactifx` into nested
// conditional expressions, such as `a ? A : b ? B : C`.
export const condTransformer: Transformer = (api, config) => {
  const { types: t } = api

  return {
    Program: importCleanup,
    JSXElement(path, state) {
      if (!config.transformCond) {
        return
      }

      const { name } = path.node.openingElement
      if (!t.isJSXIdentifier(name)) {
        return
      }
      if (!isComponentImport(t, path.scope.getBinding(name.name), componentName)) {
        return
      }

      // Inlining is only safe for a bare `<Cond>`; key/ref and extras must be preserved.
      if (path.node.openingElement.attributes.length !== 0) {
        return
      }

      const branches: Branch[] = []
      const consumedLocals: string[] = [name.name]
      let fallback: BabelTypes.Expression = t.nullLiteral()
      let hasBranch = false
      let hasElse = false

      for (const child of path.node.children) {
        // Ignore whitespace text and JSX comments between branches.
        if (t.isJSXText(child)) {
          if (child.value.trim() === "") {
            continue
          }
          return
        }
        if (t.isJSXExpressionContainer(child)) {
          if (t.isJSXEmptyExpression(child.expression)) {
            continue
          }
          return
        }
        if (!t.isJSXElement(child)) {
          return
        }

        const childName = child.openingElement.name
        if (!t.isJSXIdentifier(childName)) {
          return
        }

        const isIf = isComponentImport(t, path.scope.getBinding(childName.name), "If")
        const isElseIf = isComponentImport(t, path.scope.getBinding(childName.name), "ElseIf")
        const isElse = isComponentImport(t, path.scope.getBinding(childName.name), "Else")
        if (!isIf && !isElseIf && !isElse) {
          return
        }

        // `<Else>` is the fallback; anything after it is unreachable.
        if (hasElse) {
          throw path.buildCodeFrameError("<Else> must be the last branch of <Cond>")
        }

        if (isElse) {
          // `<Else>` takes no props and only carries the fallback.
          if (child.openingElement.attributes.length !== 0) {
            return
          }
          hasBranch = true
          hasElse = true
          consumedLocals.push(childName.name)
          fallback = buildChildrenExpression(t, child)
          continue
        }

        // `<If>` starts the sequence; later conditional branches must be `<ElseIf>`.
        if (isIf && hasBranch) {
          throw path.buildCodeFrameError("<If> must be the first branch of <Cond>")
        }

        // `<If>` and `<ElseIf>` require `cond` as their sole prop.
        const { attributes } = child.openingElement
        const attribute = attributes[0]
        const isMissingAttribute = attributes.length !== 1 || attribute === undefined
        const isNotConditionProp =
          !t.isJSXAttribute(attribute) ||
          !t.isJSXIdentifier(attribute.name, { name: conditionProp })

        if (isMissingAttribute || isNotConditionProp) {
          return
        }

        const condition = getCondition(t, attribute)
        if (!condition) {
          return
        }

        hasBranch = true
        consumedLocals.push(childName.name)
        branches.push({
          kind: isIf ? "If" : "ElseIf",
          test: condition,
          consequent: buildChildrenExpression(t, child),
        })
      }

      // An empty `<Cond />` renders nothing; otherwise it must start with `<If>`.
      if (hasBranch && branches[0]?.kind !== "If") {
        throw path.buildCodeFrameError("<Cond> must start with an <If> branch")
      }

      let alternate = fallback
      for (let index = branches.length - 1; index >= 0; index -= 1) {
        const branch = branches[index]
        if (!branch) {
          continue
        }
        alternate = t.conditionalExpression(branch.test, branch.consequent, alternate)
      }

      const parent = path.parentPath
      if (parent.isJSXElement() || parent.isJSXFragment()) {
        path.replaceWith(t.jsxExpressionContainer(alternate))
      } else {
        path.replaceWith(alternate)
      }

      const locals: Set<string> = state.get(localsKey)
      for (const local of consumedLocals) {
        locals.add(local)
      }
    },
  }
}
