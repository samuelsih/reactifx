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

  it("renders multiple ElseIf branches without an Else", () => {
    const { container } = render(
      <Cond>
        <If cond={false}>A</If>
        <ElseIf cond={false}>B</ElseIf>
        <ElseIf cond={true}>C</ElseIf>
        <ElseIf cond={true}>D</ElseIf>
      </Cond>,
    )

    expect(container.textContent).toBe("C")
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

  it("throws when Cond starts with ElseIf", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() =>
      render(
        <Cond>
          <ElseIf cond={true}>B</ElseIf>
        </Cond>,
      ),
    ).toThrow("<Cond> must start with an <If> branch")
  })

  it("throws when Cond starts with Else", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() =>
      render(
        <Cond>
          <Else>B</Else>
        </Cond>,
      ),
    ).toThrow("<Cond> must start with an <If> branch")
  })

  it("throws when a branch follows Else", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() =>
      render(
        <Cond>
          <If cond={false}>A</If>
          <Else>B</Else>
          <ElseIf cond={true}>C</ElseIf>
        </Cond>,
      ),
    ).toThrow("<Else> must be the last branch of <Cond>")
  })

  it("throws when Cond has multiple If branches", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() =>
      render(
        <Cond>
          <If cond={false}>A</If>
          <If cond={true}>B</If>
        </Cond>,
      ),
    ).toThrow("<If> must be the first branch of <Cond>")
  })
})
