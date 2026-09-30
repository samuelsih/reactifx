import { defineConfig } from "oxfmt"

import base from "../../oxfmt.config.ts"

export default defineConfig({
  ...base,
  overrides: [
    ...(base.overrides ?? []),
    {
      files: ["**/*.{jsx,tsx}"],
      options: {
        singleAttributePerLine: true,
      },
    },
  ],
})
