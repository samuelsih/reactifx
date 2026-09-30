import type { ReactNode } from "react"

type Props = {
  cond: boolean
  children: ReactNode
}

export const If = ({ cond: isTrue, children }: Props) => (isTrue ? children : null)
