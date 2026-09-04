import { createResult, createResultError, type PromiseResult, type Result } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { legacyManagementRequest } from "./legacyManagementRequest.js"

export type AdminServiceListOrganizationsRequest = {
  readonly query: {
    readonly asc: boolean
    readonly limit: number
    readonly offset: number
  }
  readonly queries: readonly [
    {
      readonly query: { readonly case: "nameQuery"; readonly value: { readonly method: number; readonly name: string } }
    },
  ]
}

export type LegacyOrganization = {
  readonly id: string
  readonly name: string
}

export type AdminServiceListOrganizationsResponse = {
  readonly details?: { readonly totalResult?: bigint }
  readonly result: readonly LegacyOrganization[]
}

export type AdminServiceListOrganizationsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly request: AdminServiceListOrganizationsRequest
  readonly token?: string
}

const adminServiceListOrganizationsError = (message: string) =>
  createResultError("adminServiceListOrganizations", message)

const adminServiceListOrganizationsTotalParse = (value: unknown): Result<bigint | undefined> => {
  if (value === undefined) return createResult(undefined)
  if (typeof value === "bigint" && value >= 0n) return createResult(value)
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) return createResult(BigInt(value))
  if (typeof value === "string" && /^[0-9]+$/u.test(value)) return createResult(BigInt(value))
  return adminServiceListOrganizationsError("organization response has an invalid totalResult")
}

export async function adminServiceListOrganizations(
  options: AdminServiceListOrganizationsOptions,
): PromiseResult<AdminServiceListOrganizationsResponse> {
  const responseResult = await legacyManagementRequest({
    baseUrl: options.baseUrl,
    body: options.request,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    fetch: options.fetch,
    method: "POST",
    operation: "adminServiceListOrganizations",
    path: "/admin/v1/orgs/_search",
    token: options.token,
  })
  if (!responseResult.success) return responseResult
  if (typeof responseResult.data !== "object" || responseResult.data === null || Array.isArray(responseResult.data)) {
    return adminServiceListOrganizationsError("organization response is not an object")
  }
  const candidate = responseResult.data as Record<string, unknown>
  if (!Array.isArray(candidate.result))
    return adminServiceListOrganizationsError("organization response has no result list")
  const detailsValue = candidate.details
  if (
    detailsValue !== undefined &&
    (typeof detailsValue !== "object" || detailsValue === null || Array.isArray(detailsValue))
  ) {
    return adminServiceListOrganizationsError("organization response has invalid pagination details")
  }
  const details = detailsValue as Record<string, unknown> | undefined
  const totalResult = adminServiceListOrganizationsTotalParse(details?.totalResult)
  if (!totalResult.success) return totalResult
  const result: LegacyOrganization[] = []
  for (const item of candidate.result) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return adminServiceListOrganizationsError("organization response contains a malformed result")
    }
    const organization = item as Record<string, unknown>
    if (typeof organization.id !== "string" || organization.id === "" || typeof organization.name !== "string") {
      return adminServiceListOrganizationsError("organization response contains a malformed result")
    }
    result.push({ id: organization.id, name: organization.name })
  }
  return createResult({
    details: totalResult.data === undefined ? undefined : { totalResult: totalResult.data },
    result,
  })
}
