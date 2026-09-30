import type { PluginAPI, PluginPass, Visitor } from "@babel/core"

import type { ResolvedConfig } from "./config"

export type Transformer = (api: PluginAPI, config: ResolvedConfig) => Visitor<PluginPass>
