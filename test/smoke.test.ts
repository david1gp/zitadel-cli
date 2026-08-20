import { describe, expect, test } from "bun:test"
import pkg from "../package.json" with { type: "json" }
import { PACKAGE_VERSION, packageVersion } from "../src/index.js"

describe("scaffold", () => {
  test("exports the package version", () => {
    expect(PACKAGE_VERSION).toBe(pkg.version)
    expect(packageVersion).toBe(pkg.version)
  })
})
