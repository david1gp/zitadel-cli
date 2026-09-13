import { createResult, createResultError, type PromiseResult } from "#result"
import { configJsonFileRead } from "./configJsonFileRead.js"
import { type ProjectConfig, projectConfigSchema } from "./projectConfig.js"
import { zitadelConfigPath } from "./zitadelConfigPath.js"
import { type ZitadelConfigEnvironment } from "./zitadelConfigPaths.js"

export type ProjectConfigReadOptions = {
  readonly env?: ZitadelConfigEnvironment
  readonly project: string
}

export async function projectConfigRead(options: ProjectConfigReadOptions): PromiseResult<ProjectConfig> {
  const op = "projectConfigRead"
  const pathResult = zitadelConfigPath({ env: options.env, kind: "project", name: options.project })
  if (!pathResult.success) return { ...pathResult, op }

  const configResult = await configJsonFileRead(pathResult.data, projectConfigSchema)
  if (!configResult.success) return { ...configResult, op }
  if (configResult.data === undefined) {
    return createResultError(op, "The selected project configuration was not found")
  }
  return createResult(configResult.data)
}
