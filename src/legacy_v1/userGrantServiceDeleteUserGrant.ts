import type { PromiseResult } from "#result"
import type { EndpointCallOptions } from "../v2/internal/endpointCall.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type UserGrantServiceDeleteUserGrantOptions = EndpointCallOptions & {
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly grantId: string
  readonly userId: string
}

export async function userGrantServiceDeleteUserGrant(
  options: UserGrantServiceDeleteUserGrantOptions,
): PromiseResult<unknown> {
  return legacyManagementRequest({
    ...options,
    fetch: options.fetch,
    method: "DELETE",
    operation: "userGrantServiceDeleteUserGrant",
    path: `/management/v1/users/${encodeURIComponent(options.userId)}/grants/${encodeURIComponent(options.grantId)}`,
    token: options.token,
  })
}
