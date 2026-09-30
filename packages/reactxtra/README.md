# reactxtra

React extensions and utilities.

## Installation

```sh
pnpm add reactxtra
```

## Usage

```tsx
import { If } from "reactxtra"

function Dashboard({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <If isTrue={isLoggedIn}>
      <p>Welcome back</p>
    </If>
  )
}
```

## License

MIT
