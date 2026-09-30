import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { If } from "../src/If"

describe("If", () => {
  it("renders children when cond is true", () => {
    const { container } = render(<If cond>yes</If>)

    expect(container.textContent).toBe("yes")
  })

  it("renders nothing when cond is false", () => {
    const { container } = render(<If cond={false}>yes</If>)

    expect(container.textContent).toBe("")
  })
})
