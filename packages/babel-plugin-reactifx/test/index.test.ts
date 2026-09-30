import { transformSync } from "@babel/core"
import { describe, expect, it } from "vitest"

import plugin, { type ReactifxConfig } from "../src/index"

// Collapses whitespace so generated output is easy to compare.
const transform = (code: string, config: ReactifxConfig = {}) => {
  const result = transformSync(code, {
    babelrc: false,
    configFile: false,
    filename: "file.tsx",
    parserOpts: { plugins: ["jsx"] },
    plugins: [plugin(config)],
  })

  return result?.code?.replace(/\s+/g, " ").trim() ?? ""
}

describe("babel-plugin-reactifx", () => {
  it("inlines a single child into a conditional expression", () => {
    expect(
      transform(`import { If } from "reactifx";
      const el = <If cond={ready}><Foo /></If>;`),
    ).toBe("const el = ready ? <Foo /> : null;")
  })

  it("wraps multiple children in a fragment", () => {
    expect(
      transform(`import { If } from "reactifx";
      const el = <If cond={ready}><Foo /><Bar /></If>;`),
    ).toBe("const el = ready ? <><Foo /><Bar /></> : null;")
  })

  it("inlines nested If elements", () => {
    expect(
      transform(`import { If } from "reactifx";
      const el = <If cond>
        <Sidebar />
        <If cond={isOpen}>Show the eyes</If>
      </If>;`),
    ).toBe('const el = true ? <><Sidebar />{isOpen ? "Show the eyes" : null}</> : null;')
  })

  it("unwraps an expression child", () => {
    expect(
      transform(`import { If } from "reactifx";
      const el = <If cond={ready}>{content}</If>;`),
    ).toBe("const el = ready ? content : null;")
  })

  it("inlines a text child inside a fragment as a string", () => {
    expect(
      transform(`import { If } from "reactifx";
      const Component = () => (
        <>
          <If cond={1 === 1}>
            TheChildrenNode
          </If>
        </>
      );`),
    ).toBe('const Component = () => <> {1 === 1 ? "TheChildrenNode" : null} </>;')
  })

  it("normalizes multiline text children", () => {
    expect(
      transform(`import { If } from "reactifx";
      const el = <If cond={ready}>
        Hello
      </If>;`),
    ).toBe('const el = ready ? "Hello" : null;')
  })

  it("supports the cond shorthand", () => {
    expect(
      transform(`import { If } from "reactifx";
      const el = <If cond><Foo /></If>;`),
    ).toBe("const el = true ? <Foo /> : null;")
  })

  it("supports aliased imports", () => {
    expect(
      transform(`import { If as Conditional } from "reactifx";
      const el = <Conditional cond={ready}><Foo /></Conditional>;`),
    ).toBe("const el = ready ? <Foo /> : null;")
  })

  it("inlines If when transformIf is true", () => {
    expect(
      transform(
        `import { If } from "reactifx";
      const el = <If cond={ready}><Foo /></If>;`,
        { transformIf: true },
      ),
    ).toBe("const el = ready ? <Foo /> : null;")
  })

  it("leaves If alone when transformIf is disabled", () => {
    expect(
      transform(
        `import { If } from "reactifx";
      const el = <If cond={ready}><Foo /></If>;`,
        { transformIf: false },
      ),
    ).toBe('import { If } from "reactifx"; const el = <If cond={ready}><Foo /></If>;')
  })

  it("keeps the import when If is still referenced", () => {
    expect(
      transform(`import { If } from "reactifx";
      const C = If;
      const el = <If cond={ready}><Foo /></If>;`),
    ).toBe('import { If } from "reactifx"; const C = If; const el = ready ? <Foo /> : null;')
  })

  it("leaves If from other sources alone", () => {
    expect(
      transform(`import { If } from "other";
      const el = <If cond={ready}><Foo /></If>;`),
    ).toBe('import { If } from "other"; const el = <If cond={ready}><Foo /></If>;')
  })

  it("leaves elements with extra props alone", () => {
    expect(
      transform(`import { If } from "reactifx";
      const el = <If cond={ready} key="a"><Foo /></If>;`),
    ).toBe('import { If } from "reactifx"; const el = <If cond={ready} key="a"><Foo /></If>;')
  })
})
