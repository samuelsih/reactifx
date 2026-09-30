import { render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Cond, Else, ElseIf, If } from "../src"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("Cond", () => {
  it("renders the first truthy branch", () => {
    const { container } = render(
      <Cond>
        <If cond={false}>A</If>
        <ElseIf cond={true}>B</ElseIf>
        <Else>C</Else>
      </Cond>,
    )

    expect(container.textContent).toBe("B")
  })

  it("renders the first matching ElseIf out of multiple", () => {
    const { container } = render(
      <Cond>
        <If cond={false}>A</If>
        <ElseIf cond={false}>B</ElseIf>
        <ElseIf cond={true}>C</ElseIf>
        <ElseIf cond={true}>D</ElseIf>
        <Else>E</Else>
      </Cond>,
    )

    expect(container.textContent).toBe("C")
  })

  it("renders the Else branch when nothing matches", () => {
    const { container } = render(
      <Cond>
        <If cond={false}>A</If>
        <ElseIf cond={false}>B</ElseIf>
        <Else>C</Else>
      </Cond>,
    )

    expect(container.textContent).toBe("C")
  })

  it("renders nothing when no branch matches and there is no Else", () => {
    const { container } = render(
      <Cond>
        <If cond={false}>A</If>
      </Cond>,
    )

    expect(container.textContent).toBe("")
  })

  it("throws when ElseIf renders outside Cond", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<ElseIf cond={true}>B</ElseIf>)).toThrow(
      "<ElseIf> must be used inside <Cond>",
    )
  })

  it("throws when Else renders outside Cond", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<Else>C</Else>)).toThrow("<Else> must be used inside <Cond>")
  })
})
