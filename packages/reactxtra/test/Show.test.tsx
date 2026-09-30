import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Show } from "../src/Show"

describe("Show", () => {
  it("renders children with the truthy value", () => {
    const { container } = render(<Show when="hi">{(value) => <span>{value}</span>}</Show>)

    expect(container.textContent).toBe("hi")
  })

  it("renders ReactNode children", () => {
    const { container } = render(
      <Show when={true}>
        <span>content</span>
      </Show>,
    )

    expect(container.textContent).toBe("content")
  })

  it("renders the fallback when when is falsy", () => {
    const { container } = render(
      <Show
        when={null}
        fallback={<span>loading</span>}
      >
        <span>content</span>
      </Show>,
    )

    expect(container.textContent).toBe("loading")
  })
})
