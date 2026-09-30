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
export function Cond({ children }: CondProps): ReactNode {
  let fallback: ReactNode = null

  for (const child of Children.toArray(children)) {
    if (isElseBranch(child)) {
      fallback = child.props.children
      continue
    }

    if (isConditionalBranch(child) && child.props.cond) {
      return child.props.children
    }
  }

  return fallback
}
