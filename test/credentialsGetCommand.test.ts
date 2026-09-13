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

describe("credentials get", () => {
  test("returns raw fields and complete entries through profile, project, default, environment, and env-file selection", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-credentials-cli-"))
    const env = { HOME: directory, XDG_CONFIG_HOME: directory }
    const paths = zitadelConfigPaths(env)
    const envFile = join(directory, ".env.test")
    try {
      await mkdir(paths.credentialsDirectory, { recursive: true })
      await mkdir(paths.projectsDirectory, { recursive: true })
      await writeJson(paths.configFile, {
        defaultProfile: "alpha",
        profiles: {
          alpha: { baseUrl: "https://alpha.example", organizationId: "org-alpha" },
          beta: { baseUrl: "https://beta.example", organizationId: "org-beta" },
        },
      })
      await writeJson(
        join(paths.credentialsDirectory, "alpha.json"),
        {
          testUsers: {
            admin: { password: "alpha-password", userId: "alpha-user", username: "alpha@example.test" },
          },
          token: "alpha-token",
        },
        0o600,
      )
      await writeJson(
        join(paths.credentialsDirectory, "beta.json"),
        {
          testUsers: {
            admin: { password: "beta-password", userId: "beta-user", username: "beta@example.test" },
          },
          token: "beta-token",
        },
        0o600,
      )
      await writeJson(join(paths.projectsDirectory, "application.json"), { profile: "beta", projectId: "project-1" })
      await writeFile(envFile, "ZITADEL_PROFILE=beta\n")

      expect(await cliRun(["credentials", "get", "admin", "--field", "username", "--profile", "alpha"], env)).toEqual({
        exitCode: 0,
        stderr: "",
        stdout: "alpha@example.test\n",
      })
      expect(
        await cliRun(["credentials", "get", "admin", "--field", "password", "--project", "application"], env),
      ).toEqual({
        exitCode: 0,
        stderr: "",
        stdout: "beta-password\n",
      })
      expect(await cliRun(["credentials", "get", "admin", "--field", "userId", "--env-file", envFile], env)).toEqual({
        exitCode: 0,
        stderr: "",
        stdout: "beta-user\n",
      })
      expect(await cliRun(["credentials", "get", "admin", "--output", "json"], env)).toEqual({
        exitCode: 0,
        stderr: "",
        stdout: '{"password":"alpha-password","userId":"alpha-user","username":"alpha@example.test"}\n',
      })
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("reports missing users, profiles, and output fields without exposing secrets", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-credentials-cli-"))
    const env = { HOME: directory, XDG_CONFIG_HOME: directory }
    const paths = zitadelConfigPaths(env)
    try {
      await mkdir(paths.credentialsDirectory, { recursive: true })
      await writeJson(paths.configFile, {
        defaultProfile: "alpha",
        profiles: { alpha: { baseUrl: "https://alpha.example", organizationId: "org-alpha" } },
      })
      await writeJson(
        join(paths.credentialsDirectory, "alpha.json"),
        {
          testUsers: {
            admin: { password: "do-not-leak", userId: "user-1", username: "admin@example.test" },
          },
          token: "secret-token",
        },
        0o600,
      )

      const missingUser = await cliRun(["credentials", "get", "unknown", "--field", "username"], env)
      expect(missingUser.exitCode).toBe(1)
      expect(missingUser.stderr).toContain('The test user "unknown" was not found')
      expect(missingUser.stderr).not.toContain("do-not-leak")
      expect(missingUser.stderr).not.toContain("secret-token")

      const missingProfile = await cliRun(
        ["credentials", "get", "admin", "--field", "username", "--profile", "missing"],
        env,
      )
      expect(missingProfile.exitCode).toBe(1)
      expect(missingProfile.stderr).toContain("selected credential profile was not found")
      expect(missingProfile.stderr).not.toContain("do-not-leak")
      expect(missingProfile.stderr).not.toContain("secret-token")

      const missingField = await cliRun(["credentials", "get", "admin"], env)
      expect(missingField.exitCode).toBe(1)
      expect(missingField.stderr).toContain("Specify --field or --output json")
      expect(missingField.stderr).not.toContain("do-not-leak")
      expect(missingField.stderr).not.toContain("secret-token")
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("rejects an invalid field at the CLI boundary", async () => {
    const result = await cliRun(["credentials", "get", "admin", "--field", "email"], {
      HOME: "/tmp",
      XDG_CONFIG_HOME: "/tmp",
    })

    expect(result.exitCode).not.toBe(0)
    expect(result.stderr).toContain('Expected "email"')
    expect(result.stderr).toContain("username")
  })
})
