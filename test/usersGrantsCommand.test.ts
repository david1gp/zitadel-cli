import { describe, expect, test } from "bun:test"
import { run, type ApplicationContext } from "@stricli/core"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { zitadelConfigPaths } from "../src/config/index.js"
import { zitadelCliApplication } from "../src/cli/zitadelCliApplication.js"

const writeJson = async (filePath: string, value: unknown, mode?: number) => {
  await writeFile(filePath, `${JSON.stringify(value)}\n`, { mode })
}

const cliRun = async (arguments_: readonly string[], env: Readonly<Record<string, string | undefined>>) => {
  let stdout = ""
  let stderr = ""
  const context: ApplicationContext = {
    process: {
      env,
      exitCode: undefined,
      stderr: { write: (value: string) => (stderr += value) },
      stdout: { write: (value: string) => (stdout += value) },
    },
  }
  await run(zitadelCliApplication, arguments_, context)
  return { exitCode: context.process.exitCode, stderr, stdout }
}

describe("users grants", () => {
  test("resolves aliases and sends the expected grant requests", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-grants-cli-"))
    const env = { HOME: directory, XDG_CONFIG_HOME: directory }
    const paths = zitadelConfigPaths(env)
    const requests: Request[] = []
    const previousFetch = globalThis.fetch
    try {
      await mkdir(paths.credentialsDirectory, { recursive: true })
      await mkdir(paths.projectsDirectory, { recursive: true })
      await writeJson(paths.configFile, {
        defaultProfile: "alpha",
        profiles: { alpha: { baseUrl: "https://auth.example.test", organizationId: "org-1" } },
      })
      await writeJson(
        join(paths.credentialsDirectory, "alpha.json"),
        {
          testUsers: {
            testuser: { password: "password", userId: "user-1", username: "testuser@example.test" },
          },
          token: "token-1",
        },
        0o600,
      )
      await writeJson(join(paths.projectsDirectory, "application.json"), { profile: "alpha", projectId: "project-1" })
      globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
        const request = new Request(String(input), init)
        requests.push(request)
        if (request.url.endsWith("/management/v1/users/grants/_search")) {
          return new Response(JSON.stringify({ details: { totalResult: "0" }, result: [] }))
        }
        return new Response("{}")
      }) as unknown as typeof fetch

      expect(
        await cliRun(
          ["users", "grants", "add", "--user", "testuser", "--project", "application", "--role-key", "admin"],
          env,
        ),
      ).toMatchObject({ exitCode: 0, stdout: "{}\n" })
      expect(
        await cliRun(
          ["users", "grants", "list", "--user", "testuser", "--project", "application", "--limit", "10"],
          env,
        ),
      ).toMatchObject({
        exitCode: 0,
        stdout: '{\n  "result": [],\n  "totalResult": "0"\n}\n',
      })
      expect(
        await cliRun(
          ["users", "grants", "update", "--user", "testuser", "--grant-id", "grant-1", "--role-key", "reader"],
          env,
        ),
      ).toMatchObject({ exitCode: 0, stdout: "{}\n" })
      expect(
        await cliRun(
          ["users", "grants", "remove", "--user-id", "user-2", "--grant-id", "grant-2", "--profile", "alpha"],
          env,
        ),
      ).toMatchObject({ exitCode: 0, stdout: "{}\n" })

      expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
        ["POST", "/management/v1/users/user-1/grants"],
        ["POST", "/management/v1/users/grants/_search"],
        ["PUT", "/management/v1/users/user-1/grants/grant-1"],
        ["DELETE", "/management/v1/users/user-2/grants/grant-2"],
      ])
      expect(await requests[0]?.clone().json()).toEqual({ projectId: "project-1", roleKeys: ["admin"] })
      expect(await requests[1]?.clone().json()).toEqual({
        queries: [{ projectIdQuery: { projectId: "project-1" } }, { userIdQuery: { userId: "user-1" } }],
        query: { asc: true, limit: 10, offset: 0 },
      })
      expect(await requests[2]?.clone().json()).toEqual({ roleKeys: ["reader"] })
      expect(await requests[3]?.clone().text()).toBe("")
    } finally {
      globalThis.fetch = previousFetch
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("rejects ambiguous and incomplete identifiers before making a request", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-grants-cli-"))
    const env = {
      HOME: directory,
      XDG_CONFIG_HOME: directory,
      ZITADEL_BASE_URL: "https://auth.example.test",
      ZITADEL_TOKEN: "token-1",
    }
    const previousFetch = globalThis.fetch
    let requestCount = 0
    try {
      globalThis.fetch = (async () => {
        requestCount += 1
        return new Response("{}")
      }) as unknown as typeof fetch
      const ambiguous = await cliRun(
        [
          "users",
          "grants",
          "add",
          "--user",
          "testuser",
          "--user-id",
          "user-1",
          "--project-id",
          "project-1",
          "--role-key",
          "admin",
        ],
        env,
      )
      expect(ambiguous.exitCode).toBe(1)
      expect(ambiguous.stderr).toContain("Specify only one of --user or --user-id")

      const missingGrant = await cliRun(["users", "grants", "remove", "--user-id", "user-1"], env)
      expect(missingGrant.exitCode).toBe(1)
      expect(missingGrant.stderr).toContain("Specify --grant-id ID")
      expect(requestCount).toBe(0)
    } finally {
      globalThis.fetch = previousFetch
      await rm(directory, { force: true, recursive: true })
    }
  })
})
