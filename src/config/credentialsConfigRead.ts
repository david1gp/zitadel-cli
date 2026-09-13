import { createResult, createResultError, type PromiseResult } from "#result"
import { configJsonFileRead } from "./configJsonFileRead.js"
import { type CredentialsConfig, credentialsConfigSchema } from "./credentialsConfig.js"
import { zitadelConfigPath } from "./zitadelConfigPath.js"
import { type ZitadelConfigEnvironment } from "./zitadelConfigPaths.js"
import { zitadelConfigResolve } from "./zitadelConfigResolve.js"

export type CredentialsConfigReadOptions = {
  readonly envFile?: string
  readonly env?: ZitadelConfigEnvironment
  readonly profile?: string
  readonly project?: string
}

export async function credentialsConfigRead(options: CredentialsConfigReadOptions): PromiseResult<CredentialsConfig> {
  const op = "credentialsConfigRead"
  const resolution = await zitadelConfigResolve({
    env: options.env,
    envFile: options.envFile,
    profile: options.profile,
    project: options.project,
    token: "local-credential-lookup",
  })
  if (!resolution.success) return { ...resolution, op }
  const profile = resolution.data.profile
  if (profile === undefined) {
    return createResultError(op, "A credential profile was not selected")
  }

  const pathResult = zitadelConfigPath({ env: options.env, kind: "credentials", name: profile })
  if (!pathResult.success) return { ...pathResult, op }

  const configResult = await configJsonFileRead(pathResult.data, credentialsConfigSchema, {
    allowMissing: true,
    private: true,
  })
  if (!configResult.success) return { ...configResult, op }
  if (configResult.data === undefined) {
    return createResultError(op, "The selected credential profile was not found")
  }
  return createResult(configResult.data)
}
