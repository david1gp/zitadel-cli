import { createResult, createResultError, type PromiseResult } from "#result"
import { centralConfigRead } from "./centralConfigRead.js"
import { type ProfileConfig } from "./profileConfig.js"
import { type ZitadelConfigEnvironment } from "./zitadelConfigPaths.js"

export type ProfileConfigReadOptions = {
  readonly env?: ZitadelConfigEnvironment
  readonly profile: string
}

export async function profileConfigRead(options: ProfileConfigReadOptions): PromiseResult<ProfileConfig> {
  const op = "profileConfigRead"
  const centralResult = await centralConfigRead({ env: options.env })
  if (!centralResult.success) return { ...centralResult, op }
  const profile = centralResult.data?.profiles[options.profile]
  if (profile === undefined) {
    return createResultError(op, "The selected profile configuration was not found")
  }
  return createResult(profile)
}
