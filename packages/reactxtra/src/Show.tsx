import type { ReactNode } from "react"

type ShowProps<T> = {
  when: T
  fallback?: ReactNode
  children: ReactNode | ((value: NonNullable<T>) => ReactNode)
}

export function Show<T>({ when, fallback = null, children }: ShowProps<T>) {
  if (!when) {
    return fallback
  }

  return typeof children === "function" ? children(when as NonNullable<T>) : children
}
