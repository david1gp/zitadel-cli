import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type ManagementServiceDeactivateActionOptions = {
  readonly actionId: string
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly token?: string
}

export async function managementServiceDeactivateAction(
  options: ManagementServiceDeactivateActionOptions,
): PromiseResult<unknown> {
  return legacyManagementRequest({
    baseUrl: options.baseUrl,
    body: {},
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    fetch: options.fetch,
    method: "POST",
    operation: "managementServiceDeactivateAction",
    path: `/management/v1/actions/${encodeURIComponent(options.actionId)}/_deactivate`,
    token: options.token,
  })
}
