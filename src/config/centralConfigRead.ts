import { type PromiseResult } from "#result"
import { type CentralConfig, centralConfigSchema } from "./centralConfig.js"
import { configJsonFileRead } from "./configJsonFileRead.js"
import { type ZitadelConfigEnvironment, zitadelConfigPaths } from "./zitadelConfigPaths.js"

export type CentralConfigReadOptions = {
  readonly env?: ZitadelConfigEnvironment
}

export async function centralConfigRead(
  options: CentralConfigReadOptions = {},
): PromiseResult<CentralConfig | undefined> {
  const op = "centralConfigRead"
  const paths = zitadelConfigPaths(options.env)
  const result = await configJsonFileRead(paths.configFile, centralConfigSchema, { allowMissing: true })
  if (!result.success) return { ...result, op }
  return result
}
