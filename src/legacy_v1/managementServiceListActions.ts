import { createResult, createResultError, type PromiseResult, type Result } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type ManagementServiceListActionsRequest = {
  readonly query: {
    readonly asc: boolean
    readonly limit: number
    readonly offset: number
  }
}

export const LegacyActionState = {
  ACTIVE: "ACTION_STATE_ACTIVE",
  INACTIVE: "ACTION_STATE_INACTIVE",
  UNSPECIFIED: "ACTION_STATE_UNSPECIFIED",
} as const

export type LegacyActionState = (typeof LegacyActionState)[keyof typeof LegacyActionState]

export type LegacyAction = {
  readonly id: string
  readonly name: string
  readonly state: LegacyActionState
}

export type ManagementServiceListActionsResponse = {
  readonly details?: { readonly totalResult?: bigint }
  readonly result: readonly LegacyAction[]
}

export type ManagementServiceListActionsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly request: ManagementServiceListActionsRequest
  readonly token?: string
}

const managementServiceListActionsError = (message: string) =>
  createResultError("managementServiceListActions", message)

const managementServiceListActionsTotalParse = (value: unknown): Result<bigint | undefined> => {
  if (value === undefined) return createResult(undefined)
  if (typeof value === "bigint" && value >= 0n) return createResult(value)
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) return createResult(BigInt(value))
  if (typeof value === "string" && /^[0-9]+$/u.test(value)) return createResult(BigInt(value))
  return managementServiceListActionsError("action response has an invalid totalResult")
}

const managementServiceListActionsStateParse = (value: unknown): Result<LegacyActionState> => {
  if (
    value === LegacyActionState.ACTIVE ||
    value === LegacyActionState.INACTIVE ||
    value === LegacyActionState.UNSPECIFIED
  ) {
    return createResult(value)
  }
  return managementServiceListActionsError("action response contains an invalid state")
}

export async function managementServiceListActions(
  options: ManagementServiceListActionsOptions,
): PromiseResult<ManagementServiceListActionsResponse> {
  const responseResult = await legacyManagementRequest({
    baseUrl: options.baseUrl,
    body: options.request,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    fetch: options.fetch,
    method: "POST",
    operation: "managementServiceListActions",
    path: "/management/v1/actions/_search",
    token: options.token,
  })
  if (!responseResult.success) return responseResult
  if (typeof responseResult.data !== "object" || responseResult.data === null || Array.isArray(responseResult.data)) {
    return managementServiceListActionsError("action response is not an object")
  }
  const candidate = responseResult.data as Record<string, unknown>
  if (!Array.isArray(candidate.result)) return managementServiceListActionsError("action response has no result list")
  const detailsValue = candidate.details
  if (
    detailsValue !== undefined &&
    (typeof detailsValue !== "object" || detailsValue === null || Array.isArray(detailsValue))
  ) {
    return managementServiceListActionsError("action response has invalid pagination details")
  }
  const details = detailsValue as Record<string, unknown> | undefined
  const totalResult = managementServiceListActionsTotalParse(details?.totalResult)
  if (!totalResult.success) return totalResult
  const result: LegacyAction[] = []
  for (const item of candidate.result) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return managementServiceListActionsError("action response contains a malformed result")
    }
    const action = item as Record<string, unknown>
    const state = managementServiceListActionsStateParse(action.state)
    if (!state.success) return state
    if (typeof action.id !== "string" || action.id === "" || typeof action.name !== "string" || action.name === "") {
      return managementServiceListActionsError("action response contains a malformed result")
    }
    result.push({ id: action.id, name: action.name, state: state.data })
  }
  return createResult({
    details: totalResult.data === undefined ? undefined : { totalResult: totalResult.data },
    result,
  })
}
