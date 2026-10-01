import { describe, expect, it } from "vitest"

import { transform } from "./transform"

describe("Cond", () => {
  it("inlines Cond into a nested conditional expression", () => {
    expect(
      transform(`import { Cond, Else, ElseIf, If } from "@samuelsih/reactifx";
      const el = <Cond>
        <If cond={loading}>Loading</If>
        <ElseIf cond={error}>Error</ElseIf>
        <Else>Ready</Else>
      </Cond>;`),
    ).toBe('const el = loading ? "Loading" : error ? "Error" : "Ready";')
  })

  it("inlines Cond without Else into a nested conditional expression", () => {
    expect(
      transform(`import { Cond, ElseIf, If } from "@samuelsih/reactifx";
      const el = <Cond>
        <If cond={a}><Foo /></If>
        <ElseIf cond={b}><Bar /></ElseIf>
      </Cond>;`),
    ).toBe("const el = a ? <Foo /> : b ? <Bar /> : null;")
  })

  it("inlines Cond with multiple ElseIf branches and no Else", () => {
    expect(
      transform(`import { Cond, ElseIf, If } from "@samuelsih/reactifx";
      const el = <Cond>
        <If cond={a}>A</If>
        <ElseIf cond={b}>B</ElseIf>
        <ElseIf cond={c}>C</ElseIf>
        <ElseIf cond={d}>D</ElseIf>
      </Cond>;`),
    ).toBe('const el = a ? "A" : b ? "B" : c ? "C" : d ? "D" : null;')
  })

  it("chains multiple ElseIf branches", () => {
    expect(
      transform(`import { Cond, Else, ElseIf, If } from "@samuelsih/reactifx";
      const el = <Cond>
        <If cond={a}>A</If>
        <ElseIf cond={b}>B</ElseIf>
        <ElseIf cond={c}>C</ElseIf>
        <ElseIf cond={d}>D</ElseIf>
        <ElseIf cond={e}>E</ElseIf>
        <ElseIf cond={f}>F</ElseIf>
        <Else>G</Else>
      </Cond>;`),
    ).toBe('const el = a ? "A" : b ? "B" : c ? "C" : d ? "D" : e ? "E" : f ? "F" : "G";')
  })

  it("throws when a branch follows Else", () => {
    expect(() =>
      transform(`import { Cond, Else, ElseIf, If } from "@samuelsih/reactifx";
      const el = <Cond>
        <If cond={a}>A</If>
        <Else>B</Else>
        <ElseIf cond={c}>C</ElseIf>
      </Cond>;`),
    ).toThrow("<Else> must be the last branch of <Cond>")
  })

  it("throws when Cond has multiple If branches", () => {
    expect(() =>
      transform(`import { Cond, If } from "@samuelsih/reactifx";
      const el = <Cond>
        <If cond={a}>A</If>
        <If cond={b}>B</If>
      </Cond>;`),
    ).toThrow("<If> must be the first branch of <Cond>")
  })

  it("inlines an empty Cond into null", () => {
    expect(
      transform(`import { Cond } from "@samuelsih/reactifx";
      const el = <Cond />;`),
    ).toBe("const el = null;")
  })

  it("throws when Cond has no If branch", () => {
    expect(() =>
      transform(`import { Cond, Else, ElseIf } from "@samuelsih/reactifx";
      const el = <Cond>
        <ElseIf cond={error}>Error</ElseIf>
        <Else>Ready</Else>
      </Cond>;`),
    ).toThrow("<Cond> must start with an <If> branch")
  })

  it("throws when Cond only has an Else branch", () => {
    expect(() =>
      transform(`import { Cond, Else } from "@samuelsih/reactifx";
      const el = <Cond>
        <Else>Ready</Else>
      </Cond>;`),
    ).toThrow("<Cond> must start with an <If> branch")
  })

  it("wraps the nested conditional in an expression container inside JSX", () => {
    expect(
      transform(`import { Cond, Else, If } from "@samuelsih/reactifx";
      const Component = () => (
        <div>
          <Cond>
            <If cond={a}>A</If>
            <Else>B</Else>
          </Cond>
        </div>
      );`),
    ).toBe('const Component = () => <div> {a ? "A" : "B"} </div>;')
  })

  it("inlines Cond when transformCond is true", () => {
    expect(
      transform(
        `import { Cond, Else, If } from "@samuelsih/reactifx";
      const el = <Cond><If cond={ready}><Foo /></If><Else><Bar /></Else></Cond>;`,
        { transformCond: true },
      ),
    ).toBe("const el = ready ? <Foo /> : <Bar />;")
  })

  it("leaves Cond and its branches alone when transformCond is disabled", () => {
    expect(
      transform(
        `import { Cond, Else, If } from "@samuelsih/reactifx";
      const el = <Cond><If cond={ready}><Foo /></If><Else><Bar /></Else></Cond>;`,
        { transformCond: false },
      ),
    ).toBe(
      'import { Cond, Else, If } from "@samuelsih/reactifx"; const el = <Cond><If cond={ready}><Foo /></If><Else><Bar /></Else></Cond>;',
    )
  })

  it("keeps branch imports when they are still referenced", () => {
    expect(
      transform(`import { Cond, Else, If } from "@samuelsih/reactifx";
      const C = If;
      const el = <Cond><If cond={ready}><Foo /></If><Else><Bar /></Else></Cond>;`),
    ).toBe(
      'import { If } from "@samuelsih/reactifx"; const C = If; const el = ready ? <Foo /> : <Bar />;',
    )
  })

  it("inlines nested Cond and If elements", () => {
    expect(
      transform(`import { Cond, Else, ElseIf, If } from "@samuelsih/reactifx";
      const el = <Cond>
        <If cond={a}><If cond={b}>B</If></If>
        <ElseIf cond={c}>C</ElseIf>
        <Else>D</Else>
      </Cond>;`),
    ).toBe('const el = a ? b ? "B" : null : c ? "C" : "D";')
  })

  it("leaves Cond with non-branch children alone", () => {
    expect(
      transform(`import { Cond, Else, If } from "@samuelsih/reactifx";
      const el = <Cond><If cond={ready}><Foo /></If><span>noise</span><Else><Bar /></Else></Cond>;`),
    ).toBe(
      'import { Cond, Else, If } from "@samuelsih/reactifx"; const el = <Cond><If cond={ready}><Foo /></If><span>noise</span><Else><Bar /></Else></Cond>;',
    )
  })
})
