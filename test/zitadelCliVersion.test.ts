import { expect, test } from "bun:test"
import { run } from "@stricli/core"
import pkg from "../package.json" with { type: "json" }
import { zitadelCliApplication } from "../src/cli/zitadelCliApplication.js"

function processForOutput(output: string[], errors: string[]) {
  return {
    stdout: { write: (text: string) => output.push(text) },
    stderr: { write: (text: string) => errors.push(text) },
  }
}

test("preserves plain --version output", async () => {
  const output: string[] = []
  const errors: string[] = []

  await run(zitadelCliApplication, ["--version"], { process: processForOutput(output, errors) })

  expect(output.join("")).toBe(`${pkg.version}\n`)
  expect(errors).toEqual([])
})

test("renders verbose metadata without credentials or network access", async () => {
  const output: string[] = []
  const errors: string[] = []

  await run(zitadelCliApplication, ["version", "--verbose"], { process: processForOutput(output, errors) })

  const rendered = output.join("")
  expect(rendered).toContain(`${pkg.version}\nuser agent: ${pkg.name}/${pkg.version}`)
  expect(rendered).toContain(`description: ${pkg.description}`)
  expect(rendered).toContain("author: David Siewert — https://david-siewert.com/")
  expect(rendered).toContain(`license: ${pkg.license}`)
  expect(rendered).toContain(`project: ${pkg.homepage}`)
  expect(rendered).toContain("installation type: development checkout")
  expect(rendered).toContain(`runtime: bun ${Bun.version}`)
  expect(rendered).toContain("runtime requirements: node >=22, bun >=1.3.0")
  expect(rendered).toContain(`platform: ${process.platform} ${process.arch} (OS release `)
  expect(rendered).toMatch(/executable: .+\nexecutable target: .+\n/)
  expect(rendered).not.toContain("build details:")
  expect(errors).toEqual([])
})

test("supports verbose metadata on the existing --version integration", async () => {
  const output: string[] = []
  const errors: string[] = []

  await run(zitadelCliApplication, ["--version", "--verbose"], { process: processForOutput(output, errors) })

  expect(output.join("")).toContain(`user agent: ${pkg.name}/${pkg.version}`)
  expect(errors).toEqual([])
})
