import { defineConfig } from "oxlint"

import base from "../../oxlint.config.ts"

export default defineConfig({
  extends: [base],
  plugins: [...(base.plugins ?? []), "react", "react-perf", "jsx-a11y"],
  env: {
    es2024: true,
    browser: true,
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/rules-of-hooks": "error",
    "react/exhaustive-deps": "warn",
    "react/jsx-key": "error",
    "react/no-children-prop": "error",
    "react/no-unknown-property": "error",
    "react/void-dom-elements-no-children": "error",
    "react/jsx-no-constructed-context-values": "warn",
    "react/no-array-index-key": "warn",
    "react/self-closing-comp": "warn",
    "jsx-a11y/alt-text": "warn",
  },
  overrides: [
    {
      files: ["test/**"],
      rules: {
        "react-perf/jsx-no-jsx-as-prop": "off",
      },
    },
  ],
})
