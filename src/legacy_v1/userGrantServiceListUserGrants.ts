import { createResult, createResultError, type PromiseResult, type Result } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type UserGrantServiceListUserGrantsRequest = {
  readonly queries: readonly UserGrantSearchQuery[]
  readonly query: {
    readonly asc: boolean
    readonly limit: number
    readonly offset: number
  }
}

export type UserGrantSearchQuery =
  | { readonly projectIdQuery: { readonly projectId: string } }
  | { readonly userIdQuery: { readonly userId: string } }

export const UserGrantState = {
  UNSPECIFIED: 0,
  ACTIVE: 1,
  INACTIVE: 2,
} as const

export type UserGrantState = (typeof UserGrantState)[keyof typeof UserGrantState]

export type UserGrant = {
  readonly id: string
  readonly orgId: string
  readonly projectId: string
  readonly roleKeys: readonly string[]
  readonly state: UserGrantState
  readonly userId: string
}

export type UserGrantServiceListUserGrantsResponse = {
  readonly result: readonly UserGrant[]
  readonly totalResult?: bigint
}

export type UserGrantServiceListUserGrantsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly request: UserGrantServiceListUserGrantsRequest
  readonly token?: string
}

const userGrantListError = (message: string) => createResultError("userGrantServiceListUserGrants", message)

const userGrantStateParse = (value: unknown): Result<UserGrantState> => {
  if (value === 0 || value === 1 || value === 2) return createResult(value)
  if (value === "USER_GRANT_STATE_UNSPECIFIED") return createResult(UserGrantState.UNSPECIFIED)
  if (value === "USER_GRANT_STATE_ACTIVE") return createResult(UserGrantState.ACTIVE)
  if (value === "USER_GRANT_STATE_INACTIVE") return createResult(UserGrantState.INACTIVE)
  return userGrantListError("user grant response contains an invalid state")
}

const userGrantListTotalParse = (value: unknown): Result<bigint | undefined> => {
  if (value === undefined) return createResult(undefined)
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || value < 0)
      return userGrantListError("user grant response has an invalid totalResult")
    return createResult(BigInt(value))
  }
  if (typeof value !== "string" || !/^[0-9]+$/u.test(value)) {
    return userGrantListError("user grant response has an invalid totalResult")
  }
  return createResult(BigInt(value))
}

const userGrantListItemParse = (value: unknown): Result<UserGrant> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return userGrantListError("user grant response contains a malformed result")
  }
  const candidate = value as Record<string, unknown>
  const stringFields = ["id", "userId", "projectId", "orgId"] as const
  if (stringFields.some((field) => typeof candidate[field] !== "string" || candidate[field] === "")) {
    return userGrantListError("user grant response contains a malformed result")
  }
  if (
    !Array.isArray(candidate.roleKeys) ||
    candidate.roleKeys.some((role) => typeof role !== "string" || role === "")
  ) {
    return userGrantListError("user grant response contains a malformed result")
  }
  const stateResult = userGrantStateParse(candidate.state)
  if (!stateResult.success) return stateResult
  const roleKeys = candidate.roleKeys as string[]
  if (new Set(roleKeys).size !== roleKeys.length) {
    return userGrantListError("user grant response contains duplicate role keys")
  }
  return createResult({
    id: candidate.id as string,
    orgId: candidate.orgId as string,
    projectId: candidate.projectId as string,
    roleKeys,
    state: stateResult.data,
    userId: candidate.userId as string,
  })
}

const userGrantListMetadataOnlyEmptyResponse = (
  candidate: Record<string, unknown>,
  details: Record<string, unknown> | undefined,
): boolean => {
  if (Object.hasOwn(candidate, "result") || details === undefined || Object.hasOwn(details, "totalResult")) return false
  const viewTimestamp = details.viewTimestamp
  if (
    typeof viewTimestamp !== "string" ||
    viewTimestamp === "" ||
    !/(?:Z|[+-][0-9]{2}:?[0-9]{2})$/u.test(viewTimestamp)
  ) {
    return false
  }
  return !Number.isNaN(Date.parse(viewTimestamp))
}

const userGrantListResponseParse = (value: unknown, limit: number): Result<UserGrantServiceListUserGrantsResponse> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return userGrantListError("user grant response is not an object")
  }
  const candidate = value as Record<string, unknown>
  if ("error" in candidate || "code" in candidate || "message" in candidate) {
    return userGrantListError("user grant response contains an error envelope")
  }
  const rawDetails = candidate.details
  if (
    rawDetails !== undefined &&
    (typeof rawDetails !== "object" || rawDetails === null || Array.isArray(rawDetails))
  ) {
    return userGrantListError("user grant response has invalid pagination details")
  }
  const details = rawDetails as Record<string, unknown> | undefined
  if (details !== undefined && ("error" in details || "code" in details || "message" in details)) {
    return userGrantListError("user grant response has invalid pagination details")
  }

  const rawItems = candidate.result
  const items: UserGrant[] = []
  if (!Object.hasOwn(candidate, "result")) {
    if (!userGrantListMetadataOnlyEmptyResponse(candidate, details)) {
      return userGrantListError("user grant response returned an invalid result list")
    }
    return createResult({ result: items, totalResult: undefined })
  }
  if (!Array.isArray(rawItems) || rawItems.length > limit) {
    return userGrantListError("user grant response returned an invalid result list")
  }
  for (const item of rawItems) {
    const itemResult = userGrantListItemParse(item)
    if (!itemResult.success) return itemResult
    items.push(itemResult.data)
  }
  if (details === undefined || !Object.hasOwn(details, "totalResult")) {
    return userGrantListError("user grant response has incomplete pagination details")
  }
  const totalResultParse = userGrantListTotalParse(details.totalResult)
  if (!totalResultParse.success) return totalResultParse
  if (totalResultParse.data !== undefined && totalResultParse.data < BigInt(items.length)) {
    return userGrantListError("user grant response returned too many results")
  }
  return createResult({ result: items, totalResult: totalResultParse.data })
}

export async function userGrantServiceListUserGrants(
  options: UserGrantServiceListUserGrantsOptions,
): PromiseResult<UserGrantServiceListUserGrantsResponse> {
  const responseResult = await legacyManagementRequest({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    fetch: options.fetch,
    method: "POST",
    operation: "userGrantServiceListUserGrants",
    path: "/management/v1/users/grants/_search",
    body: options.request,
    token: options.token,
  })
  if (!responseResult.success) return responseResult
  return userGrantListResponseParse(responseResult.data, options.request.query.limit)
}
