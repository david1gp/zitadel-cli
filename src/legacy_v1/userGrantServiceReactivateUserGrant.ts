import type { PromiseResult } from "#result"
import { legacyManagementRequest } from "./legacyManagementRequest.js"
import type { EndpointCallOptions } from "../v2/internal/endpointCall.js"

export type UserGrantServiceReactivateUserGrantOptions = EndpointCallOptions & {
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly grantId: string
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
    ...options,
    body: {},
    fetch: options.fetch,
    method: "POST",
    operation: "userGrantServiceReactivateUserGrant",
    path: `/management/v1/users/${encodeURIComponent(options.userId)}/grants/${encodeURIComponent(options.grantId)}/_reactivate`,
    token: options.token,
  })
}
