import type { PromiseResult } from "#result"
import { legacyManagementRequest } from "./legacyManagementRequest.js"
import type { EndpointCallOptions } from "../v2/internal/endpointCall.js"

export type ManagementServiceDeactivateActionOptions = EndpointCallOptions & {
  readonly actionId: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
}

export async function managementServiceDeactivateAction(
  options: ManagementServiceDeactivateActionOptions,
): PromiseResult<unknown> {
  return legacyManagementRequest({
    ...options,
    body: {},
    fetch: options.fetch,
    method: "POST",
    operation: "managementServiceDeactivateAction",
    path: `/management/v1/actions/${encodeURIComponent(options.actionId)}/_deactivate`,
    token: options.token,
  })
}
