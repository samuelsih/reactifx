import babel from "@rolldown/plugin-babel"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babelPluginReactifx from "babel-plugin-reactifx"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: [babelPluginReactifx({ transformIf: true })],
      presets: [reactCompilerPreset()],
    }),
  ],
})
