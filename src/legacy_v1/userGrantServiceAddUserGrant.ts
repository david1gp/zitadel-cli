import type { PromiseResult } from "#result"
import { legacyManagementRequest } from "./legacyManagementRequest.js"
import type { EndpointCallOptions } from "../v2/internal/endpointCall.js"

export type UserGrantServiceAddUserGrantRequest = {
  readonly projectId: string
  readonly roleKeys: readonly string[]
}

export type UserGrantServiceAddUserGrantOptions = EndpointCallOptions & {
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly request: UserGrantServiceAddUserGrantRequest
  readonly userId: string
}

export async function userGrantServiceAddUserGrant(
  options: UserGrantServiceAddUserGrantOptions,
): PromiseResult<unknown> {
  return legacyManagementRequest({
    ...options,
    body: options.request,
    fetch: options.fetch,
    method: "POST",
    operation: "userGrantServiceAddUserGrant",
    path: `/management/v1/users/${encodeURIComponent(options.userId)}/grants`,
    token: options.token,
  })
}
