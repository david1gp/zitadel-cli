import { createResult, createResultError, type PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { zitadelConfigCreate } from "../config/zitadelConfigCreate.js"

type LegacyManagementRequestOptions = {
  readonly baseUrl?: string
  readonly body?: unknown
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
  readonly method: "GET" | "POST" | "PUT"
  readonly operation: string
  readonly path: string
  readonly token?: string
}

const legacyManagementRequestErrorMessage = (error: unknown, token: string) => {
  const message = error instanceof Error ? error.message : String(error)
  return message.replaceAll(token, "[redacted]")
}

export async function legacyManagementRequest(options: LegacyManagementRequestOptions): PromiseResult<unknown> {
  const configResult = await zitadelConfigCreate({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    token: options.token,
  })
  if (!configResult.success) return configResult

  const config = configResult.data
  const fetchImplementation = options.fetch ?? globalThis.fetch
  let headers: Headers
  try {
    headers = new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    })
    if (config.organizationId !== undefined) headers.set("x-zitadel-orgid", config.organizationId)
  } catch (error) {
    return createResultError(
      options.operation,
      `ZITADEL request could not be prepared: ${legacyManagementRequestErrorMessage(error, config.token)}`,
    )
  }

  let response: Response
  try {
    response = await fetchImplementation(`${config.baseUrl}${options.path}`, {
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      headers,
      method: options.method,
    })
  } catch (error) {
    return createResultError(
      options.operation,
      `ZITADEL request failed: ${legacyManagementRequestErrorMessage(error, config.token)}`,
    )
  }

  if (!response.ok) {
    const statusText = response.statusText === "" ? "" : ` ${response.statusText}`
    return createResultError(options.operation, `ZITADEL request failed: HTTP ${response.status}${statusText}`)
  }

  let body: string
  try {
    body = await response.text()
  } catch (error) {
    return createResultError(
      options.operation,
      `ZITADEL response could not be read: ${legacyManagementRequestErrorMessage(error, config.token)}`,
    )
  }
  if (body.trim() === "") return createResult(undefined)

  try {
    return createResult(JSON.parse(body) as unknown)
  } catch (error) {
    return createResultError(
      options.operation,
      `ZITADEL response was not valid JSON: ${legacyManagementRequestErrorMessage(error, config.token)}`,
    )
  }
}
