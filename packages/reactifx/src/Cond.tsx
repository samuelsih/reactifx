import { Children, isValidElement, type ReactElement, type ReactNode } from "react"

import { If } from "./If"

type CondProps = {
  children: ReactNode
}

type ConditionalProps = {
  cond: boolean
  children: ReactNode
}

type ElseProps = {
  children: ReactNode
}

// Throws when rendered outside Cond; Cond reads its children directly instead.
export function Else(_props: ElseProps): ReactNode {
  throw new Error("<Else> must be used inside <Cond>")
}

// Throws when rendered outside Cond; Cond reads its props directly instead.
export function ElseIf(_props: ConditionalProps): ReactNode {
  throw new Error("<ElseIf> must be used inside <Cond>")
}

const isConditionalBranch = (child: ReactNode): child is ReactElement<ConditionalProps> =>
  isValidElement<ConditionalProps>(child) && (child.type === If || child.type === ElseIf)

const isElseBranch = (child: ReactNode): child is ReactElement<ElseProps> =>
  isValidElement<ElseProps>(child) && child.type === Else

// Renders the first branch whose cond is truthy, or the Else branch.
// Branches must follow the sequence: one leading If, then ElseIf, then an optional Else.
export function Cond({ children }: CondProps): ReactNode {
  let fallback: ReactNode = null
  let hasConditionalBranch = false
  let hasElse = false

  for (const child of Children.toArray(children)) {
    if (isElseBranch(child)) {
      if (!hasConditionalBranch) {
        throw new Error("<Cond> must start with an <If> branch")
      }
      if (hasElse) {
        throw new Error("<Else> must be the last branch of <Cond>")
      }
      hasElse = true
      fallback = child.props.children
      continue
    }

    if (isConditionalBranch(child)) {
      if (hasElse) {
        throw new Error("<Else> must be the last branch of <Cond>")
      }
      if (child.type === If && hasConditionalBranch) {
        throw new Error("<If> must be the first branch of <Cond>")
      }
      if (child.type === ElseIf && !hasConditionalBranch) {
        throw new Error("<Cond> must start with an <If> branch")
      }

      hasConditionalBranch = true
      if (child.props.cond) {
        return child.props.children
      }
    }
  }

  return fallback
}
