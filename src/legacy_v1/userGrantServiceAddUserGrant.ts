import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type UserGrantServiceAddUserGrantRequest = {
  readonly projectId: string
  readonly roleKeys: readonly string[]
}

export type UserGrantServiceAddUserGrantOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly request: UserGrantServiceAddUserGrantRequest
  readonly token?: string
  readonly userId: string
}

export async function userGrantServiceAddUserGrant(
  options: UserGrantServiceAddUserGrantOptions,
): PromiseResult<unknown> {
  return legacyManagementRequest({
    baseUrl: options.baseUrl,
    body: options.request,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    fetch: options.fetch,
    method: "POST",
    operation: "userGrantServiceAddUserGrant",
    path: `/management/v1/users/${encodeURIComponent(options.userId)}/grants`,
    token: options.token,
  })
}
