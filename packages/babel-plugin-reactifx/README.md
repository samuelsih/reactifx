# babel-plugin-reactifx

Compile-time counterpart to `@samuelsih/reactifx`: inlines `<If cond>` and `<Cond>` branches into plain conditional expressions and drops the imports.

```tsx
// before
import { Cond, Else, ElseIf, If } from "@samuelsih/reactifx"

const el = (
  <Cond>
    <If cond={loading}>
      <Spinner />
    </If>
    <ElseIf cond={error}>
      <Error />
    </ElseIf>
    <Else>
      <Content />
    </Else>
  </Cond>
)

// after
const el = loading ? <Spinner /> : error ? <Error /> : <Content />
```

Babel 7 or 8 is a peer dependency.

## Install

```sh
pnpm add @samuelsih/reactifx
pnpm add -D @samuelsih/babel-plugin-reactifx @rolldown/plugin-babel
```

## Vite

Vite 8 handles JSX through Oxc, and `@vitejs/plugin-react` no longer takes a `babel` option. Add Babel through `@rolldown/plugin-babel` and register the plugin there.

```ts
// vite.config.ts
import babel from "@rolldown/plugin-babel"
import react from "@vitejs/plugin-react"
import babelPluginReactifx from "@samuelsih/babel-plugin-reactifx"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: [babelPluginReactifx()],
    }),
  ],
})
```

Elements with extra props (such as `key`) are left as runtime components. A `<Cond>` must follow the branch sequence — a leading `<If>`, any number of `<ElseIf>`, then an optional trailing `<Else>` — the plugin throws otherwise. `<If>` elements nested directly inside `<Cond>` are left untouched when their `<Cond>` is not transformed, so the runtime component keeps working.

## Config

```ts
babelPluginReactifx({
  transformIf: true, // default
  transformCond: true, // default
})
```

| Option          | Type      | Default | Description                                                   |
| --------------- | --------- | ------- | ------------------------------------------------------------- |
| `transformIf`   | `boolean` | `true`  | Inline `<If cond>` elements into conditional expressions.     |
| `transformCond` | `boolean` | `true`  | Inline `<Cond>` branches into nested conditional expressions. |
