// @vitest-environment jsdom
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"

import { build } from "vite"
import { beforeAll, describe, expect, it, vi } from "vitest"

let bundle: string

beforeAll(async () => {
  // Anchor to this file so the test works no matter which directory vitest runs from.
  const appRoot = join(dirname(import.meta.filename), "..")
  const assetsDir = join(appRoot, "dist", "assets")

  // Build the real app with the real vite.config.ts (react compiler + babel-plugin-reactifx).
  // Vitest runs with NODE_ENV=test, so force the production build React expects.
  const nodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = "production"
  try {
    await build({ root: appRoot, logLevel: "silent", build: { minify: false } })
  } finally {
    if (nodeEnv === undefined) {
      delete process.env.NODE_ENV
    } else {
      process.env.NODE_ENV = nodeEnv
    }
  }

  const entry = readdirSync(assetsDir).find((file) => file.endsWith(".js"))
  if (!entry) {
    throw new Error("vite build produced no js entry")
  }

  bundle = readFileSync(join(assetsDir, entry), "utf8")

  // Run the built bundle in the jsdom document the same way index.html would.
  document.body.innerHTML = '<div id="root"></div>'
  const url = `data:text/javascript;base64,${Buffer.from(bundle).toString("base64")}`
  await import(/* @vite-ignore */ url)
}, 30_000)

describe("vite integration", () => {
  it("inlines If while building the app", () => {
    expect(bundle).toContain("ready ?")
    expect(bundle).not.toContain("isTrue")
  })

  it("keeps the react compiler output", () => {
    expect(bundle).toContain('=== Symbol.for("react.memo_cache_sentinel")')
    expect(bundle).toContain("!== ready")
  })

  it("renders the built app in the browser", async () => {
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain("The plugin inlined this conditional.")
    })
  })
})
