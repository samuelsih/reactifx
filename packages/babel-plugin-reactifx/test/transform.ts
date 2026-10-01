import { transformSync } from "@babel/core"

import plugin, { type ReactifxConfig } from "../src/index"

// Collapses whitespace so generated output is easy to compare.
export const transform = (code: string, config: ReactifxConfig = {}) => {
  const result = transformSync(code, {
    babelrc: false,
    configFile: false,
    filename: "file.tsx",
    parserOpts: { plugins: ["jsx"] },
    plugins: [plugin(config)],
  })

  return result?.code?.replace(/\s+/g, " ").trim() ?? ""
}
