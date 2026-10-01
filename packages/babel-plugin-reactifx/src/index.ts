import type { PluginAPI, PluginObject } from "@babel/core"
import { traverse } from "@babel/core"

import { condTransformer } from "./cond"
import { resolveConfig, type ReactifxConfig } from "./config"
import { ifTransformer } from "./if"
import type { Transformer } from "./transformer"

export type { ReactifxConfig }

const transformers: Transformer[] = [ifTransformer, condTransformer]

// Creates the babel plugin that inlines components imported from the configured source.
export default function babelPluginReactifx(
  config: ReactifxConfig = {},
): (api: PluginAPI) => PluginObject {
  const resolved = resolveConfig(config)
  return (api) => ({
    name: "@samuelsih/babel-plugin-reactifx",
    visitor: traverse.visitors.merge(transformers.map((create) => create(api, resolved))),
  })
}
