import { defineConfig, type OxfmtConfig } from "oxfmt"

const config: OxfmtConfig = defineConfig({
  printWidth: 100,
  semi: false,
  trailingComma: "all",
  sortImports: true,
  sortPackageJson: true,
  ignorePatterns: ["dist", "coverage", "pnpm-lock.yaml"],
})

export default config
