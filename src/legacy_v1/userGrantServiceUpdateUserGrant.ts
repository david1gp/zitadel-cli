import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type UserGrantServiceUpdateUserGrantRequest = {
  readonly roleKeys: readonly string[]
}

export type UserGrantServiceUpdateUserGrantOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly grantId: string
  readonly request: UserGrantServiceUpdateUserGrantRequest
  readonly token?: string
  readonly userId: string
}

export async function userGrantServiceUpdateUserGrant(
  options: UserGrantServiceUpdateUserGrantOptions,
): PromiseResult<unknown> {
  return legacyManagementRequest({
    baseUrl: options.baseUrl,
    body: options.request,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    fetch: options.fetch,
    method: "PUT",
    operation: "userGrantServiceUpdateUserGrant",
    path: `/management/v1/users/${encodeURIComponent(options.userId)}/grants/${encodeURIComponent(options.grantId)}`,
    token: options.token,
  })
}
