import { createResult, createResultError, type PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type LegacyFlowAction = {
  readonly id?: string
  readonly name?: string
}

export type LegacyFlowTriggerAction = {
  readonly actions: readonly LegacyFlowAction[]
  readonly triggerType: { readonly id: string | number }
}

export type LegacyFlow = {
  readonly triggerActions: readonly LegacyFlowTriggerAction[]
}

export type ManagementServiceGetFlowResponse = {
  readonly flow: LegacyFlow
}

export type ManagementServiceGetFlowOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly flow: string
  readonly token?: string
}

const managementServiceGetFlowError = (message: string) => createResultError("managementServiceGetFlow", message)

export async function managementServiceGetFlow(
  options: ManagementServiceGetFlowOptions,
): PromiseResult<ManagementServiceGetFlowResponse> {
  const responseResult = await legacyManagementRequest({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    fetch: options.fetch,
    method: "GET",
    operation: "managementServiceGetFlow",
    path: `/management/v1/flows/${encodeURIComponent(options.flow)}`,
    token: options.token,
  })
  if (!responseResult.success) return responseResult
  if (typeof responseResult.data !== "object" || responseResult.data === null || Array.isArray(responseResult.data)) {
    return managementServiceGetFlowError("flow response is not an object")
  }
  const candidate = responseResult.data as Record<string, unknown>
  const flowValue = candidate.flow
  if (typeof flowValue !== "object" || flowValue === null || Array.isArray(flowValue)) {
    return managementServiceGetFlowError("flow response has no flow")
  }
  const flow = flowValue as Record<string, unknown>
  if (!Array.isArray(flow.triggerActions)) return managementServiceGetFlowError("flow response has no trigger actions")
  const triggerActions: LegacyFlowTriggerAction[] = []
  for (const item of flow.triggerActions) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return managementServiceGetFlowError("flow response contains a malformed trigger")
    }
    const trigger = item as Record<string, unknown>
    const triggerType = trigger.triggerType
    if (typeof triggerType !== "object" || triggerType === null || Array.isArray(triggerType)) {
      return managementServiceGetFlowError("flow response contains a malformed trigger")
    }
    const triggerId = (triggerType as Record<string, unknown>).id
    if ((typeof triggerId !== "string" && typeof triggerId !== "number") || !Array.isArray(trigger.actions)) {
      return managementServiceGetFlowError("flow response contains a malformed trigger")
    }
    const actions: LegacyFlowAction[] = []
    for (const actionValue of trigger.actions) {
      if (typeof actionValue !== "object" || actionValue === null || Array.isArray(actionValue)) {
        return managementServiceGetFlowError("flow response contains a malformed action")
      }
      const action = actionValue as Record<string, unknown>
      if (action.id !== undefined && (typeof action.id !== "string" || action.id === "")) {
        return managementServiceGetFlowError("flow response contains a malformed action")
      }
      if (action.name !== undefined && typeof action.name !== "string") {
        return managementServiceGetFlowError("flow response contains a malformed action")
      }
      actions.push({
        id: action.id as string | undefined,
        name: action.name as string | undefined,
      })
    }
    triggerActions.push({ actions, triggerType: { id: triggerId } })
  }
  return createResult({ flow: { triggerActions } })
}
