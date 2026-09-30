import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const [tag = "", input = ""] = process.argv.slice(2)

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const scope = "@samuelsih/"

let name = input
let version = null

if (tag !== "") {
  const separator = tag.lastIndexOf("@")
  name = tag.slice(0, separator)
  version = tag.slice(separator + 1)
  if (separator <= 0 || version === "") {
    fail(`Release tag must be <package>@<version>, got: ${tag}`)
  }
}

const packagesDir = fileURLToPath(new URL("../packages", import.meta.url))
const packages = readdirSync(packagesDir).map((entry) =>
  JSON.parse(readFileSync(join(packagesDir, entry, "package.json"), "utf8")),
)

let pkg = packages.find((candidate) => candidate.name === name)
if (!pkg && !name.startsWith("@")) {
  // Release tags may use the unscoped name, e.g. `reactifx@0.1.0`.
  const scopedName = `${scope}${name}`
  pkg = packages.find((candidate) => candidate.name === scopedName)
  if (pkg) {
    name = scopedName
  }
}
if (!pkg) {
  fail(`Unknown package: ${name}`)
}
if (pkg.private) {
  fail(`Package is private: ${name}`)
}
if (version !== null && version !== pkg.version) {
  fail(`Tag version ${version} does not match ${name} version ${pkg.version}`)
}

console.log(name)
