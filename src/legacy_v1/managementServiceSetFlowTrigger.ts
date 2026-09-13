import type { PromiseResult } from "#result"
import { legacyManagementRequest } from "./legacyManagementRequest.js"
import type { EndpointCallOptions } from "../v2/internal/endpointCall.js"

export type ManagementServiceSetFlowTriggerRequest = {
  readonly actionIds: readonly string[]
}

export type ManagementServiceSetFlowTriggerOptions = EndpointCallOptions & {
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly flow: string
  readonly request: ManagementServiceSetFlowTriggerRequest
  readonly trigger: string
}

export async function managementServiceSetFlowTrigger(
  options: ManagementServiceSetFlowTriggerOptions,
): PromiseResult<unknown> {
  return legacyManagementRequest({
    ...options,
    body: options.request,
    fetch: options.fetch,
    method: "POST",
    operation: "managementServiceSetFlowTrigger",
    path: `/management/v1/flows/${encodeURIComponent(options.flow)}/trigger/${encodeURIComponent(options.trigger)}`,
    token: options.token,
  })
}
