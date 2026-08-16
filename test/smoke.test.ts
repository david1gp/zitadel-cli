import { describe, expect, test } from "bun:test"
import { PACKAGE_VERSION } from "../src/index.js"

describe("scaffold", () => {
  test("exports the package version", () => {
    expect(PACKAGE_VERSION).toBe("0.1.0")
  })
})
