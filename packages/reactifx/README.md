# reactifx

Conditional rendering for React: `If`, `Cond`, `ElseIf`, `Else`.

## Install

```sh
pnpm add @samuelsih/reactifx
```

React 18 or 19 is a peer dependency.

## `If`

Renders its children when `cond` is true, otherwise nothing. Works on its own.

```tsx
import { If } from "@samuelsih/reactifx"

function Dashboard({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <If cond={isLoggedIn}>
      <p>Welcome back</p>
    </If>
  )
}
```

A bare `cond` is `true`.

## `Cond`, `ElseIf`, `Else`

`Cond` renders the first branch whose `cond` is true, falling back to the `Else` branch. `ElseIf` and `Else` must be direct children of `Cond` — rendering them anywhere else throws.

```tsx
import { Cond, Else, ElseIf, If } from "@samuelsih/reactifx"

function Status({ loading, error }: { loading: boolean; error: string | null }) {
  return (
    <Cond>
      <If cond={loading}>Loading…</If>
      <ElseIf cond={error !== null}>{error}</ElseIf>
      <Else>Ready</Else>
    </Cond>
  )
}
```

With no match and no `Else`, `Cond` renders nothing.
