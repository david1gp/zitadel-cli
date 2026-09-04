import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type UserGrantServiceReactivateUserGrantOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly grantId: string
  readonly token?: string
  readonly userId: string
}

/**
 * Reactivates a deactivated legacy Management user grant.
 *
 * The user and grant IDs are path parameters. The legacy endpoint uses a
 * request body wildcard, so an empty JSON object is sent deliberately.
 */
export async function userGrantServiceReactivateUserGrant(
  options: UserGrantServiceReactivateUserGrantOptions,
): PromiseResult<unknown> {
  return legacyManagementRequest({
    baseUrl: options.baseUrl,
    body: {},
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    fetch: options.fetch,
    method: "POST",
    operation: "userGrantServiceReactivateUserGrant",
    path: `/management/v1/users/${encodeURIComponent(options.userId)}/grants/${encodeURIComponent(options.grantId)}/_reactivate`,
    token: options.token,
  })
}
