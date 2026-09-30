import babel from "@rolldown/plugin-babel"
import babelPluginReactifx from "@samuelsih/babel-plugin-reactifx"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: [babelPluginReactifx()],
      presets: [reactCompilerPreset()],
    }),
  ],
})
