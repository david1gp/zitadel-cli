import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type ManagementServiceSetFlowTriggerRequest = {
  readonly actionIds: readonly string[]
}

export type ManagementServiceSetFlowTriggerOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly flow: string
  readonly request: ManagementServiceSetFlowTriggerRequest
  readonly token?: string
  readonly trigger: string
}

export async function managementServiceSetFlowTrigger(
  options: ManagementServiceSetFlowTriggerOptions,
): PromiseResult<unknown> {
  return legacyManagementRequest({
    baseUrl: options.baseUrl,
    body: options.request,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    fetch: options.fetch,
    method: "POST",
    operation: "managementServiceSetFlowTrigger",
    path: `/management/v1/flows/${encodeURIComponent(options.flow)}/trigger/${encodeURIComponent(options.trigger)}`,
    token: options.token,
  })
}
