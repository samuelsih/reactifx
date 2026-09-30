# babel-plugin-reactifx

Compile-time counterpart to `reactifx`: inlines `<If cond>` into a plain conditional expression and drops the import.

```tsx
// before
import { If } from "reactifx"

const el = (
  <If cond={ready}>
    <Foo />
  </If>
)

// after
const el = ready ? <Foo /> : null
```

Babel 7 or 8 is a peer dependency.

## Install

```sh
pnpm add reactifx
pnpm add -D babel-plugin-reactifx @rolldown/plugin-babel
```

## Vite

Vite 8 handles JSX through Oxc, and `@vitejs/plugin-react` no longer takes a `babel` option. Add Babel through `@rolldown/plugin-babel` and register the plugin there.

```ts
// vite.config.ts
import babel from "@rolldown/plugin-babel"
import react from "@vitejs/plugin-react"
import babelPluginReactifx from "babel-plugin-reactifx"
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

Elements with extra props (such as `key`) are left as runtime components, and `Cond`, `ElseIf`, and `Else` are not transformed (for now).

## Config

```ts
babelPluginReactifx({
  transformIf: true, // default
})
```

| Option        | Type      | Default | Description                                               |
| ------------- | --------- | ------- | --------------------------------------------------------- |
| `transformIf` | `boolean` | `true`  | Inline `<If cond>` elements into conditional expressions. |
