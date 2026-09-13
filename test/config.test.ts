import { describe, expect, test } from "bun:test"
import { chmod, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import {
  credentialsConfigRead,
  zitadelConfigCreate,
  zitadelConfigPath,
  zitadelConfigPaths,
  zitadelConfigResolve,
} from "../src/config/index.js"

const writeJson = async (filePath: string, value: unknown, mode?: number) => {
  await writeFile(filePath, `${JSON.stringify(value)}\n`, { mode })
}

describe("central configuration", () => {
  test("uses XDG_CONFIG_HOME and falls back to HOME/.config", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-config-"))
    try {
      expect(zitadelConfigPaths({ XDG_CONFIG_HOME: directory, HOME: "/ignored" }).configDirectory).toBe(
        join(directory, "zitadel-cli"),
      )
      expect(zitadelConfigPaths({ HOME: directory }).configDirectory).toBe(join(directory, ".config", "zitadel-cli"))
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("resolves a project profile and credentials locally", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-config-"))
    const env = { HOME: directory, XDG_CONFIG_HOME: directory }
    const paths = zitadelConfigPaths(env)
    try {
      await mkdir(paths.credentialsDirectory, { recursive: true })
      await mkdir(paths.projectsDirectory, { recursive: true })
      await writeJson(paths.configFile, {
        defaultProfile: "alpha",
        profiles: {
          alpha: { baseUrl: "https://alpha.example", organizationId: "org-alpha" },
          beta: { baseUrl: "https://beta.example///", organizationId: "org-beta" },
        },
      })
      await writeJson(
        join(paths.credentialsDirectory, "beta.json"),
        {
          testUsers: {
            admin: { password: "password-value", userId: "user-1", username: "admin@example.test" },
          },
          token: "token-value",
        },
        0o600,
      )
      await writeJson(
        join(paths.credentialsDirectory, "alpha.json"),
        {
          testUsers: {},
          token: "alpha-token",
        },
        0o600,
      )
      await writeJson(join(paths.projectsDirectory, "application.json"), {
        profile: "beta",
        projectId: "project-1",
      })

      const result = await zitadelConfigResolve({ env, project: "application" })

      expect(result).toEqual({
        success: true,
        data: {
          baseUrl: "https://beta.example",
          organizationId: "org-beta",
          profile: "beta",
          project: "application",
          projectId: "project-1",
          token: "token-value",
        },
      })

      const credentials = await credentialsConfigRead({ env, project: "application" })
      expect(credentials).toMatchObject({
        success: true,
        data: {
          testUsers: {
            admin: { password: "password-value", userId: "user-1", username: "admin@example.test" },
          },
        },
      })

      const defaultCredentials = await credentialsConfigRead({ env })
      expect(defaultCredentials).toMatchObject({ success: true, data: { token: "alpha-token" } })
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("applies explicit options, environment, env file, project, and profile precedence", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-config-"))
    const env = {
      HOME: directory,
      XDG_CONFIG_HOME: directory,
      ZITADEL_BASE_URL: "https://environment.example",
      ZITADEL_ORGANIZATION_ID: "environment-org",
      ZITADEL_PROJECT_ID: "environment-project",
      ZITADEL_PROFILE: "alpha",
      ZITADEL_TOKEN: "environment-token",
    }
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
          testUsers: {},
          token: "central-token",
        },
        0o600,
      )
      await writeJson(join(paths.projectsDirectory, "application.json"), {
        profile: "beta",
        projectId: "project-central",
      })
      await writeFile(
        envFile,
        [
          "ZITADEL_BASE_URL=https://file.example",
          "ZITADEL_ORGANIZATION_ID=file-org",
          "ZITADEL_PROJECT_ID=file-project",
          "ZITADEL_PROFILE=beta",
          "ZITADEL_TOKEN=file-token",
          "",
        ].join("\n"),
      )

      const environmentResult = await zitadelConfigResolve({ env, envFile, project: "application" })
      expect(environmentResult).toMatchObject({
        success: true,
        data: {
          baseUrl: "https://environment.example",
          organizationId: "environment-org",
          profile: "alpha",
          project: "application",
          projectId: "environment-project",
          token: "environment-token",
        },
      })

      const explicitResult = await zitadelConfigCreate({
        baseUrl: "https://explicit.example///",
        env,
        envFile,
        organizationId: "explicit-org",
        profile: "beta",
        project: "application",
        projectId: "explicit-project",
        token: "explicit-token",
      })
      expect(explicitResult).toMatchObject({
        success: true,
        data: {
          baseUrl: "https://explicit.example",
          organizationId: "explicit-org",
          projectId: "explicit-project",
          token: "explicit-token",
        },
      })

      const fileResult = await zitadelConfigResolve({
        env: { HOME: directory, XDG_CONFIG_HOME: directory },
        envFile,
        project: "application",
      })
      expect(fileResult).toMatchObject({
        success: true,
        data: {
          baseUrl: "https://file.example",
          organizationId: "file-org",
          profile: "beta",
          projectId: "file-project",
          token: "file-token",
        },
      })
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("selects a project from the environment and lets an explicit profile override its profile", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-config-"))
    const env = { HOME: directory, XDG_CONFIG_HOME: directory, ZITADEL_PROJECT: "application" }
    const paths = zitadelConfigPaths(env)
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
      for (const profile of ["alpha", "beta"]) {
        await writeJson(
          join(paths.credentialsDirectory, `${profile}.json`),
          { testUsers: {}, token: `${profile}-token` },
          0o600,
        )
      }
      await writeJson(join(paths.projectsDirectory, "application.json"), { profile: "beta", projectId: "project-1" })

      const projectResult = await zitadelConfigResolve({ env })
      expect(projectResult).toMatchObject({
        success: true,
        data: {
          baseUrl: "https://beta.example",
          organizationId: "org-beta",
          profile: "beta",
          project: "application",
          projectId: "project-1",
          token: "beta-token",
        },
      })

      const explicitProfileResult = await zitadelConfigResolve({ env, profile: "alpha" })
      expect(explicitProfileResult).toMatchObject({
        success: true,
        data: {
          baseUrl: "https://alpha.example",
          organizationId: "org-alpha",
          profile: "alpha",
          project: "application",
          projectId: "project-1",
          token: "alpha-token",
        },
      })
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("reports invalid files and missing API secrets without disclosing secret values", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-config-"))
    const env = { HOME: directory, XDG_CONFIG_HOME: directory }
    const paths = zitadelConfigPaths(env)
    try {
      await mkdir(paths.configDirectory, { recursive: true })
      await writeFile(paths.configFile, '{"token":"central-secret-token"\n')
      const invalidCentral = await zitadelConfigResolve({ env })
      expect(invalidCentral.success).toBe(false)
      if (!invalidCentral.success) expect(invalidCentral.errorMessage).not.toContain("central-secret-token")

      await mkdir(paths.credentialsDirectory, { recursive: true })
      await writeJson(paths.configFile, {
        defaultProfile: "alpha",
        profiles: { alpha: { baseUrl: "https://alpha.example", organizationId: "org-alpha" } },
      })
      await writeFile(join(paths.credentialsDirectory, "alpha.json"), '{"token":"credential-secret-token"\n', {
        mode: 0o600,
      })
      const invalidCredentials = await credentialsConfigRead({ env })
      expect(invalidCredentials.success).toBe(false)
      if (!invalidCredentials.success) expect(invalidCredentials.errorMessage).not.toContain("credential-secret-token")

      await rm(paths.configFile, { force: true })
      const missingSecret = await zitadelConfigCreate({
        env: { ...env, ZITADEL_BASE_URL: "https://explicit.example" },
      })
      expect(missingSecret.success).toBe(false)
      if (!missingSecret.success) expect(missingSecret.errorMessage).toContain("token")
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("preserves explicit config short-circuiting and rejects unsafe or non-private credential paths", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-config-"))
    const env = { HOME: directory, XDG_CONFIG_HOME: directory }
    const paths = zitadelConfigPaths(env)
    try {
      const explicit = await zitadelConfigCreate({
        config: { baseUrl: "https://explicit.example///", token: "explicit-token" },
        envFile: join(directory, "missing.env"),
      })
      expect(explicit).toEqual({
        success: true,
        data: { baseUrl: "https://explicit.example", token: "explicit-token" },
      })

      const unsafe = zitadelConfigPath({ env, kind: "credentials", name: "../outside" })
      expect(unsafe.success).toBe(false)

      await mkdir(paths.credentialsDirectory, { recursive: true })
      const credentialsPath = join(paths.credentialsDirectory, "unsafe.json")
      await writeJson(credentialsPath, {
        testUsers: { admin: { password: "do-not-leak", userId: "user-1", username: "admin" } },
        token: "secret-token",
      })
      await chmod(credentialsPath, 0o644)
      const credentials = await credentialsConfigRead({ env, profile: "unsafe" })
      expect(credentials.success).toBe(false)
      if (!credentials.success) {
        expect(credentials.errorMessage).not.toContain("do-not-leak")
        expect(credentials.errorMessage).not.toContain("secret-token")
      }
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })
})
