import { defineConfig, type OxlintConfig } from "oxlint"

const config: OxlintConfig = defineConfig({
  plugins: ["eslint", "typescript", "unicorn", "oxc", "import"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  rules: {
    "eslint/curly": ["error", "all"],
    "eslint/no-var": "error",
    "typescript/consistent-type-imports": "error",
    "typescript/no-import-type-side-effects": "error",
    "unicorn/prefer-node-protocol": "error",
    "import/no-duplicates": "error",
  },
  env: {
    es2024: true,
    node: true,
  },
  options: {
    reportUnusedDisableDirectives: "warn",
  },
  ignorePatterns: ["dist", "coverage"],
})

export default config
