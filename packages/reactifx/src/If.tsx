import type { ReactNode } from "react"

type Props = {
  cond: boolean
  children: ReactNode
}

// Renders `children` when `cond` is true.
export const If = ({ cond: isTrue, children }: Props) => (isTrue ? children : null)
