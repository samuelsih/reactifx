import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/index.ts"],
  platform: "neutral",
  dts: { sourcemap: true, tsconfig: "./tsconfig.build.json" },
  sourcemap: true,
  clean: true,
  publint: true,
  attw: { profile: "esm-only" },
})
