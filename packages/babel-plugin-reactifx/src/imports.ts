import type { NodePath, PluginAPI, PluginPass } from "@babel/core"
import type * as BabelTypes from "@babel/types"

type Binding = NonNullable<ReturnType<NodePath<BabelTypes.Node>["scope"]["getBinding"]>>

const importSource = "reactifx"

export const isComponentImport = (
  t: PluginAPI["types"],
  binding: Binding | undefined,
  componentName: string,
): boolean => {
  if (!binding) {
    return false
  }

  const specifierPath = binding.path
  if (!specifierPath.isImportSpecifier()) {
    return false
  }

  const imported = specifierPath.node.imported
  const importedName = t.isIdentifier(imported) ? imported.name : imported.value
  if (importedName !== componentName) {
    return false
  }

  const declarationPath = specifierPath.parentPath
  if (!declarationPath.isImportDeclaration()) {
    return false
  }

  return declarationPath.node.source.value === importSource
}

// Tracks the imports a transformer inlined so unused specifiers are removed on program exit.
export const createUnusedImportCleanup = (localsKey: symbol) => ({
  enter(_path: NodePath<BabelTypes.Program>, state: PluginPass) {
    state.set(localsKey, new Set<string>())
  },
  exit(path: NodePath<BabelTypes.Program>, state: PluginPass) {
    const locals: Set<string> = state.get(localsKey)
    if (locals.size === 0) {
      return
    }

    // Re-crawl so reference paths reflect the JSX we replaced.
    path.scope.crawl()

    for (const localName of locals) {
      const binding = path.scope.getBinding(localName)
      if (!binding || binding.referencePaths.length > 0) {
        continue
      }

      const specifierPath = binding.path
      const declarationPath = specifierPath.parentPath
      specifierPath.remove()

      if (declarationPath.isImportDeclaration() && declarationPath.node.specifiers.length === 0) {
        declarationPath.remove()
      }
    }
  },
})
