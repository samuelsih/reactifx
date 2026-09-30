import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const [tag = "", input = ""] = process.argv.slice(2)

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

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

const pkg = packages.find((candidate) => candidate.name === name)
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
