import { useState } from "react"
import { If } from "reactifx"

export const App = () => {
  const [ready] = useState(true)

  return (
    <main>
      <h1>reactifx + vite</h1>
      <If cond={ready}>
        <p>The plugin inlined this conditional.</p>
      </If>
    </main>
  )
}
